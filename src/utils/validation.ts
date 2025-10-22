import { z } from 'zod';
import { FieldSchema } from '../interfaces';

export const createZodSchema = (fields: FieldSchema[]) => {
  const schema: Record<string, any> = {};

  fields.forEach(field => {
    let fieldValidator: z.ZodTypeAny;
    const label = field.label || field.name;

    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
      case 'textarea':
        fieldValidator = z.string();
        if (field.validation?.required) {
          fieldValidator = fieldValidator.nonempty(field.validation.requiredError || `${label} is required`);
        }
        if (field.validation?.minLength) {
          fieldValidator = fieldValidator.min(field.validation.minLength, field.validation.minLengthError || `Minimum length for ${label} is ${field.validation.minLength}`);
        }
        if (field.validation?.maxLength) {
          fieldValidator = fieldValidator.max(field.validation.maxLength, field.validation.maxLengthError || `Maximum length for ${label} is ${field.validation.maxLength}`);
        }
        if (field.validation?.pattern) {
          fieldValidator = fieldValidator.regex(new RegExp(field.validation.pattern), field.validation.patternError || `${label} does not match the required pattern`);
        }
        if (field.type === 'number') {
          fieldValidator = fieldValidator.transform(Number);
          if (field.validation?.min) {
            fieldValidator = fieldValidator.refine(val => val >= field.validation!.min!, field.validation.minError || `Minimum value for ${label} is ${field.validation.min}`);
          }
          if (field.validation?.max) {
            fieldValidator = fieldValidator.refine(val => val <= field.validation!.max!, field.validation.maxError || `Maximum value for ${label} is ${field.validation.max}`);
          }
        }
        break;
      case 'select':
        fieldValidator = z.string();
        if (field.validation?.required) {
          fieldValidator = fieldValidator.nonempty(field.validation.requiredError || `${label} is required`);
        }
        break;
      case 'checkbox':
        fieldValidator = z.boolean();
        if (field.validation?.required) {
          fieldValidator = fieldValidator.refine(val => val === true, field.validation.requiredError || `${label} must be checked`);
        }
        break;
      case 'file':
        fieldValidator = z.any(); // File validation is handled in the component
        if (field.validation?.required) {
          fieldValidator = fieldValidator.refine(val => val && val.length > 0, field.validation.requiredError || `${label} is required`);
        }
        break;
      case 'date':
        fieldValidator = z.string();
        if (field.validation?.required) {
          fieldValidator = fieldValidator.nonempty(field.validation.requiredError || `${label} is required`);
        }
        break;
      case 'rich-text':
        fieldValidator = z.string();
        if (field.validation?.required) {
          fieldValidator = fieldValidator.nonempty(field.validation.requiredError || `${label} is required`);
        }
        if (field.validation?.minLength) {
          fieldValidator = fieldValidator.min(field.validation.minLength, field.validation.minLengthError || `Minimum length for ${label} is ${field.validation.minLength}`);
        }
        if (field.validation?.maxLength) {
          fieldValidator = fieldValidator.max(field.validation.maxLength, field.validation.maxLengthError || `Maximum length for ${label} is ${field.validation.maxLength}`);
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