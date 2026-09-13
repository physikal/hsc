"use client";

import { useEffect, useRef, useState } from "react";
import { media } from "@/lib/brand";

/**
 * Chrome (and other Chromium builds) now report canPlayType("application/vnd.apple.mpegurl")
 * as "maybe", but still cannot play many AES-128 HLS streams natively. Prefer hls.js whenever
 * MSE is available; only fall back to native HLS on Safari/iOS where hls.js is unsupported.
 */
export function DayInTheLifeVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: { destroy: () => void } | null = null;
    let cancelled = false;

    function onMediaError() {
      if (!cancelled) {
        setError("Video could not be loaded. Please try again later.");
        setReady(false);
      }
    }

    function onCanPlay() {
      if (!cancelled) setReady(true);
    }

    video.addEventListener("error", onMediaError);
    video.addEventListener("canplay", onCanPlay);

    async function setup() {
      const el = videoRef.current;
      if (!el) return;
      setError(null);
      setReady(false);
      const src = media.dayInTheLifeHls;

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
          instance.on(Hls.Events.MANIFEST_PARSED, () => {
            if (!cancelled) setReady(true);
          });
          instance.on(Hls.Events.ERROR, (_event, data) => {
            if (data.fatal) {
              setError("Video could not be loaded. Please try again later.");
              setReady(false);
            }
          });
          hls = instance;
          return;
        }

        if (target.canPlayType("application/vnd.apple.mpegurl")) {
          target.src = src;
          return;
        }

        setError("This browser cannot play the Day in the Life video.");
      } catch {
        if (!cancelled) {
          setError("Video could not be loaded. Please try again later.");
        }
      }
    }

    void setup();

    return () => {
      cancelled = true;
      video.removeEventListener("error", onMediaError);
      video.removeEventListener("canplay", onCanPlay);
      hls?.destroy();
    };
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-4 pb-6 md:px-6 md:pb-10">
      <div className="overflow-hidden bg-[var(--brand-forest-deep)]">
        <div className="relative aspect-video w-full">
          <video
            ref={videoRef}
            className="relative z-10 h-full w-full object-cover"
            controls
            playsInline
            preload="metadata"
            poster={media.dayInTheLifePoster}
            aria-label={media.dayInTheLifeTitle}
          />
          {!ready && !error ? (
            <p className="pointer-events-none absolute inset-x-0 bottom-3 z-20 text-center text-xs tracking-[0.14em] text-[var(--brand-cream)]/70 uppercase">
              Loading video…
            </p>
          ) : null}
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
