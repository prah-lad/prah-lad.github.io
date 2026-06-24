import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prahlad Regmi — Portfolio OS",
  description: "Computer Science student at Youngstown State University. Backend engineer, data analyst, IoT builder.",
  keywords: ["Prahlad Regmi", "software engineer", "computer science", "YSU", "portfolio"],
  openGraph: {
    title: "Prahlad Regmi — Portfolio OS",
    description: "A Linux OS-inspired developer portfolio",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
