import "./globals.css";
import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";

export const metadata = {
  title: "Enterprise Operations Platform",
  description:
    "Facility, field service, asset, maintenance, and operations management platform.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
      <div className="app-shell">
  <Sidebar />
  <div className="app-content">{children}</div>
</div>
      </body>
    </html>
  );
}