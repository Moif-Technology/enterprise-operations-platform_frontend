# Frontend Developer Split

## First Task For Both Developers

Both developers should start with Module 01 alignment:

- Read this file.
- Read `DESIGN_SYSTEM.md`.
- Read `MODULE_01_FOUNDATION.md`.
- Run the frontend locally.
- Review the current design-system preview.

## Swetha - Operations Flow Owner

### Main Ownership

- App shell navigation structure
- Operations dashboard
- Service Requests
- Work Orders
- Scheduling and Dispatch
- Supervisor verification screens
- SLA status display inside operations pages

### First Assignment

Build the operational foundation components:

- Sidebar grouped navigation
- Page header with primary action
- Status badge variants
- Workflow timeline pattern
- Operational list/table pattern
- Service request placeholder page
- Work order placeholder page

### Later Modules

- Module 02 - Operations Core
- Module 03 - Scheduling and Dispatch

### Important Rule

Swetha should make the request-to-work-order journey feel connected. Do not design Service Requests and Work Orders like separate products.

## Arshidha - Design System And Business Support Owner

### Main Ownership

- Design system preview page
- Shared forms
- Shared filters
- Shared empty/loading/error/success states
- Asset Management
- Preventive Maintenance
- Customers/Sites/Contracts
- Inventory
- Procurement
- Finance
- Reports and AI suggestion patterns

### First Assignment

Build the shared foundation components:

- Button system
- Panel/card pattern
- Form field pattern
- Filter/search pattern
- Empty state
- Loading state
- Error state
- Success state
- AI suggestion panel
- Asset placeholder page

### Later Modules

- Module 04 - Assets and Preventive Maintenance
- Module 06 - Customers, Sites, Contracts, AMC
- Module 07 - Inventory
- Module 08 - Procurement
- Module 09 - Finance
- Module 10 - Reports and AI

### Important Rule

Arshidha should make all support modules use the same list/detail/form patterns. Avoid each module becoming visually different.

## Shared Coordination

Both developers must coordinate on:

- Color tokens
- Typography
- Sidebar structure
- Status names
- Button styles
- Table density
- Form layout
- Empty/loading/error/success states
- Mobile responsive behavior

## Suggested Work Order

1. Swetha builds app shell and navigation.
2. Arshidha builds shared design system components.
3. Swetha creates Operations placeholders.
4. Arshidha creates Assets and shared state placeholders.
5. Both review the UI together before starting Module 02.

## What To Avoid

- Do not start all modules at once.
- Do not create separate styles per developer.
- Do not make large dashboards with many charts.
- Do not build backend integration in Module 01.
- Do not add final business logic yet.

## First Pull Request Target

The first pull request should complete:

- App shell
- Sidebar
- Top bar
- Design system preview
- Shared components
- Module placeholder routes
