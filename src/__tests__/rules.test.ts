import { describe, it, expect } from "vitest";
import { matchRule, type Rule } from "../rules";

describe("matchRule", () => {
  it("returns null for empty rules", () => {
    expect(matchRule([], "https://github.com/myorg/repo")).toBeNull();
  });

  it("matches exact domain", () => {
    const rules: Rule[] = [{ pattern: "github.com", color: "#f28b82" }];
    expect(matchRule(rules, "https://github.com")).toBe("#f28b82");
  });

  it("matches domain with trailing slash in URL", () => {
    const rules: Rule[] = [{ pattern: "github.com", color: "#f28b82" }];
    expect(matchRule(rules, "https://github.com/")).toBe("#f28b82");
  });

  it("matches path prefix", () => {
    const rules: Rule[] = [{ pattern: "github.com/myorg", color: "#aecbfa" }];
    expect(matchRule(rules, "https://github.com/myorg/repo")).toBe("#aecbfa");
  });

  it("does not match partial path segment (github.com/my must not match github.com/myorg)", () => {
    const rules: Rule[] = [{ pattern: "github.com/my", color: "#aecbfa" }];
    expect(matchRule(rules, "https://github.com/myorg/repo")).toBeNull();
  });

  it("returns most specific (longest) match", () => {
    const rules: Rule[] = [
      { pattern: "github.com", color: "#f28b82" },
      { pattern: "github.com/myorg", color: "#aecbfa" },
    ];
    expect(matchRule(rules, "https://github.com/myorg/repo")).toBe("#aecbfa");
  });

  it("returns null when no rule matches", () => {
    const rules: Rule[] = [{ pattern: "gitlab.com", color: "#fbbc04" }];
    expect(matchRule(rules, "https://github.com/myorg")).toBeNull();
  });

  it("ignores query string and hash in matching", () => {
    const rules: Rule[] = [{ pattern: "github.com/myorg", color: "#aecbfa" }];
    expect(
      matchRule(rules, "https://github.com/myorg/repo?tab=issues#readme"),
    ).toBe("#aecbfa");
  });

  it("handles invalid URL gracefully", () => {
    const rules: Rule[] = [{ pattern: "github.com", color: "#f28b82" }];
    expect(matchRule(rules, "not-a-url")).toBeNull();
  });

  it("matches bare domain URL with deeper path", () => {
    const rules: Rule[] = [{ pattern: "github.com", color: "#f28b82" }];
    expect(matchRule(rules, "https://github.com/anything/deep/path")).toBe(
      "#f28b82",
    );
  });
});
