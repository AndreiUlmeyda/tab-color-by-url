import type { Message } from "../src/messages";

export default defineBackground(() => {
  browser.runtime.onMessage.addListener(
    (msg: unknown, _sender, sendResponse) => {
      const message = msg as Message;

      if (message.type === "FETCH_FAVICON") {
        fetchFaviconAsDataUri(message.url).then((dataUri) => {
          sendResponse({ dataUri });
        });
        return true; // keep channel open for async response
      }

      if (message.type === "GET_ACTIVE_TAB_URL") {
        browser.tabs
          .query({ active: true, currentWindow: true })
          .then((tabs) => {
            sendResponse({ url: tabs[0]?.url ?? null });
          });
        return true;
      }
    },
  );
});

async function fetchFaviconAsDataUri(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const buffer = await response.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    const base64 = btoa(binary);
    const mime = response.headers.get("content-type") ?? "image/png";
    return `data:${mime};base64,${base64}`;
  } catch {
    return null;
  }
}
