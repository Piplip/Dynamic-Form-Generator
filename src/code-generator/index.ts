import { FormSchema } from "../../interfaces";
import { validateSchema } from "./schemaValidator";
import { GeneratedFile } from "./types";
import { ReactGenerator } from "./frameworks/react";

export interface GenerationOptions {
  framework: string;
  language: "typescript" | "javascript";
  uiLibrary: string;
  stateManagement: string;
  validation: string;
}

export async function generateCode(rawSchema: any, options: GenerationOptions): Promise<GeneratedFile[]> {
  // 1. Validate the input schema
  const validatedSchema = validateSchema(rawSchema);

  // 2. Delegate to framework-specific generator (now always AI-driven)
  let generatedFiles: GeneratedFile[] = [];

  switch (options.framework) {
    case "react":
      generatedFiles = await ReactGenerator.generate(validatedSchema, options);
      break;
    case "vue":
      // For Vue, we would also call generateCodeWithAI or a Vue-specific AI generator
      throw new Error("Vue generation not yet implemented with AI.");
    // Add other frameworks here
    default:
      throw new Error(`Unsupported framework: ${options.framework}`);
  }

  return generatedFiles;
}