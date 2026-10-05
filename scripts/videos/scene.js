// Shared helpers for deterministic video scenes. Each scene defines window.render(t)
// (t in seconds) and window.SCENE = { duration, fps }. render.mjs steps t frame by frame.
window.clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
// Progress of t between a and b, eased (easeOutCubic).
window.p = (t, a, b) => {
  const x = clamp((t - a) / (b - a));
  return 1 - Math.pow(1 - x, 3);
};
window.lin = (t, a, b) => clamp((t - a) / (b - a));
window.lerp = (a, b, x) => a + (b - a) * x;
window.$ = (id) => document.getElementById(id);
window.set = (el, styles) => Object.assign((typeof el === "string" ? $(el) : el).style, styles);
// Global fade-in at start and fade-out at the end so the video loops seamlessly.
window.loopFade = (t, duration) => {
  const f = Math.min(p(t, 0, 0.5), 1 - lin(t, duration - 0.6, duration));
  $("stage").style.opacity = f;
};
window.CURSOR_SVG =
  '<svg viewBox="0 0 24 24" width="26" height="26"><path d="M4 2l16 9-7 2-3 7z" fill="#fff" stroke="#07090b" stroke-width="1.5" stroke-linejoin="round"/></svg>';
