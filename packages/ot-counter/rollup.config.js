import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import path from "path";
import postcss from "rollup-plugin-postcss";
import esbuild from "rollup-plugin-esbuild";

process.env.NODE_ENV === "production";
const banner = `var process = {
  env: { NODE_ENV: 'production' }
};`;

export default async () => {
  return {
    input: "src/index.tsx",
    output: {
      dir: "./build",
      format: "es",
      banner,
    },
    plugins: [
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
  };
};
