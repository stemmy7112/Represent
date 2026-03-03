import { readFileSync } from "fs";
import path from "path";

describe("render blueprint", () => {
  const renderYaml = readFileSync(path.join(process.cwd(), "render.yaml"), "utf8");

  it("includes Supabase environment variables", () => {
    expect(renderYaml).toContain("key: VITE_SUPABASE_URL");
    expect(renderYaml).toContain("key: VITE_SUPABASE_PUBLISHABLE_KEY");
  });
});
