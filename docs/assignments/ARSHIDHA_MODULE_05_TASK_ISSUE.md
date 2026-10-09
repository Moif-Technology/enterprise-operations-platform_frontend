# Arshidha - Module 05: Procurement and Receiving

Your previous assignment was Module 04 Inventory and Spare Parts. Module 05 adds Purchase Requests, Supplier Quotes, Purchase Orders and Receiving, connected to the existing inventory. The assignment is available on sabeeh.

Repository: https://github.com/Moif-Technology/enterprise-operations-platform_frontend.git
Source branch: sabeeh
Source branch URL: https://github.com/Moif-Technology/enterprise-operations-platform_frontend/tree/sabeeh
Implementation branch: feature/arshidha-module-05-procurement-receiving
PR target: sabeeh
Full assignment: https://github.com/Moif-Technology/enterprise-operations-platform_frontend/blob/sabeeh/docs/assignments/ARSHIDHA_MODULE_05.md

Copy everything below into Claude, Codex, Cursor or another coding agent:

--- COPY FROM HERE ---

Implement Arshidha's Module 05: Procurement and Receiving.
Repository: https://github.com/Moif-Technology/enterprise-operations-platform_frontend.git
Source branch: sabeeh
Implementation branch: feature/arshidha-module-05-procurement-receiving
PR target: sabeeh
Specification: docs/assignments/ARSHIDHA_MODULE_05.md

Fresh setup:
git clone --branch sabeeh https://github.com/Moif-Technology/enterprise-operations-platform_frontend.git
cd enterprise-operations-platform_frontend
git switch -c feature/arshidha-module-05-procurement-receiving
pnpm install
pnpm dev

Existing checkout: preserve local changes, run git fetch origin, then git switch -c feature/arshidha-module-05-procurement-receiving origin/sabeeh. If the implementation branch exists, inspect and integrate the source without discarding work. Preserve newer reviewed UI changes. Open the URL printed by pnpm dev.

Read AGENTS.md, CLAUDE.md, docs/DESIGN_SYSTEM.md, docs/FRONTEND_DEVELOPER_SPLIT.md and the entire Module 05 specification. Inspect src/modules/inventory types, service, mock data and stock screens before coding. This is Arshidha's fifth personal assignment, mapping to roadmap Procurement, not Technician Mobile. Preserve Modules 01-04 and reuse their components.

Build in order: supplier master; purchase request list/create/edit/detail and low-stock entry point; simulated submit/approve/reject workflow with history; RFQs and manually recorded fictional supplier quotations; comparable quote selection; purchase order list/detail and simulated issue; partial/final receiving; inventory receipt movements linked to PO/receipt IDs.

Reuse existing item, unit and warehouse records. Approved requests alone can proceed. No stock changes occur on request, approval or PO issue. Only accepted receipt quantities increase warehouse stock. Rejected units add no stock and remain outstanding. Block over-receipt and repeated submission; accepted receipt posting and stock movements must remain consistent and occur exactly once. Preserve append-only movement history. Follow the full specification's fields, validation, state transitions and acceptance criteria.

Frontend with typed fictional mock data only. No backend/database/authentication, real supplier messages, binding purchases, payments, invoicing/tax engine, stock valuation or Operations/Dispatch implementation. Label simulated approvals and issue actions. Include responsive accessible UI and loading/empty/no-results/error/success states.

Implement the deliverables, not just a plan. Demonstrate low stock -> request -> approval -> RFQ -> two quotes -> selected supplier -> PO -> partial receipt/rejections -> final receipt -> inventory/history. Test validation, duplicate actions and receipt arithmetic (order 10, accept 4/reject 2 leaves 6 outstanding; later accept 6 completes). Verify existing inventory movements and prior modules still work. Run pnpm typecheck and pnpm build, report actual results/inherited failures, and submit a PR to sabeeh with screenshots/walkthrough, demo/reset instructions, changed files and API dependencies. Mark complete after review.

--- END ---
