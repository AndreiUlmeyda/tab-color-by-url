import { defineConfig } from "wxt";

export default defineConfig({
  manifest: {
    name: "Tab Color by URL",
    description: "Color your browser tabs based on URL patterns.",
    version: "0.1.0",
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
