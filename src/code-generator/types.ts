export interface GeneratedFile {
  fileName: string;
  content: string;
  language: "typescript" | "javascript" | "css" | "scss" | "json" | "html" | "vue" | "jsx" | "tsx";
}
