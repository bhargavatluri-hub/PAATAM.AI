import { ImageResponse } from "next/og";
import { SWOOSH_PATH, WORDMARK_PATH, WORDMARK_VIEWBOX } from "@/components/ui/brandPaths";

export const alt = "Paatam.ai — Turning Assessments into Learning Intelligence";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#faf7f1",
          padding: "56px 80px 64px",
          color: "#12242b",
          fontFamily: "serif",
        }}
      >
        <svg width="330" height="178" viewBox={WORDMARK_VIEWBOX}>
          <path fill="#12242b" fillRule="evenodd" d={WORDMARK_PATH} />
          <path fill="#0e5a5f" d={SWOOSH_PATH} />
        </svg>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: -1.5 }}>
            Turning Assessments into Learning Intelligence.
          </div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 32, color: "#55656b", fontFamily: "sans-serif" }}>
            AI-assisted evaluation of handwritten answer sheets — with teachers always in control.
          </div>
        </div>

        <div style={{ display: "flex", height: 10, width: 220, background: "#f0a53a", borderRadius: 999 }} />
      </div>
    ),
    size,
  );
}
