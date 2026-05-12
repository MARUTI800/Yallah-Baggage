import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

// This layout is used for routes that don't match the middleware (like 404s)
export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
