import Image from "next/image";
import { Link } from "@/navigation";

type SiteLogoProps = {
  variant?: "header" | "footer" | "inline";
  href?: string;
  className?: string;
  priority?: boolean;
};

const variants = {
  /** Full logo: Yallah + BAGGAGE + tagline */
  header: {
    src: "/logo-full.png",
    width: 1536,
    height: 1024,
    className:
      "h-[72px] sm:h-[80px] md:h-[96px] lg:h-[112px] w-auto max-w-[min(280px,65vw)] sm:max-w-[min(320px,70vw)] lg:max-w-[min(400px,50vw)]",
  },
  footer: {
    src: "/logo-footer-white.png",
    width: 1536,
    height: 1024,
    className: "h-[72px] sm:h-20 md:h-24 w-auto max-w-[min(320px,90vw)]",
  },
  inline: {
    src: "/logo-full.png",
    width: 600,
    height: 400,
    className: "h-16 sm:h-[72px] w-auto max-w-[220px]",
  },
} as const;

export function SiteLogo({
  variant = "header",
  href = "/",
  className = "",
  priority = false,
}: SiteLogoProps) {
  const cfg = variants[variant];
  const img = (
    <Image
      src={cfg.src}
      alt="Yallah Baggage"
      width={cfg.width}
      height={cfg.height}
      priority={priority}
      unoptimized
      className={`${cfg.className} object-contain object-left ${className}`.trim()}
    />
  );

  if (href === "" || href === undefined) return img;

  return (
    <Link
      href={href}
      className="flex h-full items-center shrink-0 py-1 sm:py-1.5"
      aria-label="Yallah Baggage home"
    >
      {img}
    </Link>
  );
}
