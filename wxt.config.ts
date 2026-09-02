import { defineConfig } from "wxt";

export default defineConfig({
  manifest: {
    name: "Tab Color by URL",
    description: "Color your browser tabs based on URL patterns.",
    version: "0.1.0",
    icons: {
      16: "/icon-16.png",
      32: "/icon-32.png",
      48: "/icon-48.png",
      128: "/icon-128.png",
    },
    permissions: ["storage", "tabs", "activeTab"],
    host_permissions: ["<all_urls>"],
    browser_specific_settings: {
      gecko: {
        id: "tab-color-by-url@extension",
        strict_min_version: "109.0",
      },
    },
  },
  suppressWarnings: {
    firefoxDataCollection: true,
  },
});
