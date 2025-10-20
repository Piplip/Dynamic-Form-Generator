import { GoogleGenerativeAI } from "@google/generative-ai";
import { FormSchema } from "../interfaces";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;
const genAI = new GoogleGenerativeAI(API_KEY);

export async function generateSchemaFromText(text: string): Promise<FormSchema> {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

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
        body?: Record<string, any>;
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
  const response = await result.response;
  const schemaText = response.text();

  try {
    const schema = JSON.parse(schemaText);
    return schema;
  } catch (error) {
    console.error("Error parsing generated schema:", error);
    throw new Error("Failed to generate a valid JSON schema.");
  }
}
