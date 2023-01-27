declare module "@teamwork/websocket-json-stream" {
  import { Duplex } from "stream";
  import WebSocket from "ws";
  class WebSocketJSONStream extends Duplex {
    constructor(ws: WebSocket);
  }
  export default WebSocketJSONStream;
}
