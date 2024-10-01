import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import '@/lib/styles/arrow-slick.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";

import { Inter as FontSans } from "next/font/google"
import { cn } from "@/lib/utils";
import ModalProvider from "@/components/providers/modal-provider";
import { ToastProvider } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "ExtremeBloom",
  description:
    "Extreme Bloom is an online store offering a variety of cleaning agents for all needs. From household to industrial products.",
  openGraph: { images: ["/logo.png"] },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body 
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        {children}
        <ModalProvider />
        <Toaster />
      </body>
    </html>
  );
}
