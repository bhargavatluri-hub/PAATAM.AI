import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

const pages = ["", "/product", "/how-it-works", "/for-schools", "/for-teachers", "/about", "/demo", "/contact", "/privacy", "/terms"];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((path) => ({
    url: `${siteConfig.url}${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : path === "/privacy" || path === "/terms" ? 0.3 : 0.8,
  }));
}
