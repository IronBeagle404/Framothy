import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"], // dual output
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true, // wipe dist before build
  minify: false,
  target: "es2022",
});
