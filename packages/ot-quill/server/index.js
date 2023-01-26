const http = require("http");
const express = require("express");
const ShareDB = require("sharedb");
const WebSocket = require("ws");
const WebSocketJSONStream = require("@teamwork/websocket-json-stream");
const richText = require("rich-text");

ShareDB.types.register(richText.type);
const backend = new ShareDB({ presence: true });

// Create initial document then fire callback
function start(callback) {
  const connection = backend.connect();
  const doc = connection.get("ot-example", "quill");
  doc.fetch(err => {
    if (err) throw err;
    if (doc.type === null) {
      doc.create([{ insert: "OT Quill" }], "quill", callback);
      return;
    }
    callback();
  });
}

function server() {
  // Create a web server to serve files and listen to WebSocket connections
  const app = express();
  app.use(express.static("build"));
  app.use(express.static("node_modules/quill/dist"));
  const server = http.createServer(app);

  // Connect any incoming WebSocket connection to ShareDB
  const wss = new WebSocket.Server({ server: server });
  wss.on("connection", function (ws) {
    const stream = new WebSocketJSONStream(ws);
    backend.listen(stream);
  });

  server.listen(3000);
  console.log("Listening on http://localhost:3000");
}

start(server);
