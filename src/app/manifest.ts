import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "QueuedUp",
    short_name: "QueuedUp",
    description: "Personal DSA practice journal with spaced-repetition review.",
    start_url: "/",
    display: "standalone",
    background_color: "#F5F1E8",
    theme_color: "#111111",
    orientation: "portrait",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
