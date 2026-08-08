import { PALETTE } from "../../src/palette";
import { getRules, setRules, upsertRule } from "../../src/storage";
import type { Rule } from "../../src/rules";

let selectedColor: string = PALETTE[0]!;

async function init() {
  renderFormPalette();
  await renderRules();
  document.getElementById("add-form")!.addEventListener("submit", onAdd);
}

function renderFormPalette() {
  const container = document.getElementById("form-palette")!;
  container.innerHTML = "";
  PALETTE.forEach((color) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "swatch" + (color === selectedColor ? " active" : "");
    btn.style.background = color;
    btn.title = color;
    btn.addEventListener("click", () => {
      selectedColor = color;
      renderFormPalette();
    });
    container.appendChild(btn);
  });
}

async function renderRules() {
  const rules = await getRules();
  const list = document.getElementById("rules-list")!;
  const empty = document.getElementById("empty")!;
  list.innerHTML = "";

  if (rules.length === 0) {
    empty.hidden = false;
    return;
  }

  empty.hidden = true;
  rules.forEach((rule) => {
    list.appendChild(makeRuleRow(rule, rules));
  });
}

function makeRuleRow(rule: Rule, allRules: Rule[]): HTMLElement {
  const row = document.createElement("div");
  row.className = "rule-row";

  const swatch = document.createElement("span");
  swatch.className = "rule-swatch";
  swatch.style.background = rule.color;

  const pattern = document.createElement("span");
  pattern.className = "rule-pattern";
  pattern.textContent = rule.pattern;

  const del = document.createElement("button");
  del.className = "rule-delete";
  del.textContent = "Delete";
  del.addEventListener("click", async () => {
    const updated = allRules.filter((r) => r.pattern !== rule.pattern);
    await setRules(updated);
    await renderRules();
  });

  row.appendChild(swatch);
  row.appendChild(pattern);
  row.appendChild(del);
  return row;
}

async function onAdd(e: Event) {
  e.preventDefault();
  const input = document.getElementById("pattern-input") as HTMLInputElement;
  const pattern = input.value.trim();
  if (!pattern) return;
  await upsertRule({ pattern, color: selectedColor });
  input.value = "";
  await renderRules();
}

init();
