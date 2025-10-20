import { FormSchema, FieldSchema } from "../interfaces";

abstract class CodeGenerator {
  abstract generate(schema: FormSchema): string;

  protected renderField(field: FieldSchema): string {
    throw new Error("renderField method not implemented");
  }
}

class ReactCodeGenerator extends CodeGenerator {
  generate(schema: FormSchema): string {
    const { fields, layout, style } = schema;

    const formFields = fields.map(field => {
      const gridProps = field.grid ? `xs={${field.grid.xs}} sm={${field.grid.sm}} md={${field.grid.md}} lg={${field.grid.lg}} xl={${field.grid.xl}}` : '';
      return `
      <Grid item ${gridProps}>
        ${this.renderField(field)}
      </Grid>
    `;
    }).join('\n');

    const formLayoutProps = layout ? `container spacing={${layout.spacing || 2}}` : '';
    const formStyleProp = style ? `style={${JSON.stringify(style)}}` : '';

    return `
import React from 'react';
import { TextField, Select, MenuItem, Checkbox, FormControlLabel, Button, Grid } from '@mui/material';

const MyGeneratedForm = () => {
  const [formData, setFormData] = React.useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    // Add validation logic here
  };

  return (
    <form onSubmit={handleSubmit} ${formStyleProp}>
      <Grid ${formLayoutProps}>
        ${formFields}
      </Grid>
      <Button type="submit" variant="contained" color="primary">Submit</Button>
    </form>
  );
};

export default MyGeneratedForm;
  `;
  }

  protected renderField(field: FieldSchema): string {
    const commonProps = `name="${field.name}" label="${field.label || field.name}"`;
    const validationProps = field.validation ? `validation={${JSON.stringify(field.validation)}}` : '';
    const placeholderProp = field.placeholder ? `placeholder="${field.placeholder}"` : '';
    const defaultValueProp = field.defaultValue !== undefined ? `defaultValue={${JSON.stringify(field.defaultValue)}}` : '';
    const requiredProp = field.validation?.required ? `required` : '';
    const styleProp = field.style ? `style={${JSON.stringify(field.style)}}` : '';

    switch (field.type) {
      case "text":
      case "email":
      case "number":
        return `<TextField ${commonProps} type="${field.type}" ${placeholderProp} ${defaultValueProp} ${requiredProp} ${validationProps} ${styleProp} />`;
      case "select":
        const options = field.options?.map(option => `<MenuItem value="${option.value}">${option.label}</MenuItem>`).join('\n');
        return `<Select ${commonProps} ${defaultValueProp} ${requiredProp} ${validationProps} ${styleProp}>
          ${options}
        </Select>`;
      case "checkbox":
        return `<FormControlLabel control={<Checkbox ${requiredProp} ${defaultValueProp} />} ${commonProps} ${styleProp} />`;
      case "date":
        return `<TextField ${commonProps} type="date" ${defaultValueProp} ${requiredProp} ${validationProps} ${styleProp} />`;
      case "file":
        return `<input type="file" name="${field.name}" />`;
      case "rich-text":
        return `<JoditEditor />`;
      default:
        return `// Unsupported field type: ${field.type}`;
    }
  }
}

export const generateCode = (schema: FormSchema, technology: "react" | "vue" | "angular"): string => {
  let generator: CodeGenerator;

  switch (technology) {
    case "react":
      generator = new ReactCodeGenerator();
      break;
    default:
      throw new Error(`Unsupported technology: ${technology}`);
  }

  return generator.generate(schema);
}