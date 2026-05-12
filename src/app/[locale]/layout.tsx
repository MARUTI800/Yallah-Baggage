import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./../globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://yallahbaggage.com"),
  title: "Yallah Baggage - Dubai's Premier Luggage Concierge",
  description:
    "Travel Light. We'll Handle the Rest. Seamless luggage pickup, storage, and delivery across the UAE.",
  openGraph: {
    title: "Yallah Baggage | Travel Light. We'll Handle the Rest.",
    description:
      "Your bags handled safely. Door-to-door luggage concierge across Dubai and the UAE.",
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

import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales } from "@/i18n/request";

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as (typeof locales)[number])) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${poppins.variable} h-full antialiased scroll-smooth`}
      dir={locale === "ar" ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <div className="min-h-full flex flex-col tracking-tight">
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </div>
      </body>
    </html>
  );
}
