import { FormSchema } from "../interfaces";
import { GenerationOptions } from "../code-generator";

export function validateGeneratedCode(code: string, options: GenerationOptions, schema: FormSchema): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  let isValid = true;

  // Basic check for React import
  if (!/import React from 'react';/.test(code)) {
    errors.push("Missing React import.");
    isValid = false;
  }

  // Check for functional component structure (simple regex)
  const componentNameMatch = code.match(/(function\s+(\w+Form)\s*\(|const\s+(\w+Form)\s*:\s*React\.FC)/);
  if (!componentNameMatch) {
    errors.push("Could not find a React functional component definition.");
    isValid = false;
  }
  const componentName = componentNameMatch ? (componentNameMatch[2] || componentNameMatch[3]) : "";

  // Check for react-hook-form imports and usage if specified
  if (options.stateManagement === "react-hook-form") {
    if (!/import\s+\{\s*useForm\s*\}\s*from\s*'react-hook-form';/.test(code)) {
      errors.push("Missing useForm import from react-hook-form.");
      isValid = false;
    }
    if (!/useForm<\w+FormData>\s*\({/.test(code)) {
      errors.push("Missing useForm initialization.");
      isValid = false;
    }
  }

  // Check for zod imports and usage if specified
  if (options.validation === "zod") {
    if (!/import\s+\{\s*zodResolver\s*\}\s*from\s*'@hookform\/resolvers\/zod';/.test(code)) {
      errors.push("Missing zodResolver import from @hookform/resolvers/zod.");
      isValid = false;
    }
    if (!/import\s+\{\s*z\s*\}\s*from\s*'zod';/.test(code)) {
      errors.push("Missing z import from zod.");
      isValid = false;
    }
    if (!/resolver:\s*zodResolver\(\w+Schema\)/.test(code)) {
      errors.push("Missing zodResolver in useForm configuration.");
      isValid = false;
    }
  }

  // Check for form submission handler
  if (!/onSubmit={handleSubmit(onSubmit)}/.test(code) && !/onSubmit={handleSubmit\((data)\s*=>\s*mutate(data)}\)/.test(code)) {
    errors.push("Missing form submission handler (handleSubmit).");
    isValid = false;
  }

  // Check if all fields from the schema are rendered and have error display
  schema.fields.forEach(field => {
    if (field.type === "button") return; // Buttons don't have register or error messages in the same way

    // Check if field is rendered (simple check for input/select/textarea with its name)
    if (!new RegExp(`(id|name)=\"${field.name}\" `).test(code)) {
      errors.push(`Field '${field.name}' does not appear to be rendered.`);
      isValid = false;
    }

    // Check for register usage for the field
    if (options.stateManagement === "react-hook-form") {
      if (!new RegExp(`{\.\.\.register(\"${field.name}\",?`).test(code)) { // Fixed regex
        errors.push(`Field '${field.name}' is not registered with react-hook-form.`);
        isValid = false;
      }
    }

    // Check for error message display for the field
    if (!new RegExp(`{errors.${field.name}\s*&&\s*(`).test(code)) {
      errors.push(`Missing error message display for field '${field.name}'.`);
      isValid = false;
    }
  });

  return { isValid, errors };
}
