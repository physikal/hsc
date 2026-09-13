"use client";

import { useEffect, useRef, useState } from "react";
import { media } from "@/lib/brand";

export function DayInTheLifeVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: { destroy: () => void } | null = null;
    let cancelled = false;

    async function setup() {
      const el = videoRef.current;
      if (!el) return;
      setError(null);
      const src = media.dayInTheLifeHls;

      if (el.canPlayType("application/vnd.apple.mpegurl")) {
        el.src = src;
        return;
      }

      try {
        const Hls = (await import("hls.js")).default;
        if (cancelled || !videoRef.current) return;
        const target = videoRef.current;
        if (Hls.isSupported()) {
          const instance = new Hls({
            enableWorker: true,
            lowLatencyMode: false,
          });
          instance.loadSource(src);
          instance.attachMedia(target);
          instance.on(Hls.Events.ERROR, (_event, data) => {
            if (data.fatal) {
              setError("Video could not be loaded. Please try again later.");
            }
          });
          hls = instance;
        } else {
          setError("This browser cannot play the Day in the Life video.");
        }
      } catch {
        if (!cancelled) {
          setError("Video could not be loaded. Please try again later.");
        }
      }
    }

    void setup();

    return () => {
      cancelled = true;
      hls?.destroy();
    };
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-4 pb-6 md:px-6 md:pb-10">
      <div className="overflow-hidden bg-[var(--brand-forest-deep)]">
        <div className="relative aspect-video w-full">
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            controls
            playsInline
            preload="metadata"
            poster={media.dayInTheLifePoster}
            aria-label={media.dayInTheLifeTitle}
          />
        </div>
        {error ? (
          <p className="px-4 py-3 text-center text-sm text-[var(--brand-cream)]/80">
            {error}
          </p>
        ) : null}
      </div>
      <p className="mt-3 text-center text-xs tracking-[0.18em] text-[var(--brand-moss)] uppercase">
        {media.dayInTheLifeTitle}
      </p>
    </section>
  );
}
