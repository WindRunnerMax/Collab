import { Doc } from "yjs";
import { WebrtcProvider } from "y-webrtc";

const doc = new Doc();
export const connection = new WebrtcProvider("crdt-example", doc, {
  password: "room-password",
  signaling: ["ws://localhost:3000"],
});
export const yDocMap = doc.getMap("counter");
