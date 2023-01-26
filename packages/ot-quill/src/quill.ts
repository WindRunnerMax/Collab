import Quill from "quill";
import QuillCursors from "quill-cursors";
import tinyColor from "tinycolor2";
Quill.register("modules/cursors", QuillCursors);

export default new Quill("#editor", {
  theme: "bubble",
  modules: { cursors: true },
});

const COLOR_MAP: Record<string, string> = {};

export const getRandomId = () => Math.floor(Math.random() * 10000).toString();

export const getCursorColor = (id: string) => {
  COLOR_MAP[id] = COLOR_MAP[id] || tinyColor.random().toHexString();
  return COLOR_MAP[id];
};
