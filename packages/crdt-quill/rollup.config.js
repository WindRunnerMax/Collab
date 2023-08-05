import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import path from "path";
import postcss from "rollup-plugin-postcss";
import esbuild from "rollup-plugin-esbuild";
import html from "@rollup/plugin-html";
import replace from "@rollup/plugin-replace";

const template = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CRDT Quill</title>
</head>
<body>
    <input id="user" disabled>
    <div id="editor"></div>
    <script src="index.js"></script>
</body>
</html>`;

export default async () => {
  return {
    input: "src/index.ts",
    output: { dir: "./build/static", format: "iife" },
    plugins: [
      resolve({ browser: true, preferBuiltins: false }),
      commonjs({
        include: /node_modules/, // `monorepo regexp`
      }),
      replace({
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
        "preventAssignment": true,
      }),
      postcss({ minimize: true, extensions: [".css", ".scss"] }),
      esbuild({
        exclude: [/node_modules/],
        target: "esnext",
        minify: true,
        charset: "utf8",
        tsconfig: path.resolve(__dirname, "tsconfig.json"),
      }),
      html({
        template: () => template,
      }),
    ],
  };
};
