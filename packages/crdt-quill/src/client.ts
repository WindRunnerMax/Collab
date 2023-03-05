import { Doc, Text as YText } from "yjs";
import { WebsocketProvider } from "y-websocket";

class Connection {
  public doc: Doc;
  public type: YText;
  private connection: WebsocketProvider;
  public awareness: WebsocketProvider["awareness"];

  constructor() {
    const doc = new Doc();
    const provider = new WebsocketProvider("ws://localhost:3001", "crdt-quill", doc);
    provider.on("status", (e: { status: string }) => {
      console.log("WebSocket Status", e.status);
    });
    this.doc = doc;
    this.type = doc.getText("quill");
    this.connection = provider;
    this.awareness = provider.awareness;
  }

  reconnect() {
    this.connection.connect();
  }

  disconnect() {
    this.connection.disconnect();
  }
}

export default new Connection();
