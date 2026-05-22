"use client";

import { Facebook, Instagram, Linkedin, Youtube, Music2 } from "lucide-react";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";
import { SiteLogo } from "@/components/ui/site-logo";

const data = {
  facebookLink: "https://www.facebook.com/profile.php?id=61559429296077",
  instaLink: "https://www.instagram.com/yallah_baggage/?hl=en",
  linkedinLink:
    "https://www.linkedin.com/company/yallah-baggage/?viewAsMember=true",
  tiktokLink: "https://www.tiktok.com/@yallahbaggage?lang=en",
  youtubeLink: "https://www.youtube.com/@YallahBaggage",
  contact: {
    email: "support@yallahbaggage.com",
    phone: "+971 50 123 4567",
    address: "Dubai, United Arab Emirates",
  },
  company: {
    name: "Yallah Baggage",
    description:
      "Dubai's premier luggage concierge. Travel Light. We'll Handle the Rest.",
  },
};

const socialLinks = [
  { icon: Facebook, label: "Facebook", href: data.facebookLink },
  { icon: Instagram, label: "Instagram", href: data.instaLink },
  { icon: Linkedin, label: "LinkedIn", href: data.linkedinLink },
  { icon: Music2, label: "TikTok", href: data.tiktokLink },
  { icon: Youtube, label: "YouTube", href: data.youtubeLink },
];

export default function Footer4Col() {
  const t = useTranslations("Footer");
  const nt = useTranslations("Navigation");
  const lt = useTranslations("Legal");

  const aboutLinks = [
    { text: t("aboutUs"), href: "/#home" },
    { text: t("ourFleet"), href: "/#services" },
    { text: t("areasServed"), href: "/#services" },
    { text: nt("partnerships"), href: "/partnerships" },
  ];

  const serviceLinks = [
    { text: t("airportTransfer"), href: "/" },
    { text: t("hotelDelivery"), href: "/" },
    { text: t("luggageStorage"), href: "/" },
  ];

  const helpfulLinks = [
    { text: nt("faq"), href: "/#faq" },
    { text: nt("partnerships"), href: "/partnerships" },
    { text: t("liveChat"), href: "mailto:support@yallahbaggage.com" },
    { text: lt("privacyPolicy"), href: "/privacy-policy" },
    { text: lt("prohibitedItems"), href: "/prohibited-items" },
    { text: lt("termsOfService"), href: "/terms" },
  ];

  return (
    <footer
      id="footer"
      className="bg-[#0A2E6D] w-full pt-20 pb-10 px-6 lg:px-10 border-t border-white/5"
    >
      <div className="mx-auto max-w-[1400px]">
        {/* Brand Header */}
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-8 mb-20">
          <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-xl">
            <div className="mb-8">
              <SiteLogo variant="footer" />
            </div>
            <p className="text-white/50 text-base lg:text-lg leading-relaxed font-medium tracking-tight">
              {t("description")}
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-6">
            <ul className="flex items-center gap-4">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-white/30 hover:bg-[#1E5BD7] hover:text-white transition-all duration-300 border border-white/5"
                  >
                    <span className="sr-only">{label}</span>
                    <Icon className="size-5 transition-transform duration-300 group-hover:scale-110" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-12 lg:gap-24">
          <div className="flex flex-col items-start col-span-1">
            <p className="text-[11px] font-black text-white/30 mb-8 uppercase tracking-[0.3em]">
              {t("company")}
            </p>
            <ul className="space-y-4">
              {aboutLinks.map(({ text, href }) => (
                <li key={text}>
                  <Link
                    className="text-sm text-white/50 hover:text-[#1E5BD7] transition-all duration-300 font-bold"
                    href={href}
                  >
                    {text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col items-start col-span-1">
            <p className="text-[11px] font-black text-white/30 mb-8 uppercase tracking-[0.3em]">
              {t("services")}
            </p>
            <ul className="space-y-4">
              {serviceLinks.map(({ text, href }) => (
                <li key={text}>
                  <Link
                    className="text-sm text-white/50 hover:text-[#1E5BD7] transition-all duration-300 font-bold"
                    href={href}
                  >
                    {text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col items-start col-span-2 md:col-span-1">
            <p className="text-[11px] font-black text-white/30 mb-8 uppercase tracking-[0.3em]">
              {t("support")}
            </p>
            <ul className="space-y-4">
              {helpfulLinks.map(({ text, href }) => (
                <li key={text}>
                  {href.startsWith("mailto:") ? (
                    <a
                      href={href}
                      className="text-sm text-white/50 hover:text-[#1E5BD7] transition-all duration-300 font-bold"
                    >
                      {text}
                    </a>
                  ) : (
                    <Link
                      href={href}
                      className="text-sm text-white/50 hover:text-[#1E5BD7] transition-all duration-300 font-bold"
                    >
                      {text}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-20 pt-10 border-t border-white/5">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <p className="text-[10px] text-white/20 font-black tracking-[0.2em] uppercase">
              &copy; {new Date().getFullYear()} {data.company.name}. {t("allRightsReserved")}
            </p>
            <div className="flex items-center gap-6">
              <p className="text-[10px] text-white/20 font-black tracking-[0.2em] uppercase">
                {t("tagline")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
