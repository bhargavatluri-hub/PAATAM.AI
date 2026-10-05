import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

const pages = ["", "/product", "/how-it-works", "/for-schools", "/for-teachers", "/about", "/demo", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((path) => ({
    url: `${siteConfig.url}${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.8,
  }));
}
