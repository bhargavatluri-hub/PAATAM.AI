"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "../ui/Icon";

type ProductVideoProps = {
  /** File name in /public/videos without extension (.mp4, .webm and a .jpg poster must exist). */
  name: string;
  /** Describes what the video shows, for screen readers. */
  label: string;
  className?: string;
};

/**
 * A silent, looping product animation.
 * - Autoplays muted only when motion is allowed; otherwise shows the poster until played.
 * - Always offers a pause/play control (WCAG 2.2.2).
 * - Pauses while off-screen to save battery and bandwidth.
 */
export function ProductVideo({ name, label, className = "" }: ProductVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [userPaused, setUserPaused] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !userPaused) {
          video.play().catch(() => setPlaying(false));
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [userPaused]);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      setUserPaused(false);
      video.play().catch(() => setPlaying(false));
    } else {
      setUserPaused(true);
      video.pause();
    }
  };

  return (
    <figure className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-night-2 shadow-[0_40px_120px_-40px_rgb(0_0_0/0.9)] ${className}`}>
      <video
        ref={videoRef}
        className="block aspect-video w-full"
        muted
        loop
        playsInline
        preload="metadata"
        poster={`/videos/${name}.jpg`}
        aria-label={label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        {/* H.264 for Safari and most browsers; VP9 fallback for Chromium builds without H.264. */}
        <source src={`/videos/${name}.mp4`} type="video/mp4" />
        <source src={`/videos/${name}.webm`} type="video/webm" />
      </video>
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause video" : "Play video"}
        className="absolute bottom-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white backdrop-blur transition-opacity hover:bg-black/75 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
      >
        <Icon name={playing ? "pause" : "play"} size={15} />
      </button>
    </figure>
  );
}
