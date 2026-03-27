import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yallah Baggage - Dubai's Premier Luggage Concierge",
  description: "Seamless luggage pickup, storage, and delivery in the UAE. Explore Dubai hands-free from just 29 AED/day.",
  openGraph: {
    title: "Yallah Baggage | Hands-Free Travel in Dubai",
    description: "Your bags handled safely, starting from just AED 29/day. We pick up, store, and deliver your luggage anywhere in the UAE.",
    siteName: "Yallah Baggage",
    images: [
      {
        url: "/yalla-form-image.png",
        width: 1200,
        height: 630,
        alt: "Yallah Baggage Service Illustration",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yallah Baggage",
    description: "Seamless luggage pickup, storage, and delivery in the UAE.",
    images: ["/yalla-form-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased scroll-smooth"
    >
      <body 
        className="min-h-full flex flex-col tracking-tight bg-black text-white"
        style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "San Francisco", "Helvetica Neue", sans-serif' }}
      >
        {children}
      </body>
    </html>
  );
}
