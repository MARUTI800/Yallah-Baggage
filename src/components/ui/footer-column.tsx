import { Facebook, Instagram, Linkedin, Youtube, Music2 } from "lucide-react";
import { Link } from "@/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";

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
    logo: "/Logo.png",
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
  ];
  return (
    <footer
      id="footer"
      className="bg-[#0A2E6D] w-full pt-16 pb-8 px-6 lg:px-10"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <Image
                src="/Logo_primary.png"
                alt="Yallah Baggage"
                width={150}
                height={40}
                className="h-10 w-auto object-contain brightness-0 invert"
              />
            </div>
            <p className="text-white/50 mt-5 max-w-xs text-sm leading-relaxed font-medium">
              {t("description")}
            </p>
            <ul className="mt-6 flex gap-3">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white/60 hover:bg-white/20 hover:text-white transition-all duration-200"
                  >
                    <span className="sr-only">{label}</span>
                    <Icon className="size-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 lg:col-span-3">
            <div>
              <p className="text-sm font-semibold text-white mb-4">
                {t("company")}
              </p>
              <ul className="space-y-3">
                {aboutLinks.map(({ text, href }) => (
                  <li key={text}>
                    <Link
                      className="text-sm text-white/50 hover:text-white transition-colors font-medium"
                      href={href}
                    >
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-white mb-4">
                {t("services")}
              </p>
              <ul className="space-y-3">
                {serviceLinks.map(({ text, href }) => (
                  <li key={text}>
                    <Link
                      className="text-sm text-white/50 hover:text-white transition-colors font-medium"
                      href={href}
                    >
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-white mb-4">
                {t("support")}
              </p>
              <ul className="space-y-3">
                {helpfulLinks.map(({ text, href }) => (
                  <li key={text}>
                    <a
                      href={href}
                      className="text-sm text-white/50 hover:text-white transition-colors font-medium"
                    >
                      {text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-white/30 font-medium">
              &copy; {new Date().getFullYear()} {data.company.name}.{" "}
              {t("allRightsReserved")}
            </p>
            <p className="text-xs text-white/30 font-medium">{t("tagline")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
