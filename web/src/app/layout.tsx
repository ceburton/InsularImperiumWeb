import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Insular Imperium",
  description: "Turn-based tactics and strategy: command medieval fantasy armies across island archipelagos against orcs, undead hordes, and vampire lords. Units, heroes, and naval warfare.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen" style={{ fontFamily: "'EB Garamond', serif" }}>
        {children}
      </body>
    </html>
  );
}
