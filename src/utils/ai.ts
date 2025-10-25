import {GoogleGenerativeAI} from "@google/generative-ai";
import {FormSchema} from "../interfaces";
import {GenerationOptions} from "../code-generator";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Generates a JSON schema for a form based on a text description using the Gemini API.
 * Uses a response schema configuration to ensure reliable JSON output.
 * @param text The description of the form.
 * @returns A promise that resolves to the generated FormSchema object.
 */
export async function generateSchemaFromText(text: string): Promise<FormSchema> {
    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        config: {
            responseMimeType: "application/json",
            // Basic schema definition for a FormSchema
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    fields: {
                        type: Type.ARRAY,
                    }
                }
            }
        }
    });

    const prompt = `Generate a JSON schema for a form based on the following description. The JSON schema should be compatible with the following TypeScript interfaces:

interface FieldSchema {
    name: string;
    label?: string;
    type: 'text' | 'email' | 'number' | 'select' | 'checkbox' | 'date';
    options?: { label: string; value: string }[];
    min?: number;
    max?: number;
    validation?: {
        required?: boolean;
        minLength?: number;
        maxLength?: number;
        pattern?: string;
    };
    placeholder?: string;
    defaultValue?: any;
    style?: CSSProperties;
    grid?: {
        xs?: number;
        sm?: number;
        md?: number;
        lg?: number;
        xl?: number;
    };
    condition?: {
        field: string;
        operator: '==' | '!=' | '>' | '<' | '>=' | '<=' | 'includes' | '!includes';
        value: any;
    };
    api?: {
        url: string;
        method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
        headers?: Record<string, string>;
        responseMapping?: {
            label: string;
            value: string;
        };
    };
}

interface FormSchema {
    meta?: Record<string, any>;
    fields: FieldSchema[];
    layout?: {
        container?: boolean;
        spacing?: number;
    };
    style?: CSSProperties;
    api?: {
        url: string;
        method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
        headers?: Record<string, string>;
    };
}

Description: "${text}"

Return only the JSON schema object, without any other text or explanation.
`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const schemaText = response.text().trim();

    try {
        const schema = JSON.parse(schemaText);
        return schema as FormSchema;
    } catch (error) {
        console.error("Error parsing generated schema:", error);
        throw new Error("Failed to generate a valid JSON schema.");
    }
}

/**
 * Generates a React functional component code for a form based on a schema and options.
 * @param schema The FormSchema to build the form from.
 * @param options The GenerationOptions for the code.
 * @param lastErrors An array of errors from the previous generation attempt.
 * @returns A promise that resolves to the generated code string.
 */
export async function generateCodeWithAI(schema: FormSchema, options: GenerationOptions, lastErrors: string[] = []): Promise<string> {
    const model = genAI.getGenerativeModel({model: "gemini-2.5-flash"});

    let errorFeedback = "";
    if (lastErrors.length > 0) {
        errorFeedback = `\n\n**Previous Generation Errors:**\n\
${lastErrors.join("\n")}
\
**Please review the errors and regenerate the code, focusing on fixing these specific issues.**`;
    }

    const tsFewShotExample = `import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Define your Zod schema
const LoginFormSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
});

// Define your form data type
type LoginFormInputs = z.infer<typeof LoginFormSchema>;

interface LoginFormProps {
  onSubmit: (data: LoginFormInputs) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
    resolver: zodResolver(LoginFormSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 max-w-md mx-auto bg-white shadow-md rounded-lg">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          id="email"
          {...register("email")}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          id="password"
          {...register("password")}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Login
      </button>
    </form>
  );
};

export default LoginForm;
`;

    const jsFewShotExample = `import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Define your Zod schema
const LoginFormSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
});

// Define your form data type (using JSDoc for type hinting in JS)
/**
 * @typedef {z.infer<typeof LoginFormSchema>} LoginFormInputs
 */

/**
 * @param {object} props
 * @param {(data: LoginFormInputs) => void} props.onSubmit
 */
const LoginForm = ({ onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(LoginFormSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 max-w-md mx-auto bg-white shadow-md rounded-lg">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          id="email"
          {...register("email")}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          id="password"
          {...register("password")}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Login
      </button>
    </form>
  );
};

export default LoginForm;
`;

    const languageInstruction = options.language === "javascript"
        ? "Generate pure JavaScript (ES6+) code. Do NOT use TypeScript syntax (e.g., 'interface', 'type', type annotations, 'React.FC'). Use JSDoc for type hinting if necessary."
        : "Generate TypeScript code, including interfaces and type annotations.";

    const fewShotExample = options.language === "javascript" ? jsFewShotExample : tsFewShotExample;
    const codeBlockType = options.language === "javascript" ? "jsx" : "tsx";

    const prompt = `You are an expert React developer. Your task is to generate a complete, production-ready, responsive, and accessible React functional component for a form based on the provided JSON schema and generation options.

  **Instructions:**
  1.  Generate a single ${options.language === "javascript" ? "JavaScript (JSX)" : "TypeScript (TSX)"} file that exports a React functional component. The component name should be derived from the formName in the schema.
  2.  ${languageInstruction}
  3.  **Crucially, include all necessary imports at the top of the file, such as 'react', 'useForm' from 'react-hook-form', 'zodResolver' from '@hookform/resolvers/zod', and 'z' from 'zod'.**
  4.  Use the specified 'framework', 'uiLibrary', 'stateManagement', and 'validation' options. For example, if 'stateManagement' is 'react-hook-form' and 'validation' is 'zod', use 'react-hook-form' with 'zodResolver'.
  5.  Ensure all fields from the JSON schema are rendered correctly, applying appropriate HTML input types and UI library components.
  6.  Implement client-side validation using the specified validation library. Display validation errors clearly next to each field.
  7.  Handle form submission. If 'schema.api' is provided, implement an asynchronous submission to the specified API endpoint. Otherwise, provide a placeholder 'onSubmit' function.
  8.  Apply responsive styling using the specified 'uiLibrary'. If 'tailwind' is specified, use Tailwind CSS classes for layout and styling.
  9.  Ensure accessibility (ARIA attributes, proper labeling).
  10. Do NOT include any conversational text, explanations, or markdown wrappers outside the code block. Return ONLY the raw code.${errorFeedback}

  **JSON Schema:**
\`\`\`json
  ${JSON.stringify(schema, null, 2)}
\`\`\`

  **Generation Options:**
\`\`\`json
  ${JSON.stringify(options, null, 2)}
\`\`\`

  **Example (Login Form with selected Framework, UI Library, etc.):**
\`\`\`${codeBlockType}
${fewShotExample}
\`\`\`

  Please generate the code now:
  `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const code = response.text();

    // Explicitly remove markdown code block delimiters if present
    const match = code.match(new RegExp(`\`\`\`(?:${codeBlockType})?\s?([\s\S]*?)\n\`\`\``));
    if (match && match[1]) {
        return match[1];
    } else {
        return code; // Return as is if no markdown code block is found
    }
}

/**
 * Suggests optimal code generation options based on a text description.
 * Uses a response schema configuration to ensure reliable JSON output.
 * @param description The description to base the suggestions on.
 * @returns A promise that resolves to the suggested GenerationOptions object.
 */
export async function suggestGenerationOptions(description: string): Promise<GenerationOptions> {
    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        config: {
            responseMimeType: "application/json",
            // Fully defined schema for GenerationOptions
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    framework: { type: Type.STRING },
                    language: { type: Type.STRING, enum: ["typescript", "javascript"] },
                    uiLibrary: { type: Type.STRING },
                    stateManagement: { type: Type.STRING },
                    validation: { type: Type.STRING }
                },
                required: ["framework", "language", "uiLibrary", "stateManagement", "validation"]
            }
        }
    });

    const prompt = `Based on the following description, suggest optimal code generation options. Provide the output as a JSON object matching the GenerationOptions interface.

Description: "${description}"

GenerationOptions interface:
interface GenerationOptions {
  framework: string;
  language: \"typescript\" | \"javascript\";
  uiLibrary: string;
  stateManagement: string;
  validation: string;
}

Consider common best practices and sensible defaults. Return only the JSON object, without any other text or explanation.
`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const optionsText = response.text().trim();

    try {
        const options = JSON.parse(optionsText);
        return options as GenerationOptions;
    } catch (error) {
        console.error("Error parsing generated options:", error);
        throw new Error("Failed to suggest valid generation options.");
    }
}
