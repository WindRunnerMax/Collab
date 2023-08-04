import path from "path";
import esbuild from "rollup-plugin-esbuild";

export default async () => {
  return {
    input: {
      server: "server/index.ts",
      core: "server/core.ts",
    },
    output: {
      dir: "./build/",
      format: "cjs",
      exports: "auto",
    },
    external: [/.*/],
    plugins: [
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
