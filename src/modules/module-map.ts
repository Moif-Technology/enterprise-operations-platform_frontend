export const workflowSteps = [
  "Request",
  "Classify",
  "Assign",
  "Schedule",
  "Execute",
  "Verify",
  "Invoice",
  "Report"
];

export const modules = [
  {
    name: "Dashboard",
    slug: "dashboard",
    area: "Foundation",
    purpose: "Simple operational overview for managers and supervisors.",
    pages: ["Executive Dashboard", "Operations Dashboard", "Today Overview"]
  },
  {
    name: "Service Requests",
    slug: "service-requests",
    area: "Operations",
    purpose: "Capture, classify, prioritize, and convert requests into work orders.",
    pages: ["Request List", "Request Detail", "Create Request", "Classification Queue"]
  },
  {
    name: "Work Orders",
    slug: "work-orders",
    area: "Operations",
    purpose: "Manage the full job lifecycle from assignment to customer signoff.",
    pages: ["Work Order List", "Work Order Detail", "Checklist", "Verification Queue"]
  },
  {
    name: "Assets",
    slug: "assets",
    area: "Assets",
    purpose: "Maintain asset registry, QR identity, warranty, documents, and service history.",
    pages: ["Asset List", "Asset Detail", "Register Asset", "Asset History"]
  },
  {
    name: "Maintenance",
    slug: "maintenance",
    area: "Assets",
    purpose: "Plan preventive maintenance schedules and generate recurring work orders.",
    pages: ["Maintenance Plans", "Maintenance Calendar", "Upcoming Maintenance", "PM History"]
  },
  {
    name: "Dispatch",
    slug: "dispatch",
    area: "Operations",
    purpose: "Assign technicians, manage schedules, and monitor job progress.",
    pages: ["Dispatch Board", "Technician Schedule", "Job Assignment", "SLA Risk View"]
  },
  {
    name: "Customers and Contracts",
    slug: "customers-contracts",
    area: "Customers",
    purpose: "Manage customers, sites, contracts, covered assets, SLA terms, and renewals.",
    pages: ["Customer List", "Customer Detail", "Site Detail", "Contract Detail"]
  },
  {
    name: "Inventory",
    slug: "inventory",
    area: "Inventory",
    purpose: "Track spare parts, stock movements, warehouses, and technician stock.",
    pages: ["Item List", "Stock Overview", "Stock Movement", "Low Stock"]
  },
  {
    name: "Procurement",
    slug: "procurement",
    area: "Supply",
    purpose: "Manage purchase requests, supplier quotations, purchase orders, and receiving.",
    pages: ["Purchase Requests", "RFQ", "Purchase Orders", "Receiving"]
  },
  {
    name: "Finance",
    slug: "finance",
    area: "Finance",
    purpose: "Create quotations, invoices, record payments, and monitor outstanding balances.",
    pages: ["Quotations", "Invoices", "Payments", "Customer Balance"]
  },
  {
    name: "Reports and AI",
    slug: "reports-ai",
    area: "Insights",
    purpose: "Provide useful dashboards, reports, AI suggestions, summaries, and risk signals.",
    pages: ["Reports", "Analytics", "AI Assistant", "AI Suggestions"]
  }
] as const;
