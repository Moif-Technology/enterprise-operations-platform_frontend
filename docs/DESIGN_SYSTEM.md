# Frontend Design System

## Product Feel

The platform should feel professional, clean, operational, and premium. It must not feel like a heavy ERP.

Main principle:

Complex business logic should become a simple user experience.

## Visual Rules

- Use a calm enterprise look.
- Keep screens easy to scan.
- Use one clear primary action per page.
- Avoid unnecessary charts, decoration, popups, and animations.
- Keep cards and panels simple with radius up to 8px.
- Use role-based navigation and show only relevant actions.

## Current Tokens

| Token | Value | Usage |
| --- | --- | --- |
| Background | `#f6f7f9` | App background |
| Panel | `#ffffff` | Content panels |
| Ink | `#162033` | Main text |
| Muted | `#647086` | Secondary text |
| Line | `#dfe4ea` | Borders |
| Primary | `#0f766e` | Primary actions |
| Warning | `#b45309` | SLA risk |
| Danger | `#b91c1c` | SLA breach and destructive states |

## Required Components

- App shell
- Page header
- Sidebar navigation group
- Top bar search
- Notification placeholder
- User profile placeholder
- Primary button
- Secondary button
- Status badge
- Table/list
- Form fields
- Empty state
- Loading state
- Error state
- Success state
- Timeline
- AI suggestion panel

## Statuses

- New
- Assigned
- Scheduled
- In Progress
- Pending Verification
- Completed
- Cancelled
- SLA Risk
- SLA Breached

## Developer Rule

Do not create a new visual style inside each module. Extend the shared design system first, then use it across module screens.
