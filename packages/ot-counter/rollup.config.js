import ts from "@rollup/plugin-typescript";
import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import path from "path";
import terser from "@rollup/plugin-terser";
import postcss from "rollup-plugin-postcss";

process.env.NODE_ENV === "production";
const banner = `var process = {
  env: { NODE_ENV: 'production' }
};`;

export default async () => {
  return {
    input: "src/index.tsx",
    output: {
      dir: "./build",
      format: "iife",
      globals: {
        "react": "React",
        "react-dom": "ReactDOM",
      },
      banner,
    },
    plugins: [
      resolve(),
      commonjs({
        include: /node_modules/, // `monorepo regexp`
      }),
      postcss({ minimize: true, extensions: [".css", ".scss"] }),
      babel({
        exclude: /node_modules/,
        babelHelpers: "bundled",
        presets: [
          ["@babel/preset-react"],
          ["@babel/preset-env", { modules: false, targets: { chrome: 70 } }],
        ],
      }),
      ts({
        tsconfig: path.resolve(__dirname, "./tsconfig.json"),
      }),
      terser(),
    ],
    external: ["react", "react-dom"],
  };
};
