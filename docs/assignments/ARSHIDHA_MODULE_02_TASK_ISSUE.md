# Copy this text into the task app's Issue field

Arshidha - Module 02: Assets and Basic Preventive Maintenance

Your Module 02 assignment instructions and Module 01 foundation are available on the sabeeh branch. Take the code and instructions from sabeeh and implement the assigned Module 02 screens.

Repository: https://github.com/Moif-Technology/enterprise-operations-platform_frontend
Source branch: sabeeh
Branch link: https://github.com/Moif-Technology/enterprise-operations-platform_frontend/tree/sabeeh
Full assignment: https://github.com/Moif-Technology/enterprise-operations-platform_frontend/blob/sabeeh/docs/assignments/ARSHIDHA_MODULE_02.md
File in the repository: docs/assignments/ARSHIDHA_MODULE_02.md

You can copy everything below into Claude, Codex, Cursor or another coding agent. The agent should read the assignment and implement it, not just summarize it.

--- COPY FROM HERE ---

Implement Arshidha's Module 02 assignment in the Enterprise Operations Platform frontend.

Repository: https://github.com/Moif-Technology/enterprise-operations-platform_frontend.git
Take the source code and assignment from branch: sabeeh
Read the full specification: docs/assignments/ARSHIDHA_MODULE_02.md

SETUP
For a fresh checkout, run:
git clone --branch sabeeh https://github.com/Moif-Technology/enterprise-operations-platform_frontend.git
cd enterprise-operations-platform_frontend
git switch -c feature/arshidha-module-02-assets-maintenance
pnpm install
pnpm dev

For an existing checkout, preserve any uncommitted changes first, run git fetch origin, then create the implementation branch using git switch -c feature/arshidha-module-02-assets-maintenance origin/sabeeh. If the implementation branch already exists, inspect it and integrate origin/sabeeh without discarding work. Use the local URL printed by pnpm dev, normally http://localhost:3000.

READ BEFORE CODING
Read AGENTS.md, CLAUDE.md, docs/DESIGN_SYSTEM.md, docs/FRONTEND_DEVELOPER_SPLIT.md and docs/assignments/ARSHIDHA_MODULE_02.md. Inspect and reuse the existing Module 01 components and app shell. Follow the installed framework documentation required by the repository instructions.

ASSIGNED WORK
Module 01 is complete. Arshidha's Module 02 means her second assignment: Assets and Basic Preventive Maintenance. The project roadmap calls this Module 04; do not implement Swetha's Operations Core module.
Build in order: searchable/filterable asset list; validated register/edit asset form; asset details with customer/site links, history, document and QR placeholders; basic maintenance plan list/create/edit/detail; upcoming maintenance with due/overdue indicators; mock PM work-order handoff and sample completion updating history and next due date once.
Use typed mock data and shared components. Keep list/detail/plan views consistent, validate customer-site relationships, handle duplicate asset codes and repeated PM actions, and provide responsive layouts plus loading/empty/no-results/error/success states.
Follow all field requirements and acceptance criteria in the assignment file. Keep backend/database integration, real authentication, production uploads, QR scanning, background scheduling, full Work Orders, Dispatch, Inventory and Finance outside this task.

FINISH AND HANDOFF
Implement the full assigned scope. Run pnpm typecheck and pnpm build. Verify the main workflow, validation, date edge cases and narrow-screen UI. Report actual results and any blockers. Provide changed files, screenshots or a short walkthrough, demo/reset instructions and remaining API dependencies. Prepare the implementation branch for a PR targeting sabeeh and review before marking complete.

--- END ---
