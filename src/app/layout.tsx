import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Enterprise Operations Platform",
  description: "Facility, field service, asset, maintenance, and operations management platform."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
