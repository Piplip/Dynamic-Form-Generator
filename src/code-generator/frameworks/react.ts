import { ValidatedFormSchema } from "../schemaValidator";
import { GenerationOptions } from "../index";
import { GeneratedFile } from "../types";

export class ReactGenerator {
    static async generate(schema: ValidatedFormSchema, options: GenerationOptions): Promise<GeneratedFile[]> {
        const files: GeneratedFile[] = [];

        const formName = schema.title ? schema.title.replace(/[^a-zA-Z0-9]/g, '') : "GeneratedForm";

        const transformedFields = schema.fields.map(field => {
            const baseField = {
                ...field,
                isText: field.type === 'text',
                isEmail: field.type === 'email',
                isNumber: field.type === 'number',
                isSelect: field.type === 'select',
                isCheckbox: field.type === 'checkbox',
                isDate: field.type === 'date',
                isFile: field.type === 'file',
                isRichText: field.type === 'rich-text',
                isButton: field.type === 'button',
                isTextarea: field.type === 'textarea',
            };

            // Ensure that validation messages fall back gracefully if schema properties are undefined
            const validationMessages = {
                required: field.validation?.requiredError || `${field.label || field.name} is required`,
                minLength: field.validation?.minLengthError || `Minimum length for ${field.label || field.name} is ${field.validation?.minLength || 'N/A'}`,
                maxLength: field.validation?.maxLengthError || `Maximum length for ${field.label || field.name} is ${field.validation?.maxLength || 'N/A'}`,
                pattern: field.validation?.patternError || `${field.label || field.name} does not match the required pattern`,
                min: field.validation?.minError || `Minimum value for ${field.label || field.name} is ${field.validation?.min || 'N/A'}`,
                max: field.validation?.maxError || `Maximum value for ${field.label || field.name} is ${field.validation?.max || 'N/A'}`,
            };

            return { ...baseField, validationMessages };
        });

        const data = {
            formName,
            schema,
            options,
            fields: transformedFields,
            submission: schema.api ? { url: schema.api.url, method: schema.api.method || "POST" } : undefined,
            hasApiSubmission: !!schema.api,
        };

        files.push({
            fileName: `${formName}Form.tsx`,
            content: this.generateReactForm(data),
            language: "tsx",
        });

        files.push({
            fileName: `${formName}types.ts`,
            content: this.generateReactTypes(data),
            language: "typescript",
        });

        files.push({
            fileName: `${formName}validation.ts`,
            content: this.generateReactValidation(data),
            language: "typescript",
        });

        return files;
    }

    private static generateReactForm(data: any): string {
        const { formName, fields, schema, hasApiSubmission, submission } = data;
        const formLayout = schema.layout;

        // Helper function to generate Tailwind CSS classes for column spans
        const getColSpanClass = (field: any) => {
            const colSpan = field.layout?.colSpan || 12;
            const colSpanXs = field.layout?.colSpanXs || colSpan;
            const colSpanSm = field.layout?.colSpanSm || colSpan;
            const colSpanMd = field.layout?.colSpanMd || colSpan;
            const colSpanLg = field.layout?.colSpanLg || colSpan;
            const colSpanXl = field.layout?.colSpanXl || colSpan;

            let classes = `col-span-${colSpanXs}`; // Start with xs/default
            if (colSpanSm) classes += ` sm:col-span-${colSpanSm}`;
            if (colSpanMd) classes += ` md:col-span-${colSpanMd}`;
            if (colSpanLg) classes += ` lg:col-span-${colSpanLg}`;
            if (colSpanXl) classes += ` xl:col-span-${colSpanXl}`;
            return classes;
        };

        const formFieldsJsx = fields.map((field: any) => {
            let inputJsx = '';
            let commonProps = `id=\"${field.name}\" {...register(\"${field.name}\")} className=\"p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full\"`;
            let errorJsx = `
        {errors.${field.name} && (
          <p className=\"text-red-500 text-sm mt-1\">{errors.${field.name}.message}</p>
        )}
      `;

            if (field.isText || field.isEmail || field.isDate) {
                inputJsx = `<input type=\"${field.type}\" ${commonProps} />`;
            } else if (field.isNumber) {
                // Use valueAsNumber in register for number types
                inputJsx = `<input type=\"number\" ${commonProps.replace(`{...register(\"${field.name}\")}`, '')} {...register(\"${field.name}\", { valueAsNumber: true })} />`;
            } else if (field.isSelect) {
                const optionsJsx = field.options.map((option: any) => `<option value=\"${option.value}\">${option.label}</option>`).join('\n');
                inputJsx = `
          <select ${commonProps}>
            <option value=\"\" disabled selected>${field.placeholder || 'Select an option'}</option>
            ${optionsJsx}
          </select>
        `;
            } else if (field.isCheckbox) {
                inputJsx = `
          <div className="flex items-center">
            <input type=\"checkbox\" id=\"${field.name}\" {...register(\"${field.name}\")} className=\"mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500\" />
            <label htmlFor=\"${field.name}\" className=\"font-medium\">${field.label}</label>
          </div>
        `;
                commonProps = ''; // Checkbox handles its own label and structure
                errorJsx = `
          {errors.${field.name} && (
            <p className=\"text-red-500 text-sm mt-1 col-span-12\">{errors.${field.name}.message}</p>
          )}
        `;
            } else if (field.isTextarea || field.isRichText) {
                inputJsx = `<textarea ${commonProps} rows=\"${field.textareaLayout?.rows || 5}\"></textarea>`;
            } else if (field.isButton) {
                inputJsx = `
          <button 
            type=\"${field.buttonType}\" 
            className=\"px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full disabled:bg-gray-400 disabled:cursor-not-allowed\" 
            ${field.loading ? 'disabled' : ''}
          >
            ${field.loading ? 'Loading...' : field.label}
          </button>
        `;
                commonProps = ''; // Button is self-contained
                errorJsx = ''; // Buttons don't typically have field errors
            } else if (field.isFile) {
                inputJsx = `<input type=\"file\" ${commonProps} />`;
            }

            // Special return structure for buttons
            if (field.isButton) {
                return `
          <div className=\"${getColSpanClass(field)}\">
            ${inputJsx}
          </div>
        `;
            }

            // Special structure for checkbox to avoid double label
            if (field.isCheckbox) {
                return `
          <div className=\"${getColSpanClass(field)}\">
            <div className=\"flex flex-col\">
              ${inputJsx}
              ${errorJsx}
            </div>
          </div>
        `;
            }

            // Standard input wrapper
            return `
        <div className=\"${getColSpanClass(field)}\">
          <div className=\"flex flex-col\">
            <label htmlFor=\"${field.name}\" className=\"mb-1 font-medium\">${field.label}</label>
            ${inputJsx}
            ${errorJsx}
          </div>
        </div>
      `;
        }).join('\n');

        const apiImports = hasApiSubmission ? `
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
` : '';

        const apiHook = hasApiSubmission ? `
  const queryClient = useQueryClient();
  const { mutate, isLoading, isError, isSuccess, error } = useMutation({
    mutationFn: async (data: ${formName}FormData) => {
      const response = await axios({
        url: "${submission.url}",
        method: "${submission.method}",
        data,
      });
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['${formName}Data'] });
      alert("Form submitted successfully!");
    },
    onError: (err: any) => {
      console.error(err);
      alert(\`Submission failed: \${err.response?.data?.message || err.message || "Unknown error"}\`);
    },
  });
` : '';

        const submitHandler = hasApiSubmission ? `handleSubmit((data) => mutate(data))` : `handleSubmit(onSubmit)`;
        const submitButtonDisabled = hasApiSubmission ? `disabled={isLoading}` : '';

        return `
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
${apiImports}

import { ${formName}Schema } from './${formName}validation';
import { ${formName}FormData } from './${formName}types';

interface ${formName}FormProps {
  onSubmit?: (data: ${formName}FormData) => void; // Made optional if using API submission
  defaultValues?: ${formName}FormData;
}

const ${formName}Form: React.FC<${formName}FormProps> = ({ onSubmit, defaultValues }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<${formName}FormData>({
    resolver: zodResolver(${formName}Schema),
    defaultValues,
  });
${apiHook}
  return (
    <form onSubmit={${submitHandler}} className="grid grid-cols-12 gap-${schema.layout?.spacing || 4} p-4 bg-white shadow-lg rounded-lg">
      ${formFieldsJsx}
      <button
        type="submit"
        className="col-span-12 px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
        ${submitButtonDisabled}
      >
        ${hasApiSubmission ? '{isLoading ? "Submitting..." : "Submit"}' : "Submit"}
      </button>
      ${hasApiSubmission ? `
        {isError && <p className="col-span-12 text-red-500 text-sm">Error submitting form. Check console for details.</p>}
        {isSuccess && <p className="col-span-12 text-green-500 text-sm">Form submitted successfully!</p>}
      ` : ''}
    </form>
  );
};

export default ${formName}Form;
    `;
    }

    private static generateReactTypes(data: any): string {
        const { formName, fields } = data;
        const typeDefinitions = fields.map((field: any) => {
            if (field.isButton) return '';
            let type = 'string';
            if (field.isNumber) type = 'number';
            if (field.isCheckbox) type = 'boolean';
            if (field.isFile) type = 'FileList | null';
            if (field.isDate) type = 'string | Date'; // Dates can be strings before transformation

            // For select/multi-select
            if (field.isSelect && field.selectLayout?.multiple) type = 'string[]';
            if (field.isSelect && !field.selectLayout?.multiple) type = 'string';

            return `  ${field.name}: ${type};\n`;
        }).join('');

        return `
export interface ${formName}FormData {
${typeDefinitions}}
`;
    }

    private static generateReactValidation(data: any): string {
        const { formName, fields } = data;
        const validationRules = fields.map((field: any) => {
            if (field.isButton) return '';

            let zodType = 'z.string()';
            if (field.isNumber) zodType = 'z.number()';
            if (field.isCheckbox) zodType = 'z.boolean()';
            if (field.isFile) zodType = 'z.any()'; // File validation is complex, often left as z.any() for react-hook-form
            if (field.isDate) zodType = 'z.string()'; // Validate as string first, then transform

            if (field.isNumber) {
                // If not required, number inputs can be NaN/null initially, so use z.union
                let rules = `z.union([z.literal(NaN), z.number()])`;
                if (field.validation?.required) {
                    rules = `z.number()`;
                }
            }

            let rules = zodType;

            if (field.isNumber) {
                // Numbers are tricky because empty input defaults to NaN in react-hook-form
                rules = `z.preprocess(
              (val) => (val === "" || val === null ? undefined : val),
              z.number({invalid_type_error: "Must be a number"})
          )`;

                if (field.validation?.required) {
                    rules = `z.preprocess(
                (val) => (val === "" ? undefined : val),
                z.number({required_error: "${field.validationMessages.required}", invalid_type_error: "Must be a number"})
             )`;
                } else {
                    rules += '.optional()';
                }

                if (field.validation?.min) {
                    rules += `.min(${field.validation.min}, \"${field.validationMessages.min}\")`;
                }
                if (field.validation?.max) {
                    rules += `.max(${field.validation.max}, \"${field.validationMessages.max}\")`;
                }

            } else if (field.isCheckbox) {
                rules = `z.boolean()`;
                if (field.validation?.required) {
                    rules += `.refine(val => val === true, \"${field.validationMessages.required}\")`;
                } else {
                    rules += '.optional()';
                }

            } else if (field.isFile) {
                rules = `z.any()`; // FileList
                if (field.validation?.required) {
                    rules += `.refine((files) => files?.length > 0, \"${field.validationMessages.required}\")`;
                } else {
                    rules += '.optional()';
                }

            } else {
                // String types (text, email, date, select, textarea)

                if (field.validation?.required) {
                    rules += `.min(1, \"${field.validationMessages.required}\")`;
                } else {
                    rules += `.optional()`;
                }

                if (field.validation?.minLength) {
                    rules += `.min(${field.validation.minLength}, \"${field.validationMessages.minLength}\")`;
                }
                if (field.validation?.maxLength) {
                    rules += `.max(${field.validation.maxLength}, \"${field.validationMessages.maxLength}\")`;
                }
                if (field.validation?.pattern) {
                    rules += `.regex(new RegExp(\`${field.validation.pattern}\`), \"${field.validationMessages.pattern}\")`;
                }
                if (field.isEmail) {
                    rules += `.email("Invalid email address")`;
                }
                if (field.isSelect && field.selectLayout?.multiple) {
                    rules = 'z.array(z.string())';
                    if (field.validation?.required) {
                        rules += `.min(1, \"${field.validationMessages.required}\")`;
                    } else {
                        rules += '.optional()';
                    }
                }
            }

            return `  ${field.name}: ${rules},\n`;
        }).join('');

        return `
import { z } from 'zod';

export const ${formName}Schema = z.object({
${validationRules}});
`;
    }
}
