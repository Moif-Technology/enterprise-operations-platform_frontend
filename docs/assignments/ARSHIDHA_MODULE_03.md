# Arshidha - Module 03: Customers, Sites, Contracts and AMC

## Active assignment and numbering

Arshidha's last assignment was Module 02, Assets and Basic Preventive Maintenance. Its latest submitted implementation is commit `c21a84c` on `feature/arshidha-module-02-assets-maintenance`. This next assignment is her Module 03. These personal assignment numbers differ from the product roadmap: this scope maps to roadmap Module 06, not Scheduling and Dispatch. Swetha retains Operations Core and Dispatch ownership.

This file is the current scope for Arshidha and supersedes the older Module-01-only and Module-02-only restrictions for her next work. Existing code is a baseline, not proof of product acceptance: report any inherited defects separately and preserve working asset/maintenance flows.

## Repository and setup

- Repository: https://github.com/Moif-Technology/enterprise-operations-platform_frontend.git
- Source branch: `sabeeh` (includes the submitted Module 02 baseline and this specification).
- Implementation branch: `feature/arshidha-module-03-customers-contracts`.
- PR target: `sabeeh`.

```bash
git clone --branch sabeeh https://github.com/Moif-Technology/enterprise-operations-platform_frontend.git
cd enterprise-operations-platform_frontend
git switch -c feature/arshidha-module-03-customers-contracts
pnpm install
pnpm dev
```

For an existing checkout: preserve uncommitted work, run `git fetch origin`, then `git switch -c feature/arshidha-module-03-customers-contracts origin/sabeeh`. If that branch already exists, inspect and integrate the latest source without resetting or discarding work. Open the URL printed by the dev server, normally http://localhost:3000.

Read `AGENTS.md`, `CLAUDE.md`, `docs/DESIGN_SYSTEM.md`, `docs/FRONTEND_DEVELOPER_SPLIT.md`, this file, and the Module 02 implementation before coding. In particular inspect `src/modules/assets/types.ts`, `mock-data.ts`, `service.ts`, and the existing asset form/detail views.

## Goal

Replace read-only customer/site fixtures with usable customer and site management, then add simple contract/AMC records linked to those customers, sites and assets. Keep the experience consistent with the asset registry and maintenance screens.

## Deliver in this order

1. **Customers:** list/search/filter, create, edit and detail. Fields: stable ID, unique code, name, active/inactive status, primary contact name, optional email/phone, address and notes. Validate required code/name, duplicate codes case-insensitively and optional email format. Detail shows linked sites, assets and contracts with working navigation.
2. **Sites:** list/search/filter by customer/status, create, edit and detail. Fields: stable ID, customer ID, code, name, address, optional location description/contact and active/inactive status. Require customer/code/name/address; site code must be unique within its customer. Detail shows that site's assets and contracts. Prevent changing a site's customer while assets or contracts reference it; explain the dependency. Use inactive status instead of deleting linked records.
3. **Shared records integration:** extend the existing Customer and Site types compatibly, preserve seed IDs, and expose a single mock data/service source to both new screens and Module 02 asset selectors. Creating a customer/site makes it selectable when registering an asset; edits update displayed labels across modules. Only eligible active customers/sites appear for new links, but existing inactive associations remain readable and are not silently removed. Do not maintain disconnected copies of customer/site fixtures.
4. **Contracts and AMC:** list/search/filter plus create/edit/detail. Fields: stable ID, unique contract number, title, customer, one or more customer-owned sites, covered assets, contract type (AMC/service contract), start/end dates, draft/active/cancelled lifecycle, service scope, exclusions, visit frequency description, optional nonnegative contract value and currency, and notes. Require number/title/customer/sites/type/dates/service scope. Start date must not follow end date. Filter assets by selected customer/sites and prevent incompatible coverage when selections change. Empty asset coverage is allowed for site-wide service and must be clearly labeled. No billing calculations.
5. **Coverage and SLA terms:** contract detail shows covered sites/assets, service frequency, scope/exclusions and simple response/resolution targets in hours. Targets must be positive when provided; response cannot exceed resolution. These are recorded terms only, not a real SLA timer or escalation engine. Link covered assets to existing asset details and show related contracts there. Do not imply maintenance plans were generated or changed by a contract.
6. **Expiry and renewal:** derive scheduled/active/expired display from dates for active contracts; draft/cancelled remain distinct. Show expiring within 30 days and expired lists using a documented local calendar-date convention and inclusive end date. Provide a Renew action that creates a new draft with a new ID/unique number linked to the original, copies relevant coverage/terms for review, and asks for new dates. Preserve the original record and prevent duplicate submission.

## Boundaries and UX

Frontend only, using typed mock data and adapters suitable for future APIs. Changes must stay consistent across views during the demo; document refresh/reset behavior. Use fictional contacts and records. Reuse shared forms, filters, badges, page headers, feedback states and shell. Add routes/navigation only where needed; follow the app's established route conventions.

Each page needs clear primary actions and usable save/cancel/back navigation. Include loading, error/retry, empty/no-results, success and unknown-record states. Use accessible labels, keyboard interactions and responsive layouts. Protect unsaved changes where navigation would lose form input.

Do not implement backend/database/authentication, production document uploads, e-signatures, legal drafting, invoices/payments, procurement, inventory, real notifications, production SLA automation or Swetha's Operations/Dispatch workflows. Contract documents may be clearly labeled metadata placeholders. Contract performance analytics are deferred until reliable operational data exists; do not invent live KPI values.

## Acceptance and verification

- Demo: create customer -> create site -> register asset using those records -> create AMC covering that asset -> open linked customer/site/asset/contract details -> find expiring contract -> renew into a separate draft.
- Saving/editing shared records updates dependent views without orphaned IDs. Existing Module 02 fixtures, asset creation and maintenance flows continue working.
- Exercise duplicate customer/contract codes, site-code uniqueness, invalid email/dates/SLA targets, incompatible asset coverage, inactive records and cancellation of form edits.
- Verify renewal and expiry boundaries: end date today, next 30 days, expired yesterday, scheduled future start, cancelled and draft exclusions; no duplicate renewal on double submission.
- Demonstrate loading/empty/no-results/error/success states and desktop/narrow-screen usability.
- Run `pnpm typecheck` and `pnpm build`; report actual results and inherited failures separately. Add focused tests for meaningful new validation/date/relationship logic if the repository supports them; do not add a large testing framework solely for this task.
- Submit a PR to `sabeeh` with screenshots or walkthrough, changed files, demo/reset steps, verification evidence and remaining API dependencies. Mark complete only after review.

## Copy-paste agent prompt

Implement Arshidha's Module 03 from `docs/assignments/ARSHIDHA_MODULE_03.md` in https://github.com/Moif-Technology/enterprise-operations-platform_frontend.git, starting from branch `sabeeh`. Preserve existing work and use `feature/arshidha-module-03-customers-contracts`. Read repository instructions, this entire specification, the design system and the Module 02 asset implementation first. Build Customers, Sites, Contracts and AMC, sharing customer/site records with the asset module. Implement only this scope with typed mock data and reusable UI. Complete every deliverable and acceptance check; do not merely summarize the task. Run the required checks, report results honestly and prepare a PR targeting `sabeeh` with demo evidence and outstanding dependencies.
