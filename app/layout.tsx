

import type { Metadata } from "next";
import "./globals.css";
import ServiceWorker from "@/components/service-worker";

import {
 AuthProvider
} from "@/lib/auth-context";


export const metadata: Metadata = {
  title: "Parth AI",

  description: "AI-powered personal productivity assistant",

  applicationName: "Parth AI",

  manifest: "/manifest.webmanifest",

  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Parth AI",
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },

  themeColor: "#09090b",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
     <AuthProvider>

                 <ServiceWorker />
{children}

</AuthProvider>

      </body>
    </html>
  );
}