import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "APEX MOTORS — Luxury Performance Automotive",
  description:
    "Discover the world's most exclusive high-performance vehicles. From hypercars to JDM legends, experience automotive excellence.",
  keywords: [
    "luxury cars",
    "hypercars",
    "supercars",
    "performance vehicles",
    "exotic cars",
    "JDM",
    "German performance",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-apex-black text-apex-white antialiased">
        <div className="noise-overlay" />
        {children}
      </body>
    </html>
  );
}
