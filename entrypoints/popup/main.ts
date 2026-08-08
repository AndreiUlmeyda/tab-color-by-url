import { PALETTE } from "../../src/palette";
import { getRules, upsertRule, deleteRule } from "../../src/storage";
import { matchRule } from "../../src/rules";

async function init() {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  const url = tab?.url ?? "";

  const hostnameEl = document.getElementById("hostname")!;
  const paletteEl = document.getElementById("palette")!;
  const removeBtn = document.getElementById("remove") as HTMLButtonElement;
  const blockedEl = document.getElementById("blocked")!;

  const isInjectable =
    url.startsWith("http://") || url.startsWith("https://");

  if (!isInjectable) {
    hostnameEl.textContent = new URL(url).hostname || url;
    blockedEl.hidden = false;
    return;
  }

  const hostname = new URL(url).hostname;
  hostnameEl.textContent = hostname;

  const rules = await getRules();
  const activeColor = matchRule(rules, url);

  PALETTE.forEach((color) => {
    const swatch = document.createElement("button");
    swatch.className = "swatch" + (color === activeColor ? " active" : "");
    swatch.style.background = color;
    swatch.title = color;
    swatch.addEventListener("click", async () => {
      await upsertRule({ pattern: hostname, color });
      window.close();
    });
    paletteEl.appendChild(swatch);
  });

  if (activeColor) {
    removeBtn.hidden = false;
    removeBtn.addEventListener("click", async () => {
      await deleteRule(hostname);
      window.close();
    });
  }
}

init();
