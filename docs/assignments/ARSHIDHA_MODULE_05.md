# Arshidha - Module 05: Procurement and Receiving

## Active assignment

As of 2026-10-09, this is Arshidha's fifth assignment, following Module 04 Inventory and Spare Parts. It maps to product roadmap Module 08 Procurement, not the roadmap's Technician App. This specification supersedes earlier personal assignment scope limits for the new procurement work. Preserve existing asset, maintenance, customer, contract and inventory workflows. Swetha retains Operations, Work Orders and Dispatch ownership.

## Repository, branches and setup

- Repository: https://github.com/Moif-Technology/enterprise-operations-platform_frontend.git
- Source branch: `sabeeh`, which includes the merged Module 04 inventory baseline (`593e561`).
- Implementation branch: `feature/arshidha-module-05-procurement-receiving`
- PR target: `sabeeh`
- Specification: `docs/assignments/ARSHIDHA_MODULE_05.md`

```bash
git clone --branch sabeeh https://github.com/Moif-Technology/enterprise-operations-platform_frontend.git
cd enterprise-operations-platform_frontend
git switch -c feature/arshidha-module-05-procurement-receiving
pnpm install
pnpm dev
```

Existing checkout: preserve local work, `git fetch origin`, then `git switch -c feature/arshidha-module-05-procurement-receiving origin/sabeeh`. If this implementation branch already exists, inspect it and integrate the latest source without resetting or discarding work. Preserve any newer reviewed UI work on your branch. Open the local URL printed by the dev server.

Read `AGENTS.md`, `CLAUDE.md`, `docs/DESIGN_SYSTEM.md`, `docs/FRONTEND_DEVELOPER_SPLIT.md`, this entire file and the existing inventory types, mock data and service in `src/modules/inventory`. Inspect current item/location/stock movement screens before implementation. Follow repository framework documentation instructions when writing code.

## Goal and data approach

Implement a connected frontend demo: low stock -> purchase request -> simulated approval -> RFQ and supplier comparison -> purchase order -> partial/final receiving -> inventory movement. Use typed fictional mock data and adapters suitable for future APIs. Real purchasing, supplier communications, approvals and payments are not performed. Label simulated actions clearly.

Reuse inventory item IDs, units and warehouse IDs. Do not create separate item or stock datasets. Keep procurement records and receipt-linked movements consistent during navigation; document refresh/reset behavior. A receipt must update the same inventory source used by existing stock screens. Preserve seeded IDs and existing records.

## Deliver in this order

1. **Suppliers:** small list/search/create/edit/detail flow with stable ID, unique case-insensitive supplier code, name, optional contact/email/phone/address, active/inactive status and notes. Validate required code/name and optional email. Inactive suppliers remain readable on historical records but cannot be selected for new RFQs/orders. Do not delete referenced suppliers.
2. **Purchase requests:** list/filter/create/edit/detail with unique reference, requested date, needed-by date, requester, destination warehouse, reason and lines containing inventory item, unit, positive quantity and optional notes. Require at least one active item, active warehouse and a reason; validate dates and aggregate or prevent duplicate item lines. Offer Create Purchase Request from low-stock/reorder entries with editable positive quantities. At the reorder threshold the existing suggestion may be zero: require an explicit positive quantity rather than creating a zero-quantity request. Creating a request never changes stock.
3. **Simulated approval:** draft -> submitted -> approved/rejected, with actor/time and decision notes; require a rejection reason. Editing submitted/approved lines is blocked; rejected requests can return to draft for revision and resubmission with history preserved. Only approved requests can proceed to RFQ/PO. Make approval explicitly a mock workflow, not real security enforcement. Prevent repeated submission/approval actions creating duplicate records.
4. **RFQ and supplier quotations:** prepare an RFQ from an approved request, select active suppliers and record fictional quotations manually. No email or external sends. Capture supplier reference, currency, validity date, lead time and per-line quantity/unit price. Compare at least two sample suppliers using matching items, quantities and currency; flag missing lines, expired quotes and incomparable offers. Use a single chosen currency per RFQ/PO, no FX, tax or accounting engine. Show line totals and quote total with consistent rounding. Select one supplier for the full order in this module; require a selection reason and block invalid/expired quotes.
5. **Purchase orders:** create one PO from the selected valid quotation, preserving request/RFQ/quote links. List/detail shows supplier, destination, ordered lines, prices, totals, dates and history. Draft -> issued (simulated) -> partially received -> received; cancellation allowed only before any accepted receipt. Issuing an order does not change stock or transmit anything. Freeze commercial lines once issued. Prevent generating multiple POs from the same selected RFQ through repeat clicks; split orders are deferred.
6. **Receiving:** from issued/partially received POs, record receipt reference/date, receiver, destination warehouse and accepted/rejected quantities per line with rejection reason. Enforce nonnegative finite quantities, at least one inspected unit and accepted + rejected <= outstanding units in that receipt. Cumulative accepted quantity cannot exceed ordered quantity; rejected units do not add stock and remain outstanding for replacement. Allow multiple partial receipts. Display ordered, cumulative accepted, cumulative rejected and outstanding (= ordered - accepted). Derive partial/complete PO status from accepted totals. Posted receipts are immutable in this scope; drafts can be cancelled without stock changes. Supplier returns and posted receipt reversal are deferred.
7. **Inventory integration:** extend the existing append-only movement model with an explicit procurement receipt movement, referencing receipt ID, PO ID/line and supplier. Accepted quantity adds to the destination warehouse exactly once; rejected quantity adds nothing. Use a single validated service operation for posting the receipt and its movements so validation failure leaves both unchanged. Repeated Save/retry/double-click must not duplicate stock. Do not represent receipts as editable opening balances or anonymous adjustments. Show receipt references in movement history and link procurement and inventory details. Stock remains opening balance plus movements; receipt posting must not overwrite balances.

## UI and boundaries

Reuse established shell/sidebar, shared table/form/filter patterns, badges and feedback states. Add procurement navigation/routes consistently. Each page must offer a clear primary action and working save/cancel/back links. Include loading, error/retry, empty/no-results, success and unknown-record states; accessible labels, keyboard use, narrow-screen layouts and protection for unsaved form changes.

Frontend only. No backend/database/authentication, real role enforcement, real supplier emails, binding purchases, payment, invoices, stock valuation, tax compliance, real file uploads, scanner integrations, general-purpose approvals platform or Work Order/Dispatch implementation. Prices are mock procurement values, not accounting ledger entries. Documents may be clearly labeled metadata placeholders. Do not implement future modules or redesign existing modules.

## Acceptance and handoff

- Demonstrate low stock -> request -> submit -> approve -> RFQ -> two quotations -> select supplier -> draft/issue PO -> partial receipt with rejected units -> final receipt -> updated inventory/history.
- Verify rejected request revision, invalid dates/prices/quantities, inactive records, duplicate references/items, missing/expired quotes and comparable currency/quantities.
- Verify an example order of 10: accept 4/reject 2, stock increases by 4 and outstanding is 6; later accept 6, stock increases by 6 and PO becomes received. Rejecting units never reduces outstanding by itself.
- Repeat receipt submission and PO generation; confirm no duplicate records or movements. Block over-receipt and cancellation after accepted receipts. Validation failures leave receipt and inventory unchanged.
- Confirm existing issue/return/adjustment, low-stock totals and prior modules continue working. Document inherited problems separately rather than claiming prior modules fully reviewed.
- Add focused tests for receipt arithmetic, validation and idempotency using existing test infrastructure where available. Verify the complete UI flow and desktop/narrow-screen behavior.
- Run `pnpm typecheck` and `pnpm build`; report actual results and blockers. Submit a PR targeting `sabeeh` with changed files, screenshots/walkthrough, demo/reset instructions, verification results and remaining API dependencies. Request review before marking complete.

## Agent prompt

Implement Arshidha's Module 05 using this entire specification from branch `sabeeh` in https://github.com/Moif-Technology/enterprise-operations-platform_frontend.git. Work on `feature/arshidha-module-05-procurement-receiving`. Read repository instructions and the existing inventory implementation first. Build the procurement workflow and receipt integration with typed mock data and reusable UI. Implement every deliverable and acceptance check; do not just summarize. Preserve existing work, run checks honestly and prepare the implementation for review against `sabeeh`.
