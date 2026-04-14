# Branch changes — jdv-cti-move-and-add-let-and-options

A summary of the conceptual changes introduced in this branch vs `main`, grouped by theme.

---

## 1. CTI / IP Reputation — separation of UI docs from API docs

**Core idea:** the CTI section previously mixed Web UI pages and API pages together under `cti_api/`. This branch splits them cleanly: UI-facing pages move to the Console, API-facing pages stay in `cti_api/`.

- `cti_api/getting_started` → renamed and moved to `console/ip_reputation/search_ui`
- `cti_api/ip_report` → moved to `console/ip_reputation/ip_report` (title changed from "Ip report" to "IP Reputation Report")
- `cti_api/advanced_search` → moved to `console/ip_reputation/search_ui_advanced`
- New `console/ip_reputation/intro` created as the landing page for the whole IP Reputation section in the Console
- New `console/ip_reputation/cve_explorer` created (full CVE Explorer reference, currently not wired into the sidebar)
- `cti_api/api_getting_started` (the old combined getting-started page that covered both UI and API) **deleted**

---

## 2. CTI sidebar restructured to reflect the split

- The `ctiApiSidebar` "Web UI" category (which listed `getting_started`, `ip_report`, `advanced_search`, `search_queries`, `cve_explorer`) is replaced by a single external link pointing to the Console IP Reputation section
- The `ctiApiSidebar` "API" category (which contained `api_getting_started` and the Swagger link) is replaced by a direct link to `cti_api/api_introduction`
- `search_queries` promoted to a top-level entry in `ctiApiSidebar` (renamed "Advanced Query Syntax")
- Taxonomy category and Swagger link moved after a visual separator, making the sidebar hierarchy: intro → Web UI link → API Access → Integrations → [separator] → Query Syntax → Taxonomy → [separator] → Swagger → FAQ

---

## 3. Console sidebar — IP Reputation added as a first-class section

- A new `"IP Reputation / CTI"` category added to `consoleSidebar` with its own structure:
  - Search UI (with Advanced Search nested inside, plus a cross-link to query syntax)
  - IP Reputation Report
  - API Keys (with Premium API Keys nested, plus cross-links to Integrations and Taxonomy)
- The old `consoleSidebar` entry `{ type: "link", label: "CTI", href: "/u/cti_api/intro" }` removed — replaced by the above proper category
- `Threat Forecast` moved earlier in the sidebar (now sits above IP Reputation, before Notification integrations)
- `Blocklists` moved lower in the sidebar, now placed after Decisions/Allowlists/Threat Forecast, separated by a visual `<hr>`
- `Notification integrations` moved later in the sidebar (was before Service API, now after Service API)
- Visual `<hr>` separators added between logical groups throughout the sidebar

---

## 4. New IP Reputation pages created

- `console/ip_reputation/intro` — overview of what IP Reputation / CTI offers: IP search, advanced search, IP report, Live Exploit Tracker, and API access with quota table
- `console/ip_reputation/api_keys` — step-by-step key creation with screenshots, plus an intro to integrations, curl, and the ipdex tool
- `console/ip_reputation/api_keys_premium` — explains Premium plan benefits (higher free quota + purchasable high-quota keys), pricing pointer, and a warning block about CTI key trial interactions
- `console/ip_reputation/cve_explorer` — full CVE Explorer reference (search, quick-filter cards, result list, detail page, exploitation timeline, detected IPs, blocklist wishlist)

---

## 5. Live Exploit Tracker introduced as the evolution of CVE Explorer

- Mentioned in `console/ip_reputation/intro` as the successor to CVE Explorer, living outside the Console at `tracker.crowdsec.net`
- Described as adding Opportunity Score, Momentum Score, Exploitation Status, and CVE timeline on top of what CVE Explorer offered
- The old `cti_api/cve_explorer` page remains on disk (orphaned — not wired into any sidebar on this branch)

---

## 6. CTI API introduction page rewritten

- `cti_api/api_introduction` previously had a minimal "Objective / Datasets / CTI Information / How to access it" structure
- Rewritten to: explain what the API is for, cover the two datasets (smoke/fire), authentication, and three usage paths — integrations (with link), cURL snippet, and ipdex (with both web UI and CLI described)
- The old `cti_api/intro` page (which had a TODO comment and mixed Web UI / API content) replaced with a clean API-focused intro: what the API gives you (table), datasets, taxonomy index, getting-started steps, integrations table

---

## 7. Integration intro page got a real introduction

- `cti_api/api_integration/integration_intro` previously had no intro text — just a table of integrations
- A short intro paragraph added explaining that native integrations exist, but curl and custom scripts/playbooks work too, with a curl snippet and Swagger link

---

## 8. ipdex page expanded to cover the Web UI

- `cti_api/api_integration/integration_ipdex` previously only documented the CLI
- Web UI section added (with `ipdex_demo.png` screenshot and link to `ipdex.crowdsec.net/docs`), CLI moved into its own subsection

---

## 9. "Enterprise" renamed to "Premium" throughout

- `console/enterprise_plan/enterprise_support` → `console/premium_upgrade/premium_support` (content updated: "Enterprise Support" → "Premium Support", "enterprise users" → "premium users", "enterprise grade organization" → "premium organization")
- `console/enterprise_plan/enterprise_invoices` → `console/premium_upgrade/premium_invoices` (image paths updated to match)
- `consoleSidebar` category "Enterprise plan" effectively replaced by the existing `premium_upgrade` section (the enterprise items now live under `premium_upgrade/`)
- Associated images moved from `console/enterprise_*` to `console/premium_*` folders

---

## 10. Console getting-started page reworked

- `console/getting_started` replaced from a simple `ConsolePromo` card layout (linking to Security Engine, CTI, Blocklists) to a proper sign-up guide with a themed screenshot, SSO/email options, email verification steps, and the onboarding survey
- The old content preserved as `console/getting_started-deprecated` (orphaned, not in the sidebar)

---

## 11. Navbar label change

- Top-level nav item "CTI" renamed to "IP Reputation & CTI"
- A new visual separator `<span class="navbar-separator">` added after the Console nav item
