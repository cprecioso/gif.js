// @ts-check

import ts from "@wessberg/rollup-plugin-ts"
import { terser } from "rollup-plugin-terser"

export default /** @type {import("rollup").RollupOptions} */ ({
  input: "src/index.ts",
  output: { file: "dist/gif.worker.js", format: "iife", sourcemap: true },
  plugins: [ts({ typescript: require("typescript") }), terser()],
})
