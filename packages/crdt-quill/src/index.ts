import "./index.css";
import quill, { getRandomId, updateCursor, Sources, getCursorColor } from "./quill";
import client from "./client";
import Delta from "quill-delta";
import QuillCursors from "quill-cursors";
import { compareRelativePositions, createRelativePositionFromTypeIndex } from "yjs";

const userId = getRandomId();
const doc = client.doc;
const type = client.type;
const cursors = quill.getModule("cursors") as QuillCursors;
const awareness = client.awareness;

// Local awareness user information
awareness.setLocalStateField("user", {
  name: "User: " + userId,
  color: getCursorColor(userId),
});

// Page user information
const userNode = document.getElementById("user") as HTMLInputElement;
userNode && (userNode.value = "User: " + userId);

type.observe(event => {
  // Source Tag // Remote `UpdateContents` should not trigger 'ApplyDelta'
  if (event.transaction.origin !== userId) {
    const delta = event.delta;
    // May be required to explicitly set attributes
    quill.updateContents(new Delta(delta), "api");
  }
});

quill.on("editor-change", (_: string, delta: Delta, state: Delta, origin: Sources) => {
  if (delta && delta.ops) {
    // Source Tag // Local `ApplyDelta` should not trigger `UpdateContents`
    if (origin !== "api") {
      doc.transact(() => {
        type.applyDelta(delta.ops);
      }, userId);
    }
  }

  const sel = quill.getSelection();
  const aw = awareness.getLocalState();
  // Lose focus
  if (sel === null) {
    if (awareness.getLocalState() !== null) {
      awareness.setLocalStateField("cursor", null);
    }
  } else {
    const anchor = createRelativePositionFromTypeIndex(type, sel.index);
    const head = createRelativePositionFromTypeIndex(type, sel.index + sel.length);
    if (
      !aw ||
      !aw.cursor ||
      !compareRelativePositions(anchor, aw.cursor.anchor) ||
      !compareRelativePositions(head, aw.cursor.head)
    ) {
      awareness.setLocalStateField("cursor", { anchor, head });
    }
  }
  // update all remote cursor locations
  awareness.getStates().forEach((aw, clientId) => {
    updateCursor(cursors, aw, clientId, doc, type);
  });
});

awareness.getStates().forEach((state, clientId) => {
  updateCursor(cursors, state, clientId, doc, type);
});
awareness.on(
  "change",
  ({ added, removed, updated }: { added: number[]; removed: number[]; updated: number[] }) => {
    const states = awareness.getStates();
    added.forEach(id => {
      const state = states.get(id);
      state && updateCursor(cursors, state, id, doc, type);
    });
    updated.forEach(id => {
      const state = states.get(id);
      state && updateCursor(cursors, state, id, doc, type);
    });
    removed.forEach(id => {
      cursors.removeCursor(id.toString());
    });
  }
);
