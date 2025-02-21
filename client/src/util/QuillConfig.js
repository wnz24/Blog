import Quill from "quill";
import "react-quill/dist/quill.snow.css";
import "quill-emoji/dist/quill-emoji.css";
import "quill-emoji";
import BlotFormatter from "quill-blot-formatter";

// Register Quill modules
Quill.register("modules/emoji", Quill.import("formats/emoji"));
Quill.register("modules/blotFormatter", BlotFormatter);

export const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    [{ font: [] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["blockquote", "code-block"],
    ["link", "image", "video"],
    ["emoji"], // Add Emoji Button
    ["clean"],
  ],
  "emoji-toolbar": true, // Enables emoji toolbar
  "emoji-textarea": false,
  "emoji-shortname": true,
  blotFormatter: {}, // Enables image resizing & formatting
};

export const formats = [
  "header",
  "font",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "list",
  "bullet",
  "align",
  "blockquote",
  "code-block",
  "link",
  "image",
  "video",
  "emoji",
];
