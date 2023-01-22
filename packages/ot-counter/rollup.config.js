import ts from "rollup-plugin-typescript2";
import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import path from "path";
import terser from "@rollup/plugin-terser";
import postcss from "rollup-plugin-postcss";

export default async () => {
  return {
    input: "src/index.tsx",
    output: {
      dir: "./build",
      format: "iife",
    },
    plugins: [
      resolve(),
      commonjs({ include: "node_modules/**" }),
      babel({
        exclude: "node_modules/**",
        presets: [["@babel/preset-env", { modules: false, targets: { chrome: 70 } }]],
        babelHelpers: "bundled",
      }),
      postcss({ minimize: true, extensions: [".css", ".scss"] }),
      ts({
        tsconfig: path.resolve(__dirname, "./tsconfig.json"),
        extensions: [".ts", ".tsx"],
      }),
      terser(),
    ],
  };
};
