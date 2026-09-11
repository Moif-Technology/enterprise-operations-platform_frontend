# Arshidha - Module 02 Assignment: Assets and Basic Preventive Maintenance

## Goal and scope

Module 01 is complete per the project owner. This is the active assignment for Arshidha and supersedes the historical Module-01-only scope restrictions for her work. Continue reusing the established foundation. Here, "Arshidha Module 02" means her second assignment, not the Operations Core roadmap module.

## Get the assignment and start

Source branch: `sabeeh`. This branch includes Arshidha's Module 01 implementation and the assignment instructions; Module 02 business screens are the work to implement.

Fresh checkout:

```bash
git clone --branch sabeeh https://github.com/Moif-Technology/enterprise-operations-platform_frontend.git
cd enterprise-operations-platform_frontend
git switch -c feature/arshidha-module-02-assets-maintenance
pnpm install
pnpm dev
```

For an existing checkout, first preserve any uncommitted work, then run `git fetch origin` and create the work branch with `git switch -c feature/arshidha-module-02-assets-maintenance origin/sabeeh`. If that work branch already exists, inspect it and integrate the latest `origin/sabeeh` without resetting or discarding work.

Open the local URL printed by the dev server (normally http://localhost:3000). Read `AGENTS.md`, `CLAUDE.md`, `docs/DESIGN_SYSTEM.md`, `docs/FRONTEND_DEVELOPER_SPLIT.md`, and this entire assignment before implementation. Follow the installed framework documentation when required by AGENTS.md.

## Prompt for Claude, Codex, Cursor or another coding agent

```text
You are implementing Arshidha's assigned Module 02 in the Enterprise Operations Platform frontend.
Repository: https://github.com/Moif-Technology/enterprise-operations-platform_frontend.git
Assignment source branch: sabeeh
Assignment file: docs/assignments/ARSHIDHA_MODULE_02.md

If the repository is not open, clone branch sabeeh. If already open, preserve existing changes, fetch origin, and create/use feature/arshidha-module-02-assets-maintenance from origin/sabeeh. Do not reset or overwrite existing work.
Read AGENTS.md, CLAUDE.md, the full assignment file, its referenced documents, and the existing Module 01 implementation. Module 01 is complete. Implement only Arshidha's Module 02: Assets and Basic Preventive Maintenance. This is her second assignment; do not confuse it with Swetha's Operations Core scope.
Reuse shared components and the existing app shell. Build the asset list, register/edit form, asset details, maintenance plans, upcoming maintenance view and mock PM work-order handoff exactly within the assignment's boundaries. Use typed mock data; keep real backend integration out of scope.
Work through every deliverable and acceptance criterion. Run pnpm typecheck and pnpm build, verify the workflow and responsive UI, and report failures honestly. Finish with changed files, verification results, demo steps, and remaining dependencies. Prepare the implementation branch for review against sabeeh; do not mark the task complete until reviewed.
```

## Functional assignment

Build the asset registry and basic preventive maintenance frontend using the completed Module 01 design system. This is Arshidha's second assignment; it maps to project Module 04, Assets and Preventive Maintenance. Project Module 02, Operations Core, remains with Swetha under the existing developer split.

Repo: https://github.com/Moif-Technology/enterprise-operations-platform_frontend.git
Suggested branch: feature/arshidha-module-02-assets-maintenance

Start from the latest team-approved foundation. Read docs/DESIGN_SYSTEM.md, docs/FRONTEND_DEVELOPER_SPLIT.md, and the existing shared components. Follow this task for the new scope. Reuse the existing app shell, tokens, forms, tables, filters, badges and feedback states.

## Deliver in this order

1. Asset list: searchable by asset name, code and serial number; filters for customer, site, category and status; clear Register Asset action. Show asset code/name, category, customer/site, status and next maintenance date. Include empty, no-results, loading and error states.
2. Register/edit asset: name, unique asset code, category, customer, site, location, status, optional serial/model, installation date, warranty expiry and notes. Validate required fields, duplicate asset codes and date inputs. Filter sites by customer and reset incompatible selections when the customer changes. Saving updates the list and detail view.
3. Asset detail: summary, customer/site/location, warranty, status, QR identity placeholder, maintenance plans, service-history timeline and documents section. Use sample service history and document metadata; clearly identify placeholders.
4. Maintenance plans: list, create, edit and view a plan linked to an asset. Include plan name, simple weekly/monthly frequency, start date, next due date, checklist and active/paused status. Validate required fields. Keep recurrence rules basic and document how next due dates are calculated.
5. Upcoming maintenance: date/status filters and a simple calendar or date-grouped view. Show due/overdue items and link back to the asset and plan. Keep overdue indicators consistent with the shared design system.
6. Demonstrate the PM handoff using a mock work-order record or preview linked to the asset and plan. Coordinate IDs and status names with Swetha. A sample completion should add a service-history entry and advance the next due date once; prevent duplicate generation/completion in the demo.

## Implementation boundaries

This assignment is frontend with typed mock/sample data. Keep mock data and service adapters separate from page components so APIs can replace them later. Changes must remain consistent across list/detail/plan views during the demo; document whether refresh resets data. Use customer/site fixtures instead of building those complete modules.

Do not implement backend/database integration, real authentication, production uploads, QR scanning, background scheduling, the full Work Orders workflow, Dispatch, Inventory or Finance. Documents and QR are explicit placeholders. Coordinate only necessary route/shared-component changes with Swetha; preserve the existing shell and visual style.

## Acceptance checklist

- Demonstrate register asset -> edit -> detail -> create maintenance plan -> upcoming maintenance -> mock work-order handoff -> sample completion -> updated history/next due date.
- Search, filters, validation, save/cancel and navigation work with sample data.
- Customer/site/asset links remain consistent; duplicate codes and repeated PM actions are handled.
- Shared components are reused, with clear primary actions and accessible form labels, keyboard controls and feedback.
- Pages work on desktop and narrow screens; tables remain usable without breaking the layout.
- Loading, empty, no-results, error and success states are demonstrated.
- Run the repository's typecheck and production build scripts; report results and any existing blockers. Verify the main workflow and date edge cases.

## Handoff

Open a PR with the screens implemented, screenshots or a short walkthrough, verification results, sample-data/reset instructions, reusable component changes and remaining API dependencies. Request review before marking the task complete. Deliver the asset list/form/detail first, then the maintenance screens and mock handoff.

This assignment is self-contained; the parent project roadmap is not required to implement it.
