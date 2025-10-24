import { ValidatedFormSchema } from "../schemaValidator";
import { GenerationOptions } from "../index";
import { GeneratedFile } from "../types";
import { generateCodeWithAI } from "../../utils/ai";
import { validateGeneratedCode } from "../../utils/codeValidator";

const MAX_RETRIES = 3; // Define maximum retry attempts

export class ReactGenerator {
    static async generate(schema: ValidatedFormSchema, options: GenerationOptions): Promise<GeneratedFile[]> {
        const formName = schema.title ? schema.title.replace(/[^a-zA-Z0-9]/g, '') : "GeneratedForm";
        let currentCode = "";
        let retryCount = 0;
        let lastErrors: string[] = [];

        // Temporarily bypass validation and retry to see raw LLM output
        const aiGeneratedCode = await generateCodeWithAI(schema, options, lastErrors);
        currentCode = aiGeneratedCode;

        if (!currentCode) {
            throw new Error(`Failed to generate code.`);
        }

        const fileExtension = options.language === "typescript" ? "tsx" : "jsx";

        return [{
            fileName: `${formName}Form.${fileExtension}`,
            content: currentCode,
            language: options.language === "typescript" ? "tsx" : "jsx",
        }];
    }
}
