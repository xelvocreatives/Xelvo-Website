import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { siteMetadata } from "@/lib/site/seo";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});


// Site name, default description, share picture and Google/Bing
// verification come from Admin → Website → SEO & Google.
export function generateMetadata(): Promise<Metadata> {
  return siteMetadata();
}

export const viewport: Viewport = {
  themeColor: "#FF6600",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakartaSans.variable} antialiased font-sans`}>
        {children}
      </body>
    </html>
  );
}

