import type { Metadata } from "next";
import { Geist, Geist_Mono, Barlow } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import ClientLayout from "@/components/ClientLayout";
import QueryProvider from "@/contexts/QueryProvider";
import StoreInitializer from "@/components/Store/StoreInitializer";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const barlow = Barlow({
  weight: "500",
  subsets: ["latin"],
  variable: "--font-barlow",
});

export const metadata: Metadata = {
  title: "Q3x Wallet",
  description: "A secure and user-friendly wallet for your digital assets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${barlow.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
        <ThemeProvider defaultTheme="system" storageKey="ui-theme">
          <QueryProvider>
            <StoreInitializer />
            <ClientLayout>{children}</ClientLayout>
            <Toaster richColors />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
