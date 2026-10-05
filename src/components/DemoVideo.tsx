type DemoVideoProps = {
  className?: string;
};

/** The narrated product demo (1:37) with native controls, captions and a download fallback. */
export function DemoVideo({ className = "" }: DemoVideoProps) {
  return (
    <figure className={className}>
      <div className="overflow-hidden rounded-2xl border border-line-strong bg-ink shadow-[0_40px_100px_-40px_rgb(18_36_43/0.55)]">
        <video
          className="aspect-video w-full"
          controls
          playsInline
          preload="metadata"
          poster="/videos/paatam-demo.jpg"
          aria-label="Paatam.ai product demo with teacher voice-over"
        >
          <source src="/videos/paatam-demo.mp4" type="video/mp4" />
          <track kind="captions" src="/videos/paatam-demo.vtt" srcLang="en" label="English" />
          Your browser can’t play this video.{" "}
          <a href="/videos/paatam-demo.mp4" className="underline">
            Download the demo (MP4)
          </a>
          .
        </video>
      </div>
      <figcaption className="mt-3 text-sm text-muted">
        Product demo · 1:37 · Product screens are illustrative, with fictional students, teachers and marks. Voice-over
        is AI-generated.
      </figcaption>
    </figure>
  );
}
