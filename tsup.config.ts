import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["cli/index.ts"],
	format: "cjs",
  outDir: "bin"
});
