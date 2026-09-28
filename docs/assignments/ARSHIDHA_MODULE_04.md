# Arshidha - Module 04: Inventory and Spare Parts

## Active assignment and numbering

Arshidha's last assignment was Module 03, Customers, Sites, Contracts and AMC. Its latest submitted implementation is commit `3868935` on `feature/arshidha-module-03-customers-contracts`. This next assignment is her Module 04. These personal assignment numbers differ from the product roadmap: this scope maps to roadmap Module 07, Inventory and Spare Parts, not Scheduling and Dispatch. Swetha retains Operations Core, Work Order and Dispatch ownership.

This file is the current scope for Arshidha and supersedes the older Module-02-only and Module-03-only restrictions for her next work. Existing code is a baseline, not proof of product acceptance: report any inherited defects separately and preserve working asset, maintenance, customer, site and contract flows.

## Repository and setup

- Repository: https://github.com/Moif-Technology/enterprise-operations-platform_frontend.git
- Source branch: `sabeeh` (must already include the submitted Module 03 baseline and this specification; if the Customers, Sites and Contracts screens are missing from your checkout, stop and ask before starting).
- Implementation branch: `feature/arshidha-module-04-inventory-spare-parts`.
- PR target: `sabeeh`.

```bash
git clone --branch sabeeh https://github.com/Moif-Technology/enterprise-operations-platform_frontend.git
cd enterprise-operations-platform_frontend
git switch -c feature/arshidha-module-04-inventory-spare-parts
pnpm install
pnpm dev
```

For an existing checkout: preserve uncommitted work, run `git fetch origin`, then `git switch -c feature/arshidha-module-04-inventory-spare-parts origin/sabeeh`. If that branch already exists, inspect and integrate the latest source without resetting or discarding work. Open the URL printed by the dev server, normally http://localhost:3000.

Read `AGENTS.md`, `CLAUDE.md`, `docs/DESIGN_SYSTEM.md`, `docs/FRONTEND_DEVELOPER_SPLIT.md`, this file, and the Module 02 and Module 03 implementations before coding. In particular inspect `src/modules/assets/types.ts`, `mock-data.ts` and `service.ts`, plus `src/modules/customers`, `src/modules/sites` and `src/modules/contracts`, so inventory reuses those patterns instead of inventing new ones.

## Goal

Add spare parts and stock management: an item master, stock held per warehouse and per technician, and the movements that change stock (issue, return, adjustment) with a required reason and a traceable history. Connect parts usage to assets and to work order references. Keep the experience consistent with the asset registry, customer and contract screens.

## Deliver in this order

1. **Item master:** list/search/filter, create, edit and detail. Fields: stable ID, unique part code, name, category, unit of measure, optional manufacturer and manufacturer part number, optional description, active/inactive status, nonnegative reorder level, optional preferred warehouse and notes. Validate required code/name/category/unit, duplicate part codes case-insensitively and nonnegative numeric fields. Detail shows current stock by location, recent movements and the assets or asset categories the part applies to.
2. **Stock locations:** a small managed list of stock locations covering warehouses and technician-held stock. Fields: stable ID, code, name, location type (warehouse or technician), optional site reference for warehouses, optional technician name for technician stock, and active/inactive status. Require code, name and type; codes unique case-insensitively. Reuse Module 03 site records for warehouse site references rather than duplicating site fixtures. Prevent changing a location's type while stock or movements reference it, and explain the dependency. Use inactive status instead of deleting referenced locations.
3. **Stock overview:** a single screen answering where a part is and how much of it exists. Show quantity on hand per item per location, a per-item total, and filters by item, category, location, location type and low-stock-only. Provide the warehouse stock and technician stock views over the same data source; do not build two disconnected datasets. Quantities are derived from seeded opening balances plus recorded movements, never stored as an independently editable number that can drift from the movement history.
4. **Issue parts:** a short form that moves stock out of a location. Fields: item, source location, quantity, date, required reason, optional work order reference, optional asset, optional customer/site derived from the asset or entered, issued-to technician when issuing into technician stock, and notes. Require item, location, quantity, date and reason. Quantity must be positive and must not exceed available quantity at the source location; block and explain an over-issue instead of allowing negative stock. Issuing to a technician moves stock between locations rather than consuming it. Work order references are typed identifiers or labels only: do not implement or alter Swetha's work order and dispatch screens.
5. **Return parts:** a form that moves stock back from a technician or a work order into a warehouse. Fields: item, source location, destination warehouse, quantity, date, required condition (usable or damaged), required reason, optional original issue reference, optional work order and asset references, and notes. Require the same core fields plus condition. Quantity must be positive and must not exceed the source location's available quantity. Returns marked damaged must be visibly distinguished in stock views and must not silently inflate usable stock; document the convention you choose and apply it consistently.
6. **Adjustments:** a form to correct stock with an audit trail. Fields: item, location, adjustment direction or signed quantity, date, required reason code from a documented list, optional free-text explanation and notes. Require item, location, quantity, date and reason code. A decrease must not drive a location's quantity below zero. Adjustments are the only way to change stock outside an issue or return, and every adjustment stays visible in movement history.
7. **Stock movement history:** one list of all movements across issue, return and adjustment. Show date, movement type, item, source and destination where applicable, quantity, reason, actor or technician where recorded, and related work order and asset references. Filter by item, location, movement type, reason and date range, and sort newest first by default. Every row links to the item and, where present, to the related asset and location. Movements are append-only in the UI: corrections are made with a new adjustment, not by editing or deleting history.
8. **Low stock and reorder:** derive a low-stock list where total on-hand quantity is at or below an item's reorder level, using a documented comparison and local calendar-date convention. Show a separate out-of-stock grouping for zero quantity. Provide a reorder suggestion list with the quantity needed to reach the reorder level, clearly labeled as a suggestion. No purchase orders, no supplier selection and no procurement workflow in this module.

## Boundaries and UX

Frontend only, using typed mock data and adapters suitable for future APIs. Changes must stay consistent across views during the demo; document refresh/reset behavior. Use fictional parts, technicians and records. Reuse shared forms, filters, badges, page headers, feedback states and shell. Add routes and navigation only where needed; follow the app's established route conventions.

Each page needs clear primary actions and usable save/cancel/back navigation. Include loading, error/retry, empty/no-results, success and unknown-record states. Use accessible labels, keyboard interactions and responsive layouts. Protect unsaved changes where navigation would lose form input. Stock levels must be scannable at a glance, every movement must show its reason, and forms must stay short and practical.

Do not implement backend, database or authentication, procurement or purchase orders, supplier and vendor management, invoices, payments or costing, barcode and scanner hardware integration, real notifications, stock valuation reporting, or Swetha's Operations, Work Order and Dispatch workflows. Part cost and valuation are deferred: if a cost field appears at all, keep it an optional recorded number with no calculations. Inventory analytics and forecasting are deferred until reliable operational data exists; do not invent live KPI values.

## Acceptance and verification

- Demo: create an item -> confirm its opening stock in a warehouse -> issue parts to a technician against an asset and a work order reference -> see stock move between locations and appear in movement history -> return part of it as usable and part as damaged -> post an adjustment with a reason -> open the low stock and reorder lists.
- Item, location, asset and site references resolve without orphaned IDs. Existing Module 02 and Module 03 fixtures, asset creation, maintenance, customer, site and contract flows continue working.
- Exercise duplicate part codes, duplicate location codes, over-issue beyond available quantity, zero and negative quantities, an adjustment that would push stock below zero, inactive items and locations, and cancellation of form edits.
- Verify low-stock and reorder boundaries: quantity above the reorder level, exactly at it, below it, and zero; and confirm damaged returns follow your documented convention.
- Confirm stock totals still equal opening balance plus recorded movements after a mixed sequence of issues, returns and adjustments, and that history cannot be edited away.
- Demonstrate loading/empty/no-results/error/success states and desktop and narrow-screen usability.
- Run `pnpm typecheck` and `pnpm build`; report actual results and inherited failures separately. Add focused tests for meaningful new quantity, validation and movement-math logic if the repository supports them; do not add a large testing framework solely for this task.
- Submit a PR to `sabeeh` with screenshots or a walkthrough, changed files, demo and reset steps, verification evidence and remaining API dependencies. Mark complete only after review.

## Copy-paste agent prompt

Implement Arshidha's Module 04 from `docs/assignments/ARSHIDHA_MODULE_04.md` in https://github.com/Moif-Technology/enterprise-operations-platform_frontend.git, starting from branch `sabeeh`. Preserve existing work and use `feature/arshidha-module-04-inventory-spare-parts`. Read repository instructions, this entire specification, the design system and the Module 02 and Module 03 implementations first. Build the item master, stock locations, stock overview, issue, return, adjustment, movement history and low stock/reorder screens, deriving quantities from recorded movements and reusing existing asset, site and shared UI patterns. Implement only this scope with typed mock data and reusable UI. Complete every deliverable and acceptance check; do not merely summarize the task. Run the required checks, report results honestly and prepare a PR targeting `sabeeh` with demo evidence and outstanding dependencies.
