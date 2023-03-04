import { Doc, Map as YMap } from "yjs";
import { WebrtcProvider } from "y-webrtc";

const getRandomId = () => Math.floor(Math.random() * 10000).toString();
export type ClientCallback = (record: Record<string, number>) => void;

class Connection {
  private doc: Doc;
  private map: YMap<number>;
  // Local unique id
  public id: string = getRandomId();
  // Local counter
  public counter = 0;

  constructor() {
    // Open WebSocket connection to Signaling server
    const doc = new Doc();
    new WebrtcProvider("crdt-example", doc, {
      password: "room-password",
      signaling: ["ws://localhost:3001"],
    });
    // Get Doc Map instance
    const yMapDoc = doc.getMap<number>("counter");
    this.doc = doc;
    this.map = yMapDoc;
  }

  bind(cb: ClientCallback) {
    this.map.observe(event => {
      // event.keysChanged -> the keys that have changed -> this.map.get(key)
      // event.changes.keys for-each -> change.action, change.oldValue, key
      // ...
      if (event.transaction.origin !== this) {
        const record = [...this.map.entries()].reduce(
          (cur, [key, value]) => ({ ...cur, [key]: value }),
          {} as Record<string, number>
        );
        cb(record);
      }
    });
  }

  public increase() {
    this.doc.transact(() => {
      this.map.set(this.id, ++this.counter);
    }, this);
  }
}

export default new Connection();
