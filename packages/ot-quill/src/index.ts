import quill, { getCursorColor, getRandomId } from "./quill";
import client from "./client";

const presenceId = getRandomId();
const doc = client.doc;

doc.subscribe(err => {
  if (err) throw err;
  const cursors = quill.getModule("cursors");

  quill.setContents(doc.data);

  quill.on("text-change", (delta, oldDelta, source) => {
    if (source !== "user") return;
    doc.submitOp(delta);
  });

  doc.on("op", (op, source) => {
    if (source) return;
    quill.updateContents(op);
  });

  const presence = client.getDocPresence();
  presence.subscribe(error => {
    if (error) throw error;
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
    // In this particular instance, we can send extra information
    // on the presence object. This ability will vary depending on
    // type.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    range.name = nameInput.value;
    localPresence.submit(range, error => {
      if (error) throw error;
    });
  });

  presence.on("receive", (id, range) => {
    const color = getCursorColor(id);
    const name = (range && range.name) || "Anonymous";
    cursors.createCursor(id, name, color);
    cursors.moveCursor(id, range);
  });
});