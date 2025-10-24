import { z } from 'zod';
import { FormSchema } from '../interfaces';

// Define a Zod schema for the FormSchema interface
// This will be a simplified version for initial validation
// and will be expanded as needed.
const formSchemaZod = z.object({
  meta: z.record(z.string(), z.any()).optional(),
  title: z.string().optional(),
  layout: z.object({
    type: z.literal('grid').optional(),
    columns: z.number().optional(),
    rows: z.number().optional(),
    spacing: z.number().optional(),
    columnsXs: z.number().optional(),
    columnsSm: z.number().optional(),
    columnsMd: z.number().optional(),
    columnsLg: z.number().optional(),
    columnsXl: z.number().optional(),
  }).optional(),
  fields: z.array(z.object({
    name: z.string(),
    label: z.string().optional(),
    type: z.enum([
      'text', 'email', 'number', 'select', 'checkbox', 'date', 'file', 'rich-text', 'button', 'textarea'
    ]),
    // Add more validation for field properties as needed
  })),
  theme: z.any().optional(), // Detailed theme validation can be added later
  style: z.any().optional(), // Detailed style validation can be added later
  api: z.object({
    url: z.string(),
    method: z.enum(['GET', 'POST', 'PUT', 'DELETE']).optional(),
    headers: z.record(z.string(), z.string()).optional(),
    body: z.record(z.string(), z.any()).optional(),
  }).optional(),
});

export type ValidatedFormSchema = z.infer<typeof formSchemaZod>;

export function validateSchema(rawSchema: any): ValidatedFormSchema {
  try {
    return formSchemaZod.parse(rawSchema);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Schema validation failed:", error.errors);
      throw new Error(`Invalid Form Schema: ${error.errors.map(e => e.message).join(", ")}`);
    }
    throw new Error("Unknown schema validation error");
  }
}
