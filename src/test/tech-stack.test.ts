import { describe, it, expect } from "vitest";
import { techStack } from "../../tech-stack.js";

describe("tech stack", () => {
  it("includes core technologies", () => {
    expect(techStack).toEqual(
      expect.arrayContaining([
        "Vite",
        "React + TypeScript",
        "Tailwind + shadcn/ui",
        "Express",
        "Stripe",
        "OpenAI",
      ])
    );
  });

  it("does not contain empty entries", () => {
    expect(techStack.every((item) => typeof item === "string" && item.trim().length > 0)).toBe(
      true
    );
  });
});
