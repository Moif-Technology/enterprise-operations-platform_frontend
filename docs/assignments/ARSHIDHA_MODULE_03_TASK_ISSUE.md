# Arshidha - Module 03: Customers, Sites, Contracts and AMC

Your previous assignment was Module 02 (Assets and Basic Preventive Maintenance). This is your next assignment, Module 03. The submitted Module 02 baseline and new instructions are on sabeeh.

Repository: https://github.com/Moif-Technology/enterprise-operations-platform_frontend.git
Source branch: sabeeh
Branch: https://github.com/Moif-Technology/enterprise-operations-platform_frontend/tree/sabeeh
Full assignment: https://github.com/Moif-Technology/enterprise-operations-platform_frontend/blob/sabeeh/docs/assignments/ARSHIDHA_MODULE_03.md

Copy the following into Claude, Codex, Cursor or another coding agent to start implementation:

--- COPY FROM HERE ---

Implement Arshidha's Module 03: Customers, Sites, Contracts and AMC.
Repository: https://github.com/Moif-Technology/enterprise-operations-platform_frontend.git
Source branch: sabeeh
Specification: docs/assignments/ARSHIDHA_MODULE_03.md

Fresh setup:
git clone --branch sabeeh https://github.com/Moif-Technology/enterprise-operations-platform_frontend.git
cd enterprise-operations-platform_frontend
git switch -c feature/arshidha-module-03-customers-contracts
pnpm install
pnpm dev

Existing checkout: preserve local changes, run git fetch origin, then git switch -c feature/arshidha-module-03-customers-contracts origin/sabeeh. If that branch exists, inspect and integrate the latest source without discarding work. Open the URL printed by the dev server.

Read AGENTS.md, CLAUDE.md, docs/DESIGN_SYSTEM.md, docs/FRONTEND_DEVELOPER_SPLIT.md, the full Module 03 specification and the Module 02 asset code before coding. Reuse existing components and preserve asset/maintenance workflows. This is Arshidha's third assignment, not the roadmap's Dispatch module.

Build customer and site list/create/edit/detail screens; a shared customer/site mock data source used by the existing asset forms; contract/AMC list/create/edit/detail; customer/site/asset coverage; basic SLA terms; expiry/renewal lists and renewal into a separate draft. Follow all fields, validation rules, date rules and acceptance checks in the specification. Keep stable IDs and prevent invalid cross-customer links. Include accessible, responsive layouts and loading/empty/no-results/error/success states.

Frontend with typed mock data only. No backend/database integration, production uploads, authentication, invoicing/payments, real SLA automation or Operations/Dispatch implementation. Do not merely summarize the assignment: implement its deliverables.

Demo create customer -> site -> linked asset -> AMC -> coverage/details -> renewal draft. Test validation, expiry boundaries and shared-record updates; confirm Module 02 still works. Run pnpm typecheck and pnpm build and report actual results, including inherited failures. Submit a PR targeting sabeeh with screenshots/walkthrough, changed files, demo/reset instructions and API dependencies. Complete the task after review.

--- END ---
