// Main orchestrator for code generation

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

  // 2. Delegate to framework-specific generator
  let generatedFiles: GeneratedFile[] = [];

  switch (options.framework) {
    case "react":
      generatedFiles = await ReactGenerator.generate(validatedSchema, options);
      break;
    case "vue":
      // generatedFiles = await VueGenerator.generate(validatedSchema, options);
      break;
    // Add other frameworks here
    default:
      throw new Error(`Unsupported framework: ${options.framework}`);
  }

  return generatedFiles;
}
