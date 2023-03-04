import ReconnectingWebSocket from "reconnecting-websocket";
import sharedb from "sharedb/lib/client";
import { Socket } from "sharedb/lib/sharedb";

export type ClientCallback = (num: number) => void;

class Connection {
  private connection: sharedb.Connection;

  constructor() {
    // Open WebSocket connection to ShareDB server
    const socket = new ReconnectingWebSocket("ws://localhost:3000");
    this.connection = new sharedb.Connection(socket as Socket);
  }

  bind(cb: ClientCallback) {
    // Create local Doc instance mapped to 'ot-example' collection document with id 'counter'
    // collectionName, documentID
    const doc = this.connection.get("ot-example", "counter");
    // Get initial value of document and subscribe to changes
    const onSubscribe = () => cb(doc.data.num);
    doc.subscribe(onSubscribe);
    // When document changes (by this client or any other, or the server),
    // update the number on the page
    const onOpExec = () => cb(doc.data.num);
    doc.on("op", onOpExec);
    return {
      // When clicking on the '+1' button, change the number in the local
      // document and sync the change to the server and other connected
      // clients
      increase: () => {
        // Increment `doc.data.num`. See
        // https://github.com/ottypes/json0 for list of valid operations.
        doc.submitOp([{ p: ["num"], na: 1 }]);
      },
      unbind: () => {
        doc.off("op", onOpExec);
        doc.unsubscribe(onSubscribe);
        doc.destroy();
      },
    };
  }

  destroy() {
    this.connection.close();
  }
}

export default new Connection();
