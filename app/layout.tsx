

import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Parth AI- Chinmaya Kumar",
  description: "Minimal AI-powered life manager",
  keywords: [
    "Parth AI",
    "Productivity",
    "Task Manager",
    "Life Manager",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}