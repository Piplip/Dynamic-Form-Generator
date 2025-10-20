import { z } from 'zod';
import { FieldSchema } from '../interfaces';

export const createZodSchema = (fields: FieldSchema[]) => {
  const schema: Record<string, any> = {};

  fields.forEach(field => {
    let fieldValidator: z.ZodTypeAny;

    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
        fieldValidator = z.string();
        if (field.validation?.minLength) {
          fieldValidator = fieldValidator.min(field.validation.minLength, `Minimum length is ${field.validation.minLength}`);
        }
        if (field.validation?.required) {
          fieldValidator = fieldValidator.nonempty(`${field.label || field.name} is required`);
        }
        break;
      case 'select':
        fieldValidator = z.string();
        if (field.required) {
          fieldValidator = fieldValidator.nonempty(`${field.label || field.name} is required`);
        }
        break;
      case 'checkbox':
        fieldValidator = z.boolean();
        if (field.validation?.required) {
          fieldValidator = fieldValidator.refine(val => val === true, `${field.label || field.name} must be checked`);
        }
        break;
      default:
        fieldValidator = z.any();
    }
    schema[field.name] = fieldValidator;
  });

  return z.object(schema);
};

export const validateFormData = (fields: FieldSchema[], data: Record<string, any>) => {
  const zodSchema = createZodSchema(fields);
  try {
    zodSchema.parse(data);
    return {};
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach(err => {
        if (err.path.length > 0) {
          errors[err.path[0]] = err.message;
        }
      });
      return errors;
    }
    return { _general: 'An unknown validation error occurred' };
  }
};