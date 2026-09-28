# Arshidha - Module 04: Inventory and Spare Parts

Your previous assignment was Module 03 (Customers, Sites, Contracts and AMC). This is your next assignment, Module 04. The submitted Module 03 baseline and these new instructions are on sabeeh.

Repository: https://github.com/Moif-Technology/enterprise-operations-platform_frontend.git
Source branch: sabeeh
Branch: https://github.com/Moif-Technology/enterprise-operations-platform_frontend/tree/sabeeh
Full assignment: https://github.com/Moif-Technology/enterprise-operations-platform_frontend/blob/sabeeh/docs/assignments/ARSHIDHA_MODULE_04.md

Copy the following into Claude, Codex, Cursor or another coding agent to start implementation:

--- COPY FROM HERE ---

Implement Arshidha's Module 04: Inventory and Spare Parts.
Repository: https://github.com/Moif-Technology/enterprise-operations-platform_frontend.git
Source branch: sabeeh
Specification: docs/assignments/ARSHIDHA_MODULE_04.md

Fresh setup:
git clone --branch sabeeh https://github.com/Moif-Technology/enterprise-operations-platform_frontend.git
cd enterprise-operations-platform_frontend
git switch -c feature/arshidha-module-04-inventory-spare-parts
pnpm install
pnpm dev

Existing checkout: preserve local changes, run git fetch origin, then git switch -c feature/arshidha-module-04-inventory-spare-parts origin/sabeeh. If that branch exists, inspect and integrate the latest source without discarding work. Open the URL printed by the dev server.

Read AGENTS.md, CLAUDE.md, docs/DESIGN_SYSTEM.md, docs/FRONTEND_DEVELOPER_SPLIT.md, the full Module 04 specification and the Module 02 and Module 03 code before coding. Reuse existing components and preserve the asset, maintenance, customer, site and contract workflows. This is Arshidha's fourth assignment, not the roadmap's Dispatch module.

Build the spare parts item master (list, create, edit, detail); stock locations covering warehouses and technician stock, reusing Module 03 site records; a stock overview showing quantity per item per location with warehouse and technician views over one data source; issue, return and adjustment forms, each with a required reason; an append-only stock movement history with filters; and low stock plus reorder suggestion lists. Quantities must be derived from seeded opening balances plus recorded movements, never stored as a separately editable number. Block over-issue and any movement that would push a location below zero. Parts usage links to assets and to typed work order references only. Follow all fields, validation rules and acceptance checks in the specification. Keep stable IDs. Include accessible, responsive layouts and loading/empty/no-results/error/success states.

Frontend with typed mock data only. No backend, database, authentication, procurement or purchase orders, suppliers, invoicing, payments, costing or valuation, barcode hardware, real notifications, or Operations, Work Order and Dispatch implementation. Do not merely summarize the assignment: implement its deliverables.

Demo create item -> opening stock -> issue to technician against an asset and work order reference -> movement history -> return usable and damaged -> adjustment with reason -> low stock and reorder lists. Test duplicate codes, over-issue, zero and negative quantities, below-zero adjustments, reorder-level boundaries and inactive records; confirm Modules 02 and 03 still work. Run pnpm typecheck and pnpm build and report actual results, including inherited failures. Submit a PR targeting sabeeh with screenshots/walkthrough, changed files, demo/reset instructions and API dependencies. Complete the task after review.

--- END ---
