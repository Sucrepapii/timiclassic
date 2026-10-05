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
  title: {
    default: "Timiclassic | Bespoke Fashion Designer & Couture",
    template: "%s | Timiclassic",
  },
  description: "Experience unparalleled bespoke fashion and couture at Timiclassic. We craft custom-tailored garments with meticulous attention to detail and traditional craftsmanship.",
  keywords: [
    "bespoke fashion", 
    "custom tailoring", 
    "couture designer", 
    "luxury fashion", 
    "Timiclassic", 
    "custom suits", 
    "custom dresses", 
    "fashion designer",
    "fashion designer in Lagos",
    "fashion designer in Yaba",
    "fashion designer in Onike",
    "tailor in Lagos",
    "tailor in Yaba",
    "tailor in Onike"
  ],
  authors: [{ name: "Timiclassic" }],
  creator: "Timiclassic",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.timiclassic.com",
    title: "Timiclassic | Bespoke Fashion Designer & Couture",
    description: "Experience unparalleled bespoke fashion and couture at Timiclassic. We craft custom-tailored garments with meticulous attention to detail and traditional craftsmanship.",
    siteName: "Timiclassic",
  },
  twitter: {
    card: "summary_large_image",
    title: "Timiclassic | Bespoke Fashion Designer & Couture",
    description: "Experience unparalleled bespoke fashion and couture at Timiclassic.",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: "/logo.jpg",
  },
  verification: {
    google: "kJDD1RI1Nx8VzRimYXxW0TFxG1QqSz5SyUdh4h3DsbQ",
  },
};

export const viewport = {
  themeColor: "#f7f4eb",
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
        className="h-full bg-[#f7f4eb] text-[#0d0d0c] font-sans antialiased selection:bg-[#a67c1e]/30 selection:text-[#a67c1e]"
        suppressHydrationWarning
      >
        <AuthProvider>
          <Toaster 
            position="top-center" 
            toastOptions={{
              className: 'border border-[#d1c9b8] bg-[#111] text-[#0d0d0c] text-xs font-semibold tracking-widest uppercase rounded-lg shadow-2xl',
              style: {
                background: '#fdfcf7',
                color: '#0d0d0c',
                border: '1px solid #d1c9b8',
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
