import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/button-link";
import { brand, images } from "@/lib/brand";
import { homeCopy, siteCta } from "@/lib/site-content";

export default function HomePage() {
  return (
    <>
      <section className="relative min-h-[100svh] overflow-hidden">
        <Image
          src={images.hero}
          alt="Eastern Oregon hills and open sky above Horseshoe Curve country"
          fill
          priority
          className="object-cover ken-burns"
          sizes="100vw"
        />
        <div className="hero-veil absolute inset-0" />
        <div className="relative z-10 flex min-h-[100svh] items-end px-4 pb-16 pt-28 md:items-center md:px-6 md:pb-24">
          <div className="mx-auto w-full max-w-6xl">
            <p className="fade-up font-display text-3xl leading-none tracking-[0.06em] text-[var(--brand-cream)] uppercase sm:text-5xl md:text-6xl lg:text-7xl">
              {brand.name}
            </p>
            <h1 className="fade-up-delay mt-6 max-w-3xl font-display text-2xl leading-snug text-[var(--brand-cream)] sm:text-3xl md:text-4xl">
              {homeCopy.heroHeadline}
            </h1>
            <p className="fade-up-delay-2 mt-5 max-w-xl text-base leading-relaxed text-[var(--brand-cream)]/85 md:text-lg">
              {homeCopy.dreamLine}
            </p>
            <div className="fade-up-delay-2 mt-8 flex flex-wrap gap-3">
              <ButtonLink
                href={siteCta.href}
                size="lg"
                className="bg-[var(--brand-gold)] px-7 text-[var(--brand-ink)] hover:bg-[var(--brand-gold-bright)]"
              >
                {siteCta.label}
              </ButtonLink>
              <ButtonLink
                href="/hunts"
                size="lg"
                variant="outline"
                className="border-[var(--brand-cream)]/40 bg-transparent text-[var(--brand-cream)] hover:bg-white/10 hover:text-[var(--brand-cream)]"
              >
                Hunting Packages
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-20 md:grid-cols-2 md:items-center md:px-6 md:py-28">
        <div>
          <p className="text-xs tracking-[0.22em] text-[var(--brand-moss)] uppercase">
            {homeCopy.eyebrow}
          </p>
          <h2 className="mt-3 font-display text-3xl text-[var(--brand-forest-deep)] md:text-4xl">
            Wildlife plentiful. Air fresh. Hunting pressure low.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[var(--brand-ink)]/80">
            {homeCopy.locationLine}
          </p>
          <p className="mt-4 text-base leading-relaxed text-[var(--brand-ink)]/80">
            {homeCopy.packagePitch}
          </p>
          <p className="mt-4 text-base leading-relaxed text-[var(--brand-ink)]/80">
            {homeCopy.echoPitch}
          </p>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden md:aspect-[5/6]">
          <Image
            src={images.river}
            alt="River corridor through cultivated Eastern Oregon farmland"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </section>

      <section className="bg-[var(--brand-forest)] text-[var(--brand-cream)]">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-3 md:px-6 md:py-20">
          {homeCopy.cards.map((item) => (
            <div key={item.title}>
              <h3 className="font-display text-2xl tracking-wide">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--brand-cream)]/75">
                {item.copy}
              </p>
              <Link
                href={item.href}
                className="mt-5 inline-block text-sm text-[var(--brand-gold)] hover:text-[var(--brand-gold-bright)]"
              >
                Learn more →
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={images.farmland}
            alt="Golden farmland at dusk"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[var(--brand-forest-deep)]/70" />
        </div>
        <div className="relative mx-auto max-w-3xl px-4 py-24 text-center md:px-6">
          <h2 className="font-display text-3xl text-[var(--brand-cream)] md:text-4xl">
            {brand.fullAddress}
          </h2>
          <p className="mt-4 text-[var(--brand-cream)]/80">
            {brand.phone} · {brand.email}
          </p>
          <ButtonLink
            href={siteCta.href}
            size="lg"
            className="mt-8 bg-[var(--brand-gold)] text-[var(--brand-ink)] hover:bg-[var(--brand-gold-bright)]"
          >
            {siteCta.label}
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
