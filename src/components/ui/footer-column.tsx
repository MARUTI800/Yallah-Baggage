import { Facebook, Instagram, Linkedin, Youtube, Music2 } from "lucide-react";
import { Link } from "@/navigation";
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
        {/* Centered Brand Section */}
        <div className="flex flex-col items-center text-center mb-16 pb-16 border-b border-white/10">
          <p className="text-white/60 max-w-2xl text-lg lg:text-xl leading-relaxed font-medium mb-12 tracking-tight">
            {t("description")}
          </p>
          <ul className="flex items-center justify-center gap-6">
            {socialLinks.map(({ icon: Icon, label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-white/40 hover:bg-[#1E5BD7] hover:text-white transition-all duration-500 border border-white/5 hover:shadow-[0_10px_25px_rgba(30,91,215,0.3)] hover:-translate-y-2"
                >
                  <span className="sr-only">{label}</span>
                  <Icon className="size-6 transition-transform duration-500 group-hover:scale-110" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-16 lg:gap-24 text-left">
          <div className="flex flex-col items-start">
            <p className="text-xs font-black text-white/40 mb-8 uppercase tracking-[0.25em]">
              {t("company")}
            </p>
            <ul className="space-y-5">
              {aboutLinks.map(({ text, href }) => (
                <li key={text}>
                  <Link
                    className="text-[15px] text-white/50 hover:text-white transition-all duration-300 font-semibold hover:translate-x-2 inline-block"
                    href={href}
                  >
                    {text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col items-start">
            <p className="text-xs font-black text-white/40 mb-8 uppercase tracking-[0.25em]">
              {t("services")}
            </p>
            <ul className="space-y-5">
              {serviceLinks.map(({ text, href }) => (
                <li key={text}>
                  <Link
                    className="text-[15px] text-white/50 hover:text-white transition-all duration-300 font-semibold hover:translate-x-2 inline-block"
                    href={href}
                  >
                    {text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col items-start sm:col-span-2 md:col-span-1">
            <p className="text-xs font-black text-white/40 mb-8 uppercase tracking-[0.25em]">
              {t("support")}
            </p>
            <ul className="space-y-5">
              {helpfulLinks.map(({ text, href }) => (
                <li key={text}>
                  <a
                    href={href}
                    className="text-[15px] text-white/50 hover:text-white transition-all duration-300 font-semibold hover:translate-x-2 inline-block"
                  >
                    {text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-20 border-t border-white/5 pt-10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <p className="text-xs text-white/20 font-bold tracking-widest uppercase">
              &copy; {new Date().getFullYear()} {data.company.name}.{" "}
              {t("allRightsReserved")}
            </p>
            <div className="flex items-center gap-4">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
              <p className="text-xs text-white/20 font-bold tracking-widest uppercase">
                {t("tagline")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
