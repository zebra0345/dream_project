import { ImageActions } from "@xeger/quill-image-actions";
import { ImageFormats } from "@xeger/quill-image-formats";
import { Quill } from "react-quill";

Quill.register("modules/imageActions", ImageActions);
Quill.register("modules/imageFormats", ImageFormats);

export const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image"],
    [{ align: [] }],
    ["clean"],
  ],
  imageActions: {},
  imageFormats: {},
};

export const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "align",
  "float",
  "tag", // 태그 포맷 추가
  "height",
  "width",
  "align",
  "float",
];

// export const handleChange = (content, delta, source, editor) => {
//   let text = editor.getText();
//   let regex = /#(\w+)/g;
//   let matches;
//   while ((matches = regex.exec(text)) !== null) {
//     editor.formatText(matches.index, matches[0].length, "tag", matches[0]);
//   }
// };
