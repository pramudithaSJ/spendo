import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LoadingProvider } from "@/contexts/LoadingContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BeeWise - Financial Literacy App",
  description: "The Next-Gen Financial Literacy App - Your path to financial wisdom with smart money management, expense tracking, and educational games",
  manifest: "/manifest.json",
  keywords: ["financial literacy", "expense tracker", "money management", "budgeting", "financial education", "BeeWise", "Sri Lanka"],
  authors: [{ name: "SLIIT Kandy Campus" }],
  creator: "SLIIT Kandy Campus",
  openGraph: {
    title: "BeeWise - Financial Literacy App",
    description: "The Next-Gen Financial Literacy App for smarter money management",
    type: "website",
    locale: "en_US",
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#FFC83D',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider>
          <LoadingProvider>
            <LanguageProvider>
              <CurrencyProvider>
                <AuthProvider>
                  {children}
                </AuthProvider>
              </CurrencyProvider>
            </LanguageProvider>
          </LoadingProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
