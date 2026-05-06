import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://yallahbaggage.com"),
  title: "Yallah Baggage - Dubai's Premier Luggage Concierge",
  description: "Travel Light. We'll Handle the Rest. Seamless luggage pickup, storage, and delivery across the UAE.",
  openGraph: {
    title: "Yallah Baggage | Travel Light. We'll Handle the Rest.",
    description: "Your bags handled safely. Door-to-door luggage concierge across Dubai and the UAE.",
    siteName: "Yallah Baggage",
    images: [
      {
        url: "/yalla-form-image.png",
        width: 1200,
        height: 630,
        alt: "Yallah Baggage Service",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yallah Baggage",
    description: "Travel Light. We'll Handle the Rest.",
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
      className={`${poppins.variable} h-full antialiased scroll-smooth`}
    >
      <body 
        className="min-h-full flex flex-col tracking-tight"
        style={{ fontFamily: 'var(--font-poppins), sans-serif' }}
      >
        {children}
      </body>
    </html>
  );
}
