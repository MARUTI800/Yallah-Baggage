import { ReactNode } from "react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

type Props = {
  children: ReactNode;
};

// Root layout — owns the <html> and <body> tags.
// The [locale] layout provides locale-specific wrappers (IntlProvider, dir, lang).
export default function RootLayout({ children }: Props) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} h-full antialiased`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
