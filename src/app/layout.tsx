import type { Metadata } from "next";
import { Libre_Baskerville, Karla } from "next/font/google";
import { HideVercelToolbar } from "@/components/hide-vercel-toolbar";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { brand, logo } from "@/lib/brand";
import "./globals.css";

const display = Libre_Baskerville({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const sans = Karla({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${brand.name} | Premiere Hunting in Pendleton, Oregon`,
    template: `%s | ${brand.name}`,
  },
  description:
    "Premiere upland bird hunting just outside Pendleton, Oregon. Riverview Lodge, Echo Lodge, day hunts, and lodge hospitality along the Umatilla River.",
  icons: {
    icon: [{ url: logo.srcIcon, type: "image/webp" }],
    apple: [{ url: logo.srcDisplay }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
        <HideVercelToolbar />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
