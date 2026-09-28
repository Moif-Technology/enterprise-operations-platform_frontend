# Frontend Developer Split

## Current assignment update

Current as of 2026-09-28: Arshidha's next assignment is [Module 04 - Inventory and Spare Parts](assignments/ARSHIDHA_MODULE_04.md) on `sabeeh`. Module 03 was her previous assignment; its submitted implementation on `feature/arshidha-module-03-customers-contracts` is the baseline. Her Module 04 numbering is personal: this scope maps to roadmap Module 07, not the roadmap's Scheduling and Dispatch module. The [Module 03 assignment](assignments/ARSHIDHA_MODULE_03.md) and the earlier assignment notes below are historical.

Arshidha's Module 01 is complete per the project owner. Her active second assignment is [ARSHIDHA_MODULE_02.md](assignments/ARSHIDHA_MODULE_02.md) on branch `sabeeh`: Assets and Basic Preventive Maintenance. Follow that file for her current scope; the Module-01-only directions below describe the earlier foundation stage. Operations Core ownership remains with Swetha.

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
- Do not start later modules until Module 01 is reviewed.
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
