import type { MetadataRoute } from "next";

// Generates /manifest.webmanifest so the admin can be installed as a PWA.
// Colors come from the JJ's Kitchen brand palette (see globals.css).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "JJ's Kitchen Admin",
    short_name: "JJ's Admin",
    description: "JJ's Kitchen Admin Dashboard",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#F1E2D1", // Cream
    theme_color: "#541A1A", // Dark Coffee Brown (primary)
    icons: [
      {
        src: "/favicon/favicon-dark/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/favicon/favicon-dark/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/favicon/maskable-icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
