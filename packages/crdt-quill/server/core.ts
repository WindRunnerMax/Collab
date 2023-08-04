import { exec } from "child_process";
import express from "express";

// https://github.com/yjs/y-websocket/blob/master/bin/server.js
exec("PORT=3001 npx y-websocket", (err, stdout, stderr) => {
  console.log(stdout, stderr);
});

const app = express();
app.use(express.static("build"));
app.use(express.static("node_modules/quill/dist"));

export default app;
