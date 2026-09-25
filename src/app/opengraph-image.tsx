import { ImageResponse } from "next/og";

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
          padding: "72px 80px",
          color: "#12242b",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="72" height="72" viewBox="0 0 32 32">
            <rect width="32" height="32" rx="8" fill="#0e5a5f" />
            <path
              d="M11 25V11.5M11 12.5c1.2-1.6 3-2.5 5-2.5 3.3 0 6 2.5 6 5.75S19.3 21.5 16 21.5c-2 0-3.8-.9-5-2.5"
              fill="none"
              stroke="#fff"
              strokeWidth="2.6"
              strokeLinecap="round"
            />
            <circle cx="23.5" cy="23.5" r="2.6" fill="#f0a53a" />
          </svg>
          <div style={{ display: "flex", fontSize: 44, fontWeight: 700 }}>
            Paatam<span style={{ color: "#0e5a5f" }}>.ai</span>
          </div>
        </div>

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
