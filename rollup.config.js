import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import importJson from "@rollup/plugin-json";
import { terser } from "rollup-plugin-terser";

const devMode = process.env.NODE_ENV === "development";
console.log(`${devMode ? "development" : "production"} mode bundle`);

const pluginName = "SeedsEsrUtil";
const input = "./src/main.js";
const plugins = [nodeResolve(), commonjs(), terser(), importJson()];
const getOutput = ({
  format,
  extension = "js",
  fileName = "main",
  buildDir = "dist",
  name,
}) => ({
  file: `./${buildDir}/${fileName}.${format}.${extension}`,
  format,
  sourcemap: devMode ? "inline" : false,
  name,
  plugins: [
    terser({
      ecma: 2020,
      mangle: { toplevel: true },
      compress: {
        module: true,
        toplevel: true,
        unsafe_arrows: true,
        drop_console: !devMode,
        drop_debugger: !devMode,
      },
      output: { quote_style: 1 },
    }),
  ],
});

export default [
  // ES bundle
  {
    input,
    plugins,
    output: getOutput({ format: "es" }),
  },
  // IIFE bundle
  {
    input,
    plugins,
    output: getOutput({ format: "iife" }),
  },
  // UMD bundle
  {
    input,
    plugins,
    output: getOutput({ format: "umd", name: pluginName }),
  },
  // CommonJS bundle
  {
    input,
    plugins,
    output: getOutput({ format: "cjs", extension: "cjs" }),
  },
  // AMD bundle
  {
    input,
    plugins,
    output: getOutput({ format: "amd" }),
  },
];
