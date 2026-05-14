import type { Metadata } from "next";
import "./../globals.css";

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

export default async function LocaleLayout({
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
  const messages = await getMessages();

  return (
    <div
      className="min-h-full flex flex-col tracking-tight"
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <NextIntlClientProvider messages={messages}>
        {children}
      </NextIntlClientProvider>
    </div>
  );
}
