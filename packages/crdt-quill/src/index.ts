import "./index.css";
import quill, { getCursorColor, getRandomId } from "./quill";
import client from "./client";
import type Delta from "quill-delta";

const presenceId = getRandomId();
const doc = client.doc;

const userNode = document.getElementById("user") as HTMLInputElement;
userNode && (userNode.value = "User: " + presenceId);

doc.subscribe(err => {
  if (err) {
    console.log("DOC SUBSCRIBE ERROR", err);
    return;
  }
  const cursors = quill.getModule("cursors");
  quill.setContents(doc.data);

  quill.on("text-change", (delta, oldDelta, source) => {
    if (source !== "user") return;
    doc.submitOp(delta);
  });

  doc.on("op", (op, source) => {
    if (source) return;
    quill.updateContents(op as unknown as Delta);
  });

  const presence = client.getDocPresence();
  presence.subscribe(error => {
    if (error) console.log("PRESENCE SUBSCRIBE ERROR", err);
  });
  const localPresence = presence.create(presenceId);

  quill.on("selection-change", (range, oldRange, source) => {
    // We only need to send updates if the user moves the cursor
    // themselves. Cursor updates as a result of text changes will
    // automatically be handled by the remote client.
    if (source !== "user") return;
    // Ignore blurring, so that we can see lots of users in the
    // same window. In real use, you may want to clear the cursor.
    if (!range) return;
    localPresence.submit(range, error => {
      if (error) console.log("LOCAL PRESENCE SUBSCRIBE ERROR", err);
    });
  });

  presence.on("receive", (id, range) => {
    const color = getCursorColor(id);
    const name = "User: " + id;
    cursors.createCursor(id, name, color);
    cursors.moveCursor(id, range);
  });
});
