import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Insular Imperium — Commander's Hub",
  description: "The War Room of the Roman Empire. Tactical intelligence, field reports, and hero dossiers.",
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
