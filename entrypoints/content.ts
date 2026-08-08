import { matchRule } from "../src/rules";
import { getRules } from "../src/storage";
import { compositeFavicon } from "../src/composite";
import type { Message } from "../src/messages";

export default defineContentScript({
  matches: ["<all_urls>"],
  runAt: "document_idle",
  async main() {
    const rules = await getRules();
    const color = matchRule(rules, location.href);
    if (!color) return;

    await applyOverlay(color);

    const observer = new MutationObserver(() => {
      applyOverlay(color);
    });
    observer.observe(document.head, { childList: true, subtree: true });
  },
});

async function applyOverlay(color: string): Promise<void> {
  const faviconUrl = getFaviconUrl();
  if (!faviconUrl) return;

  const dataUri = await fetchFaviconDataUri(faviconUrl);
  if (!dataUri) {
    injectSolidColorFavicon(color);
    return;
  }

  const composited = await compositeFromDataUri(dataUri, color);
  injectFavicon(composited);
}

function getFaviconUrl(): string | null {
  const link = document.querySelector<HTMLLinkElement>("link[rel*='icon']");
  if (link?.href) return link.href;
  return `${location.origin}/favicon.ico`;
}

async function fetchFaviconDataUri(url: string): Promise<string | null> {
  return new Promise((resolve) => {
    const msg: Message = { type: "FETCH_FAVICON", url };
    browser.runtime.sendMessage(msg).then((resp: unknown) => {
      const r = resp as { dataUri: string | null };
      resolve(r?.dataUri ?? null);
    }).catch(() => resolve(null));
  });
}

async function compositeFromDataUri(
  dataUri: string,
  color: string,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const size = Math.max(img.naturalWidth || 32, img.naturalHeight || 32, 32);
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, size, size);
      const imageData = ctx.getImageData(0, 0, size, size);
      const composited = compositeFavicon(imageData, color);
      ctx.putImageData(composited, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = dataUri;
  });
}

function injectFavicon(dataUri: string): void {
  const existing = document.querySelector("link[rel*='icon']");
  if (existing) existing.remove();

  const link = document.createElement("link");
  link.rel = "icon";
  link.type = "image/png";
  link.href = dataUri;
  document.head.appendChild(link);
}

function injectSolidColorFavicon(color: string): void {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 32, 32);
  injectFavicon(canvas.toDataURL("image/png"));
}
