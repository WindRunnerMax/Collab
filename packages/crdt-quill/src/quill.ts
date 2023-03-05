import Quill from "quill";
import QuillCursors from "quill-cursors";
import tinyColor from "tinycolor2";
import { Awareness } from "y-protocols/awareness.js";
import {
  Doc,
  Text as YText,
  createAbsolutePositionFromRelativePosition,
  createRelativePositionFromJSON,
} from "yjs";
export type { Sources } from "quill";

Quill.register("modules/cursors", QuillCursors);

export default new Quill("#editor", {
  theme: "snow",
  modules: { cursors: true },
});

const COLOR_MAP: Record<string, string> = {};

export const getRandomId = () => Math.floor(Math.random() * 10000).toString();

export const getCursorColor = (id: string) => {
  COLOR_MAP[id] = COLOR_MAP[id] || tinyColor.random().toHexString();
  return COLOR_MAP[id];
};

export const updateCursor = (
  cursor: QuillCursors,
  state: Awareness["states"] extends Map<number, infer I> ? I : never,
  clientId: number,
  doc: Doc,
  type: YText
) => {
  try {
    if (state && state.cursor && clientId !== doc.clientID) {
      const user = state.user || {};
      const color = user.color || "#aaa";
      const name = user.name || `User: ${clientId}`;
      cursor.createCursor(clientId.toString(), name, color);
      const anchor = createAbsolutePositionFromRelativePosition(
        createRelativePositionFromJSON(state.cursor.anchor),
        doc
      );
      const head = createAbsolutePositionFromRelativePosition(
        createRelativePositionFromJSON(state.cursor.head),
        doc
      );
      if (anchor && head && anchor.type === type) {
        cursor.moveCursor(clientId.toString(), {
          index: anchor.index,
          length: head.index - anchor.index,
        });
      }
    } else {
      cursor.removeCursor(clientId.toString());
    }
  } catch (err) {
    console.error(err);
  }
};
