# Specification

## Summary
**Goal:** Add a dedicated Loxo integration page, unify access to all dashboards/reports via a single hub menu, introduce an “All Metrics” default dashboard, and enable users to build and save custom dashboards.

**Planned changes:**
- Add a Loxo-focused integration section reachable from the Integrations area, showing connection status plus configuration (sample data toggle, API key, connect/disconnect) using the existing `loxo` integration state model.
- Add a single sidebar-reachable hub page that lists and links to all existing dashboards and reporting/analysis views (Leadership/Recruiter/Ops dashboards, Funnel Analysis, Data Health, Alerts & Insights, Reports & Exports), respecting existing role-based visibility.
- Create a new “All Metrics” dashboard route that shows a compact, scrollable overview of key KPI cards computed from current global filters (including: Total Calls, Total Hours Logged, Placements, Interviews, Offers, Revenue, Margin, Active Contractors, Revenue per Recruiter, Revenue per Hour, Calls per Placement, Hours per Hire, Time-to-Fill, Utilization %).
- Add a “Create Custom Dashboard” flow to pick from a predefined widget library (KPI cards, a simple trend chart, and at least one table widget), allow naming and ordering widgets, and persist saved dashboards via backend API so they reappear for the signed-in user and are accessible from the hub/menu.

**User-visible outcome:** Users can configure and view Loxo integration status in its own section, browse all dashboards/reports from one hub page, open a new “All Metrics” dashboard for an at-a-glance KPI overview, and create/save custom dashboards that persist and show up in the dashboards menu.
