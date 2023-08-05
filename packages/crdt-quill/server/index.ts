import { exec } from "child_process";
import express from "express";
import path from "path";

// https://github.com/yjs/y-websocket/blob/master/bin/server.js
exec("PORT=3001 npx y-websocket", (err, stdout, stderr) => {
  console.log(stdout, stderr);
});

const app = express();
console.log("first", path.join(__dirname, "static"));
app.use("/", express.static(path.join(__dirname, "static")));

app.listen(3000);
console.log("Listening on http://localhost:3000");
