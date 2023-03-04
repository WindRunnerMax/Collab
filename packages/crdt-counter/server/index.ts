import { exec } from "child_process";

// https://github.com/yjs/y-webrtc/blob/master/bin/server.js
exec("PORT=3001 npx y-webrtc-signaling", (err, stdout, stderr) => {
  console.log(stdout, stderr);
});
