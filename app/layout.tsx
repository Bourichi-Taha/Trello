import { Inter } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { ClerkProvider } from '@clerk/nextjs';
import {Toaster} from "sonner";
const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: [
    {
      url: "/logo_.png",
      href: "/logo_.png"
    }
  ]
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <Toaster />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
