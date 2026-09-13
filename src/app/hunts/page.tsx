import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/button-link";
import { brand, images } from "@/lib/brand";
import {
  bigGameHunts,
  dayHunts,
  echoAddOns,
  echoNotes,
  echoPackages,
  riverviewIncludes,
  riverviewNotes,
  riverviewPackages,
  siteCta,
  turkeyHunts,
} from "@/lib/site-content";

export default function HuntsPage() {
  return (
    <div className="pt-24">
      <section className="relative min-h-[50vh] overflow-hidden">
        <Image
          src={images.dogs}
          alt="Working dog ready for an upland hunt"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-[var(--brand-forest-deep)]/65" />
        <div className="relative mx-auto flex min-h-[50vh] max-w-6xl items-end px-4 pb-12 md:px-6">
          <div>
            <p className="text-xs tracking-[0.22em] text-[var(--brand-gold)] uppercase">
              Hunting Packages
            </p>
            <h1 className="mt-3 max-w-2xl font-display text-4xl text-[var(--brand-cream)] md:text-5xl">
              Full Service Riverview Lodge, Self Service Hunts, Day Hunts & more
            </h1>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-20 px-4 py-16 md:px-6 md:py-20">
        <div id="riverview">
          <h2 className="font-display text-3xl text-[var(--brand-forest-deep)] md:text-4xl">
            Full Service Riverview Lodge Hunting Package
          </h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-[var(--brand-ink)]/80">
            Step into a fully guided, all-inclusive hunting experience designed
            for those who expect more. From the moment you arrive, every detail
            is handled — exceptional dogs, seasoned guides, chef-driven meals,
            and a lodge atmosphere built to unwind after the hunt. All packages
            include:
          </p>
          <p className="mt-3 font-medium text-[var(--brand-forest-deep)]">
            {riverviewIncludes}
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {riverviewPackages.map((pkg) => (
              <article
                key={pkg.id}
                className="border border-[var(--brand-forest)]/15 bg-[var(--brand-cream)]/40 p-6"
              >
                <h3 className="font-display text-xl text-[var(--brand-forest-deep)]">
                  {pkg.name}
                </h3>
                <p className="mt-4 text-2xl font-medium text-[var(--brand-forest)]">
                  {pkg.priceLabel}
                </p>
                <p className="mt-1 text-sm text-[var(--brand-ink)]/70">
                  {pkg.nonHunter}
                </p>
                <ul className="mt-4 space-y-2 text-sm text-[var(--brand-ink)]/80">
                  {pkg.details.map((d) => (
                    <li key={d}>• {d}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <ul className="mt-8 space-y-2 text-sm text-[var(--brand-ink)]/70">
            {riverviewNotes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
          <ButtonLink
            href={`${siteCta.href}?hunt=hunt_rv_15`}
            className="mt-8 bg-[var(--brand-forest)] text-[var(--brand-cream)]"
          >
            {siteCta.label}
          </ButtonLink>
        </div>

        <div id="echo">
          <h2 className="font-display text-3xl text-[var(--brand-forest-deep)] md:text-4xl">
            Self Service Hunting Packages
          </h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-[var(--brand-ink)]/80">
            Echo Lodge, downriver, is ideal for more casual guided or non-guided
            groups. Comfortable and well-stocked—custom-tailor your Echo Hunt.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {echoPackages.map((pkg) => (
              <article
                key={pkg.id}
                className="border border-[var(--brand-forest)]/15 bg-white/60 p-6"
              >
                <h3 className="font-display text-xl text-[var(--brand-forest-deep)]">
                  {pkg.name}
                </h3>
                <p className="mt-4 text-2xl font-medium text-[var(--brand-forest)]">
                  {pkg.priceLabel}
                </p>
              </article>
            ))}
          </div>
          <ul className="mt-6 space-y-2 text-sm text-[var(--brand-ink)]/80">
            {echoAddOns.map((a) => (
              <li key={a}>• {a}</li>
            ))}
          </ul>
          <ul className="mt-4 space-y-2 text-sm text-[var(--brand-ink)]/70">
            {echoNotes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
          <ButtonLink
            href={`${siteCta.href}?hunt=hunt_echo_1`}
            className="mt-8 bg-[var(--brand-forest)] text-[var(--brand-cream)]"
          >
            {siteCta.label}
          </ButtonLink>
        </div>

        <div id="day-hunts">
          <h2 className="font-display text-3xl text-[var(--brand-forest-deep)] md:text-4xl">
            Day Hunts at our ranch
          </h2>
          <div className="mt-4 max-w-3xl space-y-4 leading-relaxed text-[var(--brand-ink)]/80">
            <p>{dayHunts.intro}</p>
            <p>{dayHunts.halfDay}</p>
            <p>{dayHunts.fullDay}</p>
            <p className="font-medium text-[var(--brand-forest-deep)]">
              {dayHunts.pricing}
            </p>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="border border-[var(--brand-forest)]/15 p-6">
              <h3 className="font-display text-xl">Full Day</h3>
              <p className="mt-3 text-2xl text-[var(--brand-forest)]">
                ${dayHunts.fullDayPrice} / person
              </p>
            </div>
            <div className="border border-[var(--brand-forest)]/15 p-6">
              <h3 className="font-display text-xl">Half Day</h3>
              <p className="mt-3 text-2xl text-[var(--brand-forest)]">
                ${dayHunts.halfDayPrice} / person
              </p>
            </div>
          </div>
          <p className="mt-6 text-sm text-[var(--brand-ink)]/70">
            For more information call {brand.phone} or email us at {brand.email}
          </p>
          <ButtonLink
            href={`${siteCta.href}?hunt=hunt_day_full`}
            className="mt-6 bg-[var(--brand-forest)] text-[var(--brand-cream)]"
          >
            {siteCta.label}
          </ButtonLink>
        </div>

        <div id="big-game">
          <h2 className="font-display text-3xl text-[var(--brand-forest-deep)] md:text-4xl">
            Big Game Hunts
          </h2>
          <p className="mt-2 text-lg text-[var(--brand-ink)]/80">
            {bigGameHunts.headline}
          </p>
          <p className="mt-4 max-w-3xl leading-relaxed text-[var(--brand-ink)]/80">
            {bigGameHunts.intro}
          </p>
          <p className="mt-2 text-sm text-[var(--brand-ink)]/70">
            {bigGameHunts.note}
          </p>
          <div className="mt-8 space-y-4">
            {bigGameHunts.packages.map((pkg) => (
              <div
                key={pkg.name}
                className="flex flex-wrap items-baseline justify-between gap-2 border-t border-[var(--brand-forest)]/15 pt-4"
              >
                <h3 className="font-display text-xl text-[var(--brand-forest-deep)]">
                  {pkg.name}
                </h3>
                <p className="text-xl text-[var(--brand-forest)]">
                  {pkg.priceLabel}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-[var(--brand-ink)]/80">
            {bigGameHunts.contact}
          </p>
          <Link
            href="/contact"
            className="mt-4 inline-block text-sm text-[var(--brand-moss)] hover:underline"
          >
            Contact Us →
          </Link>
        </div>

        <div id="turkey">
          <h2 className="font-display text-3xl text-[var(--brand-forest-deep)] md:text-4xl">
            Turkey Hunts
          </h2>
          <p className="mt-4 text-[var(--brand-ink)]/80">{turkeyHunts.headline}</p>
          <p className="mt-4 text-3xl text-[var(--brand-forest)]">
            {turkeyHunts.priceLabel}
          </p>
          <p className="mt-4 text-sm text-[var(--brand-ink)]/80">
            {turkeyHunts.contact}
          </p>
        </div>
      </section>
    </div>
  );
}
