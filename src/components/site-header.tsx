"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { ButtonLink } from "@/components/button-link";
import { cn } from "@/lib/utils";
import { brand, logo } from "@/lib/brand";

/** Desktop text links only — reservation CTA is the gold button. */
const links = [
  { href: "/", label: "Home" },
  { href: "/gallery", label: "Gallery" },
  { href: "/hunts", label: "Packages" },
  { href: "/contact", label: "Contact Us" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isHome = pathname === "/";

  return (
    <header
      className={cn(
        "z-40 w-full",
        isHome
          ? "absolute inset-x-0 top-0"
          : "sticky top-0 border-b border-white/10 bg-[var(--brand-forest-deep)]/95 backdrop-blur",
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-6">
        <Link
          href="/"
          className="shrink-0 text-[var(--brand-cream)]"
          aria-label={brand.name}
        >
          <Image
            src={logo.srcDisplay}
            alt={logo.alt}
            width={72}
            height={72}
            className="size-14 object-contain md:size-[4.25rem]"
            priority
            unoptimized
          />
        </Link>
        <nav className="hidden items-center gap-5 lg:gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "whitespace-nowrap text-sm tracking-wide text-[var(--brand-cream)]/85 transition hover:text-[var(--brand-gold)]",
                pathname === link.href && "text-[var(--brand-gold)]",
              )}
            >
              {link.label}
            </Link>
          ))}
          <ButtonLink
            href="/book"
            className="shrink-0 whitespace-nowrap bg-[var(--brand-gold)] text-[var(--brand-ink)] hover:bg-[var(--brand-gold-bright)]"
          >
            Make a Reservation
          </ButtonLink>
        </nav>
        <button
          type="button"
          className="rounded-md p-2 text-[var(--brand-cream)] md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>
      {open ? (
        <div className="border-t border-white/10 bg-[var(--brand-forest)]/95 px-4 py-4 backdrop-blur md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-1 text-[var(--brand-cream)]"
              >
                {link.label}
              </Link>
            ))}
            <ButtonLink
              href="/book"
              onClick={() => setOpen(false)}
              className="mt-2 bg-[var(--brand-gold)] text-[var(--brand-ink)]"
            >
              Make a Reservation
            </ButtonLink>
          </div>
        </div>
      ) : null}
    </header>
  );
}
