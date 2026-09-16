# Bing indexing investigation: docs.crowdsec.net

- **Date:** 2026-09-16
- **Trigger:** the query `crowdsec bot detection` returns the docs on page 1 of Google but only page 3 of Bing.
- **Evidence:**
  - Bing results pages, checked in a browser
  - `fetch()` requests against the live site (deploy of 2026-09-15)
  - DNS lookups
  - this repository at `40749553`

## TL;DR

Bing does not rank the bot detection pages poorly. **It has not indexed them at all.** For that query, the only docs page Bing can return is the generic AppSec intro (`/docs/appsec/intro`).

The pages were published with the 1.8.0 docs on 2026-08-31. On top of that, the site sends Bing many conflicting URL signals, which waste its crawl capacity:

1. Every canonical and sitemap URL redirects, and the page it lands on declares the redirecting URL as canonical.
2. `doc.crowdsec.net` serves a full copy of the site with HTTP 200, and many high-value backlinks point to it.
3. Unknown URLs redirect to the homepage with HTTP 200 (soft 404).
4. 850 of the 1,071 sitemap URLs are three copies of the same versioned docs, and 496 Markdown copies are also crawlable.
5. The sitemap has no `<lastmod>`.
6. Nothing pushes new URLs to Bing (no IndexNow).

Google tolerates these issues. Bing's guidelines say that crawl waste and duplicates limit indexing and delay the discovery of new content.

## 1. Symptoms on Bing

These results come from a French-market Bing session and vary by market and session.

| Query | Result |
|---|---|
| `crowdsec bot detection` | One docs result: `docs.crowdsec.net/docs/appsec/intro`, at #9 on page 1 and again on page 3. The other results are 1.8.0 news coverage (Help Net Security, linuxiac, …) and GitHub. |
| `url:https://docs.crowdsec.net/docs/next/appsec/bot_detection/intro` | No results (not indexed) |
| `url:https://docs.crowdsec.net/docs/appsec/bot_detection/intro` | No results (not indexed) |
| `url:https://docs.crowdsec.net/docs/appsec/intro` (control) | Indexed |
| `site:docs.crowdsec.net` | About 51 results, while the sitemap has 1,071 URLs |
| `site:doc.crowdsec.net` | Nothing indexed |

`site:` counts are estimates. Bing Webmaster Tools (BWT) is the source of truth.

## 2. Live site audit

| Check | Result | Verdict |
|---|---|---|
| `robots.txt` | 200, allows all crawlers, declares the sitemap | OK |
| Server-rendered HTML | Title, description, canonical and content are present without JavaScript | OK |
| Sitemap | 1,071 URLs. No `<lastmod>`. Every URL has `changefreq`/`priority`. 1,067 URLs have no trailing slash. | Issue |
| `/docs/next/appsec/bot_detection/intro` | Redirects to `…/intro/` (200). That page's canonical is `…/intro`. | Issue |
| Unknown URL (`/foo`) | `/foo` → `/foo/` → `/index.html`, ending in 200 | Issue |
| `https://doc.crowdsec.net/*` | Same build (identical ETags) served with 200, through a separate CloudFront distribution | Issue |
| `/docs/next/…/bot_detection/intro` vs `/docs/…/bot_detection/intro` | Identical body, title and description. Each page is its own canonical. | Issue |
| `llms.txt` | Lists 496 `.md` copies of the pages (200, `text/markdown`, no `X-Robots-Tag`). `llms-full.txt` is 3 MB. | Issue |
| Bing verification | No `msvalidate.01` meta tag and no `BingSiteAuth.xml`. Verification through DNS or a Google Search Console import can't be checked from outside. | Unknown |
| Internal links to bot detection | Linked from the AppSec pages, the Getting Started intro, allowlists and the sidebar. Not linked from the docs homepage. | Minor |

## 3. Findings and fixes

### 3.1 Canonical URLs redirect, and the redirect target points back (high)

**Evidence**
- `docusaurus.config.ts` does not set `trailingSlash`. Docusaurus therefore writes `…/intro/index.html`, but emits `…/intro` (no slash) in these places:
  - `<link rel="canonical">`
  - `og:url`
  - hreflang
  - the sitemap
  - internal links
- Amplify redirects `…/intro` to `…/intro/` whenever only `intro/index.html` exists. AWS describes this as intended behavior that can't be configured ([amplify-hosting#3421](https://github.com/aws-amplify/amplify-hosting/issues/3421)). Several amplify-hosting issues report the redirect as a 301.
- 1,067 of the 1,071 sitemap URLs are affected.

**Why it matters for Bing:** Bing asks for sitemaps that list only canonical URLs and leave out redirected ones. A canonical tag that points to a redirect sends contradictory signals, and every URL costs two fetches.

**Fix**
- Set `trailingSlash: true`. The emitted URLs then match what Amplify serves with a 200, and existing no-slash URLs keep redirecting to them.
- `trailingSlash: false` is not a good alternative. Docusaurus would emit `intro.html`, which Amplify serves at `/intro` without a redirect, but every slash URL copied from the address bar over the years would stop resolving.
- After the switch, check the Algolia crawler config, because the URLs of its records change.

### 3.2 `doc.crowdsec.net` mirrors the whole site (high)

**Evidence**
- `doc.crowdsec.net` is attached to the same Amplify app (identical ETags) and returns 200 instead of redirecting.
- Canonicals point to `docs.crowdsec.net`, but many high-value links use `doc.`:
  - the `crowdsecurity/crowdsec` README (7 links)
  - two crowdsec.net blog posts: the CrowdSec 1.8 launch post (including its bot detection link) and the nginx bot protection post
  - the v1.8.0 GitHub release notes (1 of 2 docs links)
  - 33 absolute links inside this repository
- Bing has nothing indexed on `doc.crowdsec.net`. The value of those links only reaches `docs.` through a cross-host canonical, and that canonical itself points to a redirect.

**Why it matters for Bing:** Bing recommends a 301 from every URL variant to a single preferred URL, and canonicals only for variants that must stay reachable ([duplicate content post, Dec 2025](https://blogs.bing.com/webmaster/December-2025/Does-Duplicate-Content-Hurt-SEO-and-AI-Search-Visibility)).

**Fix**
- Add this Amplify rewrite/redirect rule at the top of the list:

  | Source | Target | Type |
  |---|---|---|
  | `https://doc.crowdsec.net` | `https://docs.crowdsec.net` | 301 |

- Domain rules must not include a path: Amplify appends the path itself and silently ignores a source that contains one ([AWS docs](https://docs.aws.amazon.com/amplify/latest/userguide/redirect-rewrite-examples.html)).
- Then point the README, the blog posts and the in-repo links to `https://docs.crowdsec.net/…/`.

### 3.3 Soft 404s (high)

**Evidence**
- Any unknown path redirects twice and ends on the homepage with a 200. This applies to `/foo`, `/docs`, `/u` and mistyped doc URLs.
- The cause is a catch-all rule configured in the Amplify console. The rules are not versioned in this repository.
- As a side effect, the redirect fallback in `crowdsec-docs/src/theme/NotFound/Content/index.tsx` never runs in production.

**Why it matters for Bing:** error pages must return a 404 status. Otherwise Bing treats broken URLs as valid pages ([BWT 404 guidance](https://www.bing.com/webmasters/help/404-pages-best-practices-1c9f53b3)) and spends crawl capacity on them.

**Fix**
- Replace the catch-all with `/<*>` → `/404.html`, returning a real 404.
- AWS's example uses type `404`, but community reports disagree on what `404` and `404-200` actually return (amplify-hosting#70, #1623). Verify the result with curl (see section 5).
- After the change, confirm that `/docs/next/intro` still redirects to `/docs/next/intro/`. Catch-all rules have broken the trailing-slash behavior before ([amplify-hosting#251](https://github.com/aws-amplify/amplify-hosting/issues/251)).
- The NotFound fallback compares `pathname` with `redirects[].from` exactly. Normalize trailing slashes there once real 404s are served.

### 3.4 Duplicate content (medium-high)

**Evidence**
- **Versioned docs:** the sitemap contains 286 `/docs/next/` URLs (current), 286 `/docs/` URLs (v1.8) and 278 `/docs/v1.7/` URLs, 850 of 1,071 in total.
  - `/docs/next/…` and `/docs/…` are currently identical, and each page declares itself canonical.
  - Internal links and backlinks favor `/docs/next/`, yet the only docs page Bing returns for the query is the `/docs/` copy, so ranking signals are split.
- **Markdown copies:** `llms.txt` exposes 496 `.md` copies of the pages plus a 3 MB `llms-full.txt`. All of them are indexable.

**Why it matters for Bing:** according to Bing's guidelines, duplicates dilute signals. Together with crawl waste, they can limit indexing and delay the discovery of new content.

**Fix (no regrets)**
- Set `"v1.7": { noIndex: true }`, as already done for v1.6. This also removes v1.7 from the sitemap.
- In `customHttp.yml`, send `X-Robots-Tag: noindex` for `**/*.md`, `/llms.txt` and `/llms-full.txt`. LLM tools can still fetch these files.

**Decision needed: `/docs/next/` vs `/docs/` (v1.8)**

| Option | Change | Trade-off |
|---|---|---|
| A | `"v1.8": { noIndex: true }` | One line. It drops the `/docs/…` URLs that Google and Bing index today, and noindex passes no ranking signals, so expect a temporary dip. |
| B (recommended) | Swizzle (wrap) `DocItem/Metadata` so that v1.8 pages declare their `/docs/next/` equivalent as canonical (`useActiveDocContext().alternateDocVersions.current?.path`). Remove those URLs from the sitemap with `createSitemapItems`. | More code. Signals are consolidated without dropping URLs that currently rank. Check the canonical in the build output. |

### 3.5 The sitemap has no `<lastmod>` (medium)

**Evidence:** there is no `<lastmod>`, and every URL carries the defaults `changefreq: weekly` and `priority: 0.5`.

**Why it matters for Bing:**
- Bing uses lastmod as a key signal for deciding what to recrawl, and ignores changefreq and priority ([Feb 2023](https://blogs.bing.com/webmaster/february-2023/The-Importance-of-Setting-the-lastmod-Tag-in-Your-Sitemap), [Jul 2025](https://blogs.bing.com/webmaster/July-2025/Keeping-Content-Discoverable-with-Sitemaps-in-AI-Powered-Search)).
- Bing asks for ISO 8601 dates that include the time.

**Fix:** add this to the `preset-classic` options:

```ts
sitemap: { lastmod: "datetime", changefreq: null, priority: null },
```

Docusaurus 3.2 and later derives the dates from git history. Check the first build: if every URL has the same lastmod, Amplify cloned the repository without history. In that case, add `git fetch --unshallow` to `preBuild`, because a uniform lastmod is worse than none.

### 3.6 Nothing pushes new URLs to Bing (medium)

**Evidence**
- There is no IndexNow key and no IndexNow ping.
- There is no Bing verification tag or file on the site, although the site may still be verified through DNS or a Google Search Console import.

**Why it matters for Bing:**
- Bing generally crawls URLs submitted through IndexNow before other known URLs ([bing.com/indexnow](https://www.bing.com/indexnow/getstarted)).
- Without such signals, new URLs can take days to weeks to be discovered ([IndexNow launch post](https://blogs.bing.com/webmaster/october-2021/IndexNow-Instantly-Index-your-web-content-in-Search-Engines)).

**Fix, right after 3.1 ships**

In BWT (the site can be imported from Google Search Console):
- Submit `https://docs.crowdsec.net/sitemap.xml`.
- Run URL Inspection, then URL Submission, on the bot detection pages:
  - `/docs/next/appsec/bot_detection/intro/`
  - `/docs/next/appsec/bot_detection/enable/`
  - `/docs/next/appsec/bot_detection/whats_included/`
  - `/docs/next/appsec/bot_detection/how_it_works/`
  - `/docs/next/appsec/bot_detection/customization/`
  - `/docs/next/appsec/bot_detection/configuration/`
  - `/docs/next/appsec/bot_detection/hooks/`
  - `/docs/next/appsec/bot_detection/challenge_protocol/`

**Durable fix**
- Host an IndexNow key file in `crowdsec-docs/static/`.
- After each deploy, POST the changed URLs (for example, those whose lastmod changed) to `https://api.indexnow.org/indexnow` ([protocol](https://www.indexnow.org/documentation)).
- The ping must fire only once the deploy is live, so not in the `amplify.yml` `postBuild` phase. Two options:
  - an EventBridge rule on Amplify deployment events that triggers a Lambda
  - a GitHub Action that waits for the new build

### 3.7 Minor

- The docs homepage does not link to bot detection. A homepage card or an entry in the "Security Stack" navbar menu would make it more prominent.
- The page title (`Bot Detection | CrowdSec`), H1 and meta description already contain the query terms.

## 4. Action plan

1. **Amplify console:** add the `doc.` → `docs.` 301 rule and replace the catch-all with a real 404 (3.2, 3.3).
2. **Config PR:** `trailingSlash: true`, sitemap `lastmod`, `noIndex` for v1.7, and `X-Robots-Tag` for `.md` and `llms*.txt` (3.1, 3.4, 3.5).
3. **Right after deploy:** in BWT, submit the sitemap, then inspect and submit the bot detection URLs (3.6).
4. **Decide** between option A and option B for `/docs/next/` vs `/docs/` (3.4).
5. **IndexNow:** add the post-deploy ping (3.6).
6. **Links:** update the README, the crowdsec.net posts and the 33 in-repo `doc.crowdsec.net` links (3.2).
7. **Re-check after 2–3 weeks:** run the `url:` operator on the bot detection pages and check BWT's indexed pages and sitemap coverage.

## 5. Verification

```sh
# No-slash URL: 301 to …/intro/ today (status not captured yet)
curl -sI https://docs.crowdsec.net/docs/next/appsec/bot_detection/intro

# Mirror host: expect a 301 to https://docs.crowdsec.net/… once 3.2 ships
curl -sI https://doc.crowdsec.net/docs/next/appsec/bot_detection/intro/

# Unknown URL: expect 404 with no location header once 3.3 ships
curl -sI https://docs.crowdsec.net/this-page-does-not-exist

# Bingbot user agent gets the same response
curl -sI -A "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)" \
  https://docs.crowdsec.net/docs/next/appsec/bot_detection/intro/

# Current Amplify rules (console-only)
aws amplify get-app --app-id <app-id> --query 'app.customRules'

# Sitemap: URLs without trailing slash (expect 0 after 3.1), lastmod entries (expect > 0 after 3.5)
curl -s https://docs.crowdsec.net/sitemap.xml | grep -o '<loc>[^<]*</loc>' | grep -vc '/</loc>'
curl -s https://docs.crowdsec.net/sitemap.xml | grep -c '<lastmod>'
```

## 6. Not verified

- The Google ranking for the query. It was reported as page 1 but not re-checked.
- The exact HTTP status codes of Amplify's redirects. Browser `fetch()` hides them, and 301 comes from amplify-hosting issues.
- The current Amplify rewrite/redirect rules, and whether an AWS WAF is attached.
- BWT data: verification status, crawl errors and sitemap processing.
- Whether Bing indexed any `.md` or `llms-full.txt` URLs.
- Whether the Amplify build clones the repository shallowly.

## Sources

- [Bing Webmaster Guidelines](https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a)
- [Bing: the importance of lastmod (Feb 2023)](https://blogs.bing.com/webmaster/february-2023/The-Importance-of-Setting-the-lastmod-Tag-in-Your-Sitemap)
- [Bing: sitemaps in AI-powered search (Jul 2025)](https://blogs.bing.com/webmaster/July-2025/Keeping-Content-Discoverable-with-Sitemaps-in-AI-Powered-Search)
- [Bing: duplicate content and AI search visibility (Dec 2025)](https://blogs.bing.com/webmaster/December-2025/Does-Duplicate-Content-Hurt-SEO-and-AI-Search-Visibility)
- [Bing: 404 page best practices](https://www.bing.com/webmasters/help/404-pages-best-practices-1c9f53b3)
- [Bing IndexNow: get started](https://www.bing.com/indexnow/getstarted) and [IndexNow documentation](https://www.indexnow.org/documentation)
- [Bing: IndexNow launch post (Oct 2021)](https://blogs.bing.com/webmaster/october-2021/IndexNow-Instantly-Index-your-web-content-in-Search-Engines)
- [AWS Amplify: redirects and rewrites examples](https://docs.aws.amazon.com/amplify/latest/userguide/redirect-rewrite-examples.html)
- [AWS Amplify: custom headers](https://docs.aws.amazon.com/amplify/latest/userguide/setting-custom-headers.html)
- [amplify-hosting#3421: trailing slash redirect](https://github.com/aws-amplify/amplify-hosting/issues/3421), [#251: catch-all rule vs trailing slash](https://github.com/aws-amplify/amplify-hosting/issues/251)
- [Docusaurus: `trailingSlash`](https://docusaurus.io/docs/api/docusaurus-config#trailingSlash)
- [Docusaurus: sitemap plugin](https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-sitemap)
- [Docusaurus: docs plugin (`noIndex` per version)](https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-content-docs)
- [Docusaurus: last update dates with shallow clones](https://github.com/facebook/docusaurus/discussions/9734)
- [CrowdSec 1.8 launch post](https://www.crowdsec.net/blog/crowdsec-1-8-waf-bot-detection-kubernetes)
- [Help Net Security: bot detection in CrowdSec 1.8.0](https://www.helpnetsecurity.com/2026/09/01/crowdsec-1-8-0-bot-detection/)
