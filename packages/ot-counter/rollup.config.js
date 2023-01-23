import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import path from "path";
import postcss from "rollup-plugin-postcss";
import esbuild from "rollup-plugin-esbuild";
import replacement from "rollup-plugin-module-replacement";

process.env.NODE_ENV === "production";
const banner = `var process = {
  env: { NODE_ENV: 'production' }
};`;

const root = path.resolve(__dirname);
export default async () => {
  return {
    input: "src/index.tsx",
    output: {
      dir: "./build",
      format: "iife",
      banner,
      globals: {
        "react": "React",
        "react-dom": "ReactDOM",
      },
    },
    plugins: [
      replacement({
        entries: [
          {
            find: "react/jsx-runtime",
            replacement: () => {
              return path.resolve(
                root,
                "node_modules/react/cjs/react-jsx-runtime.production.min.js"
              );
            }, // production react/jsx-runtime
          },
        ],
      }),
      resolve(),
      commonjs({
        include: /node_modules/, // `monorepo regexp`
      }),
      postcss({ minimize: true, extensions: [".css", ".scss"] }),
      esbuild({
        exclude: [/node_modules/],
        target: "esnext",
        minify: true,
        charset: "utf8",
        tsconfig: path.resolve(__dirname, "tsconfig.json"),
      }),
    ],
    external: ["react", "react-dom"],
  };
};
