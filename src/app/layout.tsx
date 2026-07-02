import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Toaster } from "react-hot-toast";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Timiclassic Fashion Designer - Fashion Command Center",
  description: "Bespoke production, client measurements, task timers, and order workflows for Timiclassic.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport = {
  themeColor: "#050505",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased dark`}
      style={{ colorScheme: 'dark' }}
      suppressHydrationWarning
    >
      <body
        className="h-full bg-[#050505] text-[#f5f5f0] font-sans antialiased selection:bg-[#d4af37]/30 selection:text-[#d4af37]"
        suppressHydrationWarning
      >
        <AuthProvider>
          <Toaster 
            position="top-center" 
            toastOptions={{
              className: 'border border-[#1f1b12] bg-[#111] text-[#f5f5f0] text-xs font-semibold tracking-widest uppercase rounded-lg shadow-2xl',
              style: {
                background: '#111111',
                color: '#f5f5f0',
                border: '1px solid #1f1b12',
                borderRadius: '8px',
                padding: '12px 16px',
              },
              success: {
                iconTheme: {
                  primary: '#4ade80',
                  secondary: '#052e16',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#450a0a',
                },
              },
            }}
          />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
