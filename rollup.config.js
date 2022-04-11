import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import importJson from "@rollup/plugin-json";
import inject from "@rollup/plugin-inject";
import nodePolyfills from "rollup-plugin-polyfill-node";
import { terser } from "rollup-plugin-terser";

const devMode = process.env.NODE_ENV === "development";
console.log(`${devMode ? "development" : "production"} mode bundle`);

const pluginName = "SeedsEsrUtil";
const input = "./src/main.js";
const plugins = [
  inject({
    fetch: ["node-fetch", "fetch"],
    util: ["util", "*"],
    zlib: ["zlib", "*"],
    Buffer: ["buffer", "Buffer"],
  }),
  nodePolyfills(),
  nodeResolve({ preferBuiltins: false }),
  terser(),
  importJson(),
];
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
    external: ["eosio-signing-request", "eosjs"],
    input,
    plugins,
    output: getOutput({ format: "es" }),
  },
  // IIFE bundle
  // {
  //   input,
  //   plugins,
  //   output: getOutput({ format: "iife" }),
  // },
  // UMD bundle
  // {
  //   input,
  //   plugins,
  //   output: getOutput({ format: "umd", name: pluginName }),
  // },
  // CommonJS bundle
  // {
  //   input,
  //   plugins,
  //   output: getOutput({ format: "cjs" }),
  // },
  // AMD bundle
  // {
  //   input,
  //   plugins,
  //   output: getOutput({ format: "amd" }),
  // },
];
