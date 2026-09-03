# Swetha - Frontend Assignment

## Role

Frontend Developer 1 - Operations Flow Owner

## Main Responsibility

Own the main operational experience of the product. Your work should make the request-to-work-order journey feel simple, connected, and easy for operations users.

## First Priority

Start with Module 01 foundation work related to:

- App shell
- Grouped sidebar navigation
- Top bar
- Page header pattern
- Operations dashboard placeholder
- Service request placeholder
- Work order placeholder
- Dispatch placeholder
- Status badges inside operations screens
- Workflow timeline pattern

## Required Reading

Read these files first:

1. `docs/DESIGN_SYSTEM.md`
2. `docs/MODULE_01_FOUNDATION.md`
3. `docs/FRONTEND_DEVELOPER_SPLIT.md`

## Pages To Build First

### 1. App Shell

Build/improve:

- Sidebar grouped by module area
- Top bar with search placeholder
- Notifications placeholder
- User profile placeholder
- Main content layout
- Responsive behavior

### 2. Operations Dashboard Placeholder

Show only useful MVP information:

- Open requests
- Active work orders
- SLA risk
- Technician availability placeholder
- Jobs pending verification

### 3. Service Requests Placeholder

Create a clean placeholder for:

- Service request list
- Search/filter area
- Status badges
- Primary action: New Request
- Empty state

### 4. Work Orders Placeholder

Create a clean placeholder for:

- Work order list
- Priority
- SLA status
- Assigned technician
- Job status
- Primary action: Create Work Order

### 5. Dispatch Placeholder

Create a simple placeholder for:

- Unassigned jobs
- Technician schedule
- Workload summary
- SLA risk jobs

## Modules You Own Later

- Module 02 - Operations Core
- Module 03 - Scheduling and Dispatch

## Coordination With Arshidha

Use Arshidha's shared components for:

- Buttons
- Forms
- Panels
- Empty states
- Loading states
- Error states
- AI suggestion panel

Before creating a new component, check whether a shared component already exists.

## Important Rules

- Do not build full backend integration yet.
- Use placeholder/sample data.
- Keep every page simple and action-focused.
- Do not create separate visual styling outside the design system.
- Do not make the dashboard heavy with too many charts.
- Service Requests and Work Orders must feel connected.

## Acceptance Criteria

Your work is accepted when:

- The app shell is clean and responsive.
- Sidebar navigation is grouped and understandable.
- Operations dashboard placeholder is visible.
- Service request, work order, and dispatch placeholders are ready.
- Status and workflow patterns can be reused in Module 02.
- UI matches the design system.

## Run

```bash
pnpm install
pnpm dev
```

Open:

```text
http://localhost:3000
```
