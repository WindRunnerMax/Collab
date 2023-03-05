import ReconnectingWebSocket from "reconnecting-websocket";
import sharedb from "sharedb/lib/client";
import { Socket } from "sharedb/lib/sharedb";
import richText from "rich-text";
import type Delta from "quill-delta";

const collection = "ot-example";
const id = "quill";

class Connection {
  public doc: sharedb.Doc<Delta>;
  private connection: sharedb.Connection;

  constructor() {
    sharedb.types.register(richText.type);
    // Open WebSocket connection to ShareDB server
    const socket = new ReconnectingWebSocket("ws://localhost:3000");
    this.connection = new sharedb.Connection(socket as Socket);
    this.doc = this.connection.get(collection, id);
  }

  getDocPresence() {
    return this.connection.getDocPresence(collection, id);
  }

  destroy() {
    this.doc.destroy();
    this.connection.close();
  }
}

export default new Connection();
