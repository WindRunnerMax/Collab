import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import path from "path";
import postcss from "rollup-plugin-postcss";
import esbuild from "rollup-plugin-esbuild";
import replacement from "rollup-plugin-module-replacement";
import html from "@rollup/plugin-html";
import config from "@collab/config";

process.env.NODE_ENV === "production";
const banner = `var process = {
  env: { NODE_ENV: 'production' }
};`;

const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OT Counter</title>
</head>
<body>
    <div id="root"></div>
    <script src="${config.CDN.REACT}" type="application/javascript"></script>
    <script src="${config.CDN.REACT_DOM}" type="application/javascript"></script>
    <script src="index.js"></script>
</body>
</html>`;

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
    external: ["react", "react-dom"],
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
      resolve({ browser: true }),
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
      html({
        template: () => htmlTemplate,
      }),
    ],
  };
};
