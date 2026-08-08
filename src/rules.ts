export interface Rule {
  pattern: string;
  color: string;
}

/**
 * Returns the color of the most-specific matching rule for the given URL,
 * or null if no rule matches.
 *
 * Matching: a rule's pattern must equal or be a path-segment prefix of
 * `${hostname}${pathname}`. Longer pattern = higher specificity.
 */
export function matchRule(rules: Rule[], url: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  const candidate = parsed.hostname + parsed.pathname.replace(/\/$/, "");

  let best: Rule | null = null;
  for (const rule of rules) {
    const pat = rule.pattern.replace(/\/$/, "");
    if (candidate === pat || candidate.startsWith(pat + "/")) {
      if (!best || rule.pattern.length > best.pattern.length) {
        best = rule;
      }
    }
  }

  return best ? best.color : null;
}
