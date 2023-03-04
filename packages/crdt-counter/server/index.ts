import { exec } from "child_process";
import express from "express";

// https://github.com/yjs/y-webrtc/blob/master/bin/server.js
exec("PORT=3001 npx y-webrtc-signaling", (err, stdout, stderr) => {
  console.log(stdout, stderr);
});

const app = express();
app.use(express.static("build"));
app.listen(3000);
console.log("Listening on http://localhost:3000");
