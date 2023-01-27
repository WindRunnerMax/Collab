import http from "http";
import express from "express";
import ShareDB from "sharedb";
import WebSocket from "ws";
import WebSocketJSONStream from "@teamwork/websocket-json-stream";
import richText from "rich-text";

ShareDB.types.register(richText.type);
const backend = new ShareDB({ presence: true, doNotForwardSendPresenceErrorsToClient: true });

// Create initial document then fire callback
function start(callback: () => void) {
  const connection = backend.connect();
  const doc = connection.get("ot-example", "quill");
  doc.fetch(err => {
    if (err) throw err;
    if (doc.type === null) {
      doc.create([{ insert: "OT Quill" }], "rich-text", callback);
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
