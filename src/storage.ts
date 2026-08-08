import type { Rule } from "./rules";

const STORAGE_KEY = "rules";

export async function getRules(): Promise<Rule[]> {
  const result = await browser.storage.local.get(STORAGE_KEY);
  return (result[STORAGE_KEY] as Rule[]) ?? [];
}

export async function setRules(rules: Rule[]): Promise<void> {
  await browser.storage.local.set({ [STORAGE_KEY]: rules });
}

export async function upsertRule(rule: Rule): Promise<void> {
  const rules = await getRules();
  const idx = rules.findIndex((r) => r.pattern === rule.pattern);
  if (idx >= 0) {
    rules[idx] = rule;
  } else {
    rules.push(rule);
  }
  await setRules(rules);
}

export async function deleteRule(pattern: string): Promise<void> {
  const rules = await getRules();
  await setRules(rules.filter((r) => r.pattern !== pattern));
}
