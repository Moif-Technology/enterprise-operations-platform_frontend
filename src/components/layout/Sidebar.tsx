"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type NavItem = {
  label: string;
  href?: string;
  comingSoon?: boolean;
};

const primaryItems: NavItem[] = [
  { label: "Dashboard", href: "/" },
  { label: "Service Requests", comingSoon: true },
  { label: "Work Orders", comingSoon: true },
  { label: "Assets", href: "/assets" },
  { label: "Maintenance Plans", href: "/maintenance-plans" },

  { label: "Dispatch", comingSoon: true },
  { label: "Customers", href: "/customers" },
  { label: "Sites", href: "/sites" },
  { label: "Contracts", href: "/contracts" },
];

const maintenanceItems: NavItem[] = [
  {
    label: "Upcoming Maintenance",
    href: "/upcoming-maintenance",
  },
];
const inventoryItems: NavItem[] = [
  { label: "Spare Parts", href: "/inventory/spare-parts" },
  { label: "Stock Locations", href: "/inventory/stock-locations" },
  { label: "Stock Overview", href: "/inventory/stock-overview" },
  { label: "Stock Movements", href: "/inventory/movements" },
  { label: "Low Stock", href: "/inventory/low-stock" },
];

const comingSoonItems: NavItem[] = [
  { label: "Procurement", comingSoon: true },
  { label: "Finance", comingSoon: true },
  { label: "Reports and AI", comingSoon: true },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar() {
  const pathname = usePathname();
  const [inventoryOpen, setInventoryOpen] = useState(
    pathname.startsWith("/inventory"),
  );
  const [maintenanceOpen, setMaintenanceOpen] = useState(
    pathname.startsWith("/maintenance-plans"),
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const [comingSoonLabel, setComingSoonLabel] = useState<string | null>(null);

  const inventoryActive = pathname.startsWith("/inventory");
  const maintenanceActive =
  pathname.startsWith("/maintenance-plans") ||
  pathname.startsWith("/upcoming-maintenance");
  useEffect(() => {
    if (inventoryActive) {
      setInventoryOpen(true);
    }
  
    if (maintenanceActive) {
      setMaintenanceOpen(true);
    }
  }, [inventoryActive, maintenanceActive]);
  useEffect(() => {
    if (!comingSoonLabel) {
      return;
    }
  
    const timeout = window.setTimeout(() => {
      setComingSoonLabel(null);
    }, 2500);
  
    return () => window.clearTimeout(timeout);
  }, [comingSoonLabel]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <button
        type="button"
        className="sidebar-mobile-toggle"
        aria-label="Open navigation"
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen(true)}
      >
        Menu
      </button>

      {mobileOpen && (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-header">
          <div>
            <p className="eyebrow">Enterprise Ops</p>
            <h1>Operations Platform</h1>
          </div>

          <button
            type="button"
            className="sidebar-mobile-close"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
          >
            Close
          </button>
        </div>

        <nav aria-label="Main navigation">
        {primaryItems.map((item) =>
  item.label === "Maintenance Plans" ? (
    <div className="sidebar-group" key={item.label}>
  <button
    type="button"
    className={`sidebar-link sidebar-group-toggle ${
      maintenanceActive ? "sidebar-link-active" : ""
    }`}
    aria-expanded={maintenanceOpen}
    onClick={() => setMaintenanceOpen((open) => !open)}
  >
    <span>Maintenance Plans</span>
    <span aria-hidden="true">
      {maintenanceOpen ? "-" : "+"}
    </span>
  </button>

  {maintenanceOpen && (
    <div className="sidebar-subnav">
      {maintenanceItems.map((maintenanceItem) => (
        <Link
          key={maintenanceItem.label}
          href={maintenanceItem.href!}
          className={`sidebar-link sidebar-subnav-link ${
            isActivePath(pathname, maintenanceItem.href!)
              ? "sidebar-link-active"
              : ""
          }`}
          aria-current={
            isActivePath(pathname, maintenanceItem.href!)
              ? "page"
              : undefined
          }
        >
          {maintenanceItem.label}
        </Link>
      ))}
    </div>
  )}

</div>
  ) : item.comingSoon ? (
    <button
      type="button"
      key={item.label}
      className="sidebar-link sidebar-link-disabled"
      onClick={() => setComingSoonLabel(item.label)}
    >
      <span>{item.label}</span>
      <span className="sidebar-coming-soon">Coming soon</span>
    </button>
  ) : (
    <Link
      key={item.label}
      href={item.href!}
      className={`sidebar-link ${
        isActivePath(pathname, item.href!) ? "sidebar-link-active" : ""
      }`}
      aria-current={
        isActivePath(pathname, item.href!) ? "page" : undefined
      }
    >
      {item.label}
    </Link>
  ),
)}

          <div className="sidebar-group">
            <button
              type="button"
              className={`sidebar-link sidebar-group-toggle ${
                inventoryActive ? "sidebar-link-active" : ""
              }`}
              aria-expanded={inventoryOpen}
              onClick={() => setInventoryOpen((open) => !open)}
            >
              <span>Inventory</span>
              <span aria-hidden="true">{inventoryOpen ? "-" : "+"}</span>
            </button>

            {inventoryOpen && (
              <div className="sidebar-subnav">
                {inventoryItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href!}
                    className={`sidebar-link sidebar-subnav-link ${
                      isActivePath(pathname, item.href!)
                        ? "sidebar-link-active"
                        : ""
                    }`}
                    aria-current={
                      isActivePath(pathname, item.href!) ? "page" : undefined
                    }
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {comingSoonItems.map((item) => (
  <button
    type="button"
    key={item.label}
    className="sidebar-link sidebar-link-disabled"
    onClick={() => setComingSoonLabel(item.label)}
  >
    <span>{item.label}</span>
    <span className="sidebar-coming-soon">Coming soon</span>
  </button>
))}
        </nav>
      </aside>
      {comingSoonLabel && (
  <div className="sidebar-toast" role="status" aria-live="polite">
    <strong>{comingSoonLabel}</strong>
    <span>Coming soon</span>
  </div>
)}
    </>
  );
}


