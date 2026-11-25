---
id: custom_page
title: "Custom Challenge Page"
sidebar_label: "Custom challenge page"
description: "Replace the built-in CrowdSec challenge page with your own HTML: where the file lives, the data it receives, how to follow the challenge status, and how to set the title, meta tags and variables from hooks."
sidebar_position: 6
---

The challenge page is what a visitor sees while CrowdSec checks their browser. You can replace the built-in page with your own HTML, to match your site's branding, language or wording. This page shows you how to write that page, load it, and fill it per request from hooks.

The challenge itself doesn't change: your page carries the same proof-of-work, fingerprint collection and cookie handling as the built-in one. To change what the challenge detects, see [Custom detection scripts](custom_js.md). To change who gets challenged, see [Customization & recipes](customization.md).

## Before you begin

- Bot detection is enabled and serves the built-in challenge page. See [Enable bot detection](enable.md).
- You know where your CrowdSec data directory is. It's `/var/lib/crowdsec/data/` by default, and `config_paths.data_dir` in `/etc/crowdsec/config.yaml` otherwise.

## Create the page

1. Write your page as an HTML file under the data directory, for example `/var/lib/crowdsec/data/challenge/mycorp-page.html`. Start from the [example page](#example-page).

   The page must contain `{{.CrowdsecChallenge}}`, which inserts the challenge itself. Without it, the page can't be solved, and CrowdSec refuses to load it.

   Put `{{.CrowdsecChallenge}}` exactly once, outside any `{{if}}`, `{{with}}` or `{{range}}`. CrowdSec checks the page only once, with every value empty, when it loads it. A placeholder that depends on a value set by a hook can disappear from real requests, and visitors then get a page they can't solve.

1. Point `template_path` at the file in an appsec-config overlay. The path is relative to the data directory:

   ```yaml
   # /etc/crowdsec/appsec-configs/mycorp-challenge-page.yaml
   name: mycorp/appsec-bot-challenge-page
   challenge:
     template_path: challenge/mycorp-page.html
   ```

   Load the overlay from your AppSec acquisition, like any other [overlay](customization.md#recipes).

1. Check the configuration:

   ```bash
   sudo crowdsec -t
   ```

   If the page can't be used, the command fails and names the file and the reason, for example:

   ```
   FATAL crowdsec init: while loading acquisition config: /etc/crowdsec/acquis.d/appsec.yaml: datasource of type appsec: unable to build challenge options: invalid challenge template_path: challenge template /var/lib/crowdsec/data/challenge/mycorp-page.html: the page must contain {{.CrowdsecChallenge}}, which carries the challenge itself
   ```

1. Reload CrowdSec:

   ```bash
   sudo systemctl reload crowdsec
   ```

1. Confirm that CrowdSec uses your page. The CrowdSec log shows:

   ```
   level=info msg="using custom challenge page challenge/mycorp-page.html"
   ```

   Then open a challenged URL in a browser.

CrowdSec reads the file once, when it loads the configuration. After you edit the page, run `sudo crowdsec -t` and reload CrowdSec again.

### Where the file can live

`template_path` must be a relative path that stays inside the data directory. CrowdSec refuses an absolute path, or a path that leaves the data directory with `..`. The page is served to every challenged visitor, so this keeps what can be published in one reviewable place. A symbolic link inside the data directory is followed, wherever it points.

In Docker, the data directory is already a volume (see [Docker installation](/u/getting_started/installation/docker)). Put the page in that volume, or mount the file into it:

```bash
--volume /srv/crowdsec/mycorp-page.html:/var/lib/crowdsec/data/challenge/mycorp-page.html:ro
```

In Kubernetes, mount the page into the AppSec pod's data directory, for example from a ConfigMap.

### Overlays and the built-in page

`template_path` merges like every other `challenge:` field: when several loaded appsec-configs set it, the last one wins. A later appsec-config that sets `template_path: ""` brings back the built-in page.

## Example page

The following page is a complete starting point. It shows a status line that follows the challenge, uses no external files, and switches to French when a hook sets the `lang` variable (see [Set the title, meta tags and variables](#set-the-title-meta-tags-and-variables)):

```html
<!DOCTYPE html>
<html lang="{{or .Vars.lang "en"}}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{{.Title}}</title>
  {{.Meta}}
  <style>
    body { margin: 0; min-height: 100vh; display: grid; place-items: center;
           font-family: system-ui, sans-serif; color: #1f2937; }
    main { max-width: 32rem; padding: 1.5rem; text-align: center; }
    #status.error { color: #b91c1c; }
  </style>
</head>
<body>
  <main>
    <h1>Mycorp</h1>
    <p id="status" role="status" aria-live="polite"></p>
    <noscript><p>This check needs JavaScript. Enable it, then reload the page.</p></noscript>
  </main>

  {{.CrowdsecChallenge}}

  <script>
    const fr = document.documentElement.lang === "fr";
    const messages = {
      "pending":          [fr ? "Vérification de votre navigateur…" : "Checking your browser…", false],
      "ok":               [fr ? "Vérifié. Chargement de la page…" : "Verified. Loading the page…", false],
      "failed":           [fr ? "La vérification a échoué. Rechargez la page." : "The check failed. Reload the page to try again.", true],
      "rejected":         [fr ? "Votre navigateur a été identifié comme automatisé." : "Your browser was identified as automated.", true],
      "cookies-disabled": [fr ? "Activez les cookies pour ce site, puis rechargez la page." : "This check needs cookies. Enable them for this site, then reload the page.", true],
    };
    messages["fail"] = messages["failed"];

    function show(status) {
      const [text, isError] = messages[status] || messages["pending"];
      const el = document.getElementById("status");
      el.textContent = text;
      el.classList.toggle("error", isError);
    }

    window.addEventListener("crowdsec-challenge-status", (event) => show(event.detail.status));
    show(window.__crowdsecChallengeStatus);
  </script>
</body>
</html>
```

`{{.CrowdsecChallenge}}` also adds a small "Security check powered by CrowdSec" label in the bottom-right corner of the page. Its styles are scoped, so your CSS doesn't affect it.

## Template data

The page is a Go [`text/template`](https://pkg.go.dev/text/template). It receives the following values:

| Value | Content |
|---|---|
| `{{.CrowdsecChallenge}}` | The challenge: the status script, the proof-of-work, the fingerprint collection and the attribution label. Required. |
| `{{.Title}}` | The page title, HTML-escaped. `CrowdSec Challenge` unless a hook sets one with `SetChallengeTitle`. |
| `{{.Meta}}` | The `<meta>` tags set by hooks with `SetChallengeMeta`, as ready-to-use HTML. Empty when none is set. |
| `{{.Vars.NAME}}` | The value a hook set with `SetChallengeTemplateVar("NAME", …)`, HTML-escaped. Empty when no hook set it. |

These four values are the only supported ones. The page can reach other, internal values, but they belong to the challenge and can change in any release.

Template actions such as `{{if}}`, `{{or}}` and `{{eq}}` work as usual, for example `{{if eq .Vars.lang "fr"}}Bonjour{{else}}Hello{{end}}`.

## Set the title, meta tags and variables

Three helpers fill the page from hooks, so one page can serve several hosts, languages or sections:

| Helper | Type | Description |
|---|---|---|
| `SetChallengeTitle` | `func(title str)` | Sets `{{.Title}}`. At most 256 bytes. |
| `SetChallengeMeta` | `func(key str, value str)` | Adds a `<meta>` tag to `{{.Meta}}`, or replaces the value of one already set. `key` is `description`, or starts with `og:` or `twitter:` (lowercase). Open Graph keys are written with `property=`, the others with `name=`. At most 32 tags, and 2048 bytes per value. |
| `SetChallengeTemplateVar` | `func(name str, value str)` | Sets `{{.Vars.NAME}}`. `name` starts with a letter or underscore, followed by letters, digits or underscores. At most 32 variables, and 2048 bytes per value. |

A call that breaks one of these limits is ignored, and CrowdSec logs an `unable to apply appsec … expr` error with the reason. The rest of the hook still runs.

Set page values in `pre_eval`. The page is built when `SendChallenge()` runs, so a value set after that, in the same hook or a later one, doesn't reach the visitor. The helpers are also available in `post_eval` and `on_challenge`, where they only work when called before `SendChallenge()` in that hook. A client that's challenged again from `on_challenge` (see [Re-challenge a returning client](customization.md#re-challenge-a-returning-client-whose-fingerprint-looks-off)) only gets values set in `on_challenge`, because `pre_eval` doesn't run for that request.

The following overlay sets the page, a title and a description per host, and the French version of the [example page](#example-page) for visitors whose browser prefers French:

```yaml
# /etc/crowdsec/appsec-configs/mycorp-challenge-page.yaml
name: mycorp/appsec-bot-challenge-page
challenge:
  template_path: challenge/mycorp-page.html
inband:
  pre_eval:
    - filter: req.Host == "shop.example.com"
      apply:
        - SetChallengeTitle("Example Shop")
        - SetChallengeMeta("description", "Checking your browser before you reach the shop.")
    - filter: req.Header.Get("Accept-Language") startsWith "fr"
      apply:
        - SetChallengeTemplateVar("lang", "fr")
```

:::warning
Values are only HTML-escaped. That makes them safe in page text and in quoted HTML attributes, such as `title="{{.Vars.x}}"`. They aren't safe inside a `<script>` block, in an unquoted attribute, as a URL (`href`, `src`) or in CSS. A value copied from the request, such as `req.URL.Path` or a header, is controlled by the visitor: in one of these places, it allows cross-site scripting. To use a value from JavaScript, put it in a `data-` attribute and read it with `element.dataset`.
:::

## Follow the challenge status

Your page shows the visitor what's happening by listening to the challenge status. The [example page](#example-page) handles every status.

The challenge reports its status in two ways:

- It dispatches a `crowdsec-challenge-status` event on `window`, with the status in `event.detail.status`.
- It keeps the latest status in `window.__crowdsecChallengeStatus`. Read it once when your script starts, in case you missed an event.

The first status is sent after the page's HTML is parsed, so a listener registered by a script anywhere on the page receives it. The statuses are:

| Status | Meaning | What happens next |
|---|---|---|
| `pending` | The check is running. It's the first status. | The challenge sends another status when it's done. |
| `ok` | The check passed. | The page reloads after 800 ms and the visitor reaches your site. |
| `failed` | CrowdSec refused the submission, for example because it expired. | Nothing. Ask the visitor to reload the page to get a new challenge. |
| `fail` | The check couldn't run in the browser, or the submission didn't reach CrowdSec. | Nothing. Treat it like `failed`. |
| `rejected` | CrowdSec identified the browser as automated. | Nothing. |
| `cookies-disabled` | The browser doesn't accept cookies, so the result of the check can't be stored. It replaces `pending` from the start. | Nothing. It's final: no later status replaces it, and the page doesn't reload. |

Only `ok` reloads the page. For every other final status, your page is the only thing that tells the visitor what to do.

The challenge needs JavaScript. Add a `<noscript>` message, as in the example page, for visitors who turned it off.

## Images, fonts and styles

Every challenge response carries the challenge's `Content-Security-Policy` (see [Content-Security-Policy](enable.md#content-security-policy)). It decides what your page can load:

- **Styles:** inline `<style>` blocks and `style=` attributes work. A stylesheet from another domain, such as a CDN, is blocked.
- **Images:** `data:` URIs work, for example an inline SVG logo. An image from another domain is blocked.
- **Fonts:** only fonts from your own site load. A font from another domain or a `data:` URI is blocked. Use a system font stack such as `system-ui, sans-serif`.
- **Scripts:** inline scripts work. A script from another domain is blocked.

A file from your own site, such as `/static/logo.png`, is allowed by the policy, but its request goes through CrowdSec like any other. If it's challenged, the browser gets a challenge page instead of the file. The `crowdsecurity/appsec-bot-challenge-exclude-static` config, part of the bot detection collection, exempts the usual static file extensions (`.css`, `.png`, `.svg`, `.woff2` and others). For any other path, exempt it with `ExemptFromChallenge` (see [Restrict the challenge to a specific path](customization.md#restrict-the-challenge-to-a-specific-path)).

Inline styles and `data:` images avoid both problems. They're the safest choice.

## Troubleshooting

### `<no value>` appears on the page

A top-level value that doesn't exist, for example a typo such as `{{.Titel}}`, prints `<no value>` instead of failing. Check the spelling against [Template data](#template-data). A variable that no hook set, `{{.Vars.NAME}}`, prints nothing.

### CrowdSec doesn't start, or `crowdsec -t` fails

An unusable page stops CrowdSec from loading the configuration, with an `invalid challenge template_path` error. The error gives the reason:

- The file doesn't exist, or the CrowdSec process can't read it.
- The path is absolute, or leaves the data directory.
- The page has a template syntax error.
- The page doesn't contain `{{.CrowdsecChallenge}}`. The placeholder must be rendered, so placing it inside a `{{if}}` that's false when CrowdSec checks the page counts as missing.

### Visitors get the built-in page

Your page loaded, but failed while rendering a specific request, for example `{{slice .Vars.ref 0 8}}` with a value shorter than 8 characters. CrowdSec serves the built-in page for that request, so the visitor is still challenged, and logs a warning with the template error at most once a minute:

```
level=warning msg="custom challenge page failed to render, serving the built-in page instead (logged at most once per 1m0s): …"
```

Fix the template so it handles every value a hook can set, then reload CrowdSec.

### A title, meta tag or variable doesn't show

- The hook sets it after `SendChallenge()`. See [Set the title, meta tags and variables](#set-the-title-meta-tags-and-variables).
- The value breaks a limit. Look for an `unable to apply appsec … expr` error in the CrowdSec log.
- The value is set from an out-of-band hook. Out-of-band hooks run after the response is sent, so they can't change the page.
