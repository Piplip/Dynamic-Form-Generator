import React from 'react';
import { FieldSchema } from '../../../interfaces';
import InputField from './InputField';
import SelectField from './SelectField';
import CheckboxField from './CheckboxField';
import DateField from './DateField';

interface GenericFieldRendererProps {
  field: FieldSchema;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}

const fieldComponentMap: Record<string, React.ComponentType<any>> = {
  text: InputField,
  email: InputField,
  number: InputField,
  select: SelectField,
  checkbox: CheckboxField,
  date: DateField,
};

function GenericFieldRenderer({ field, value, onChange, error }: GenericFieldRendererProps) {
  const Component = fieldComponentMap[field.type];

  if (!Component) {
    return <p>Unknown field type: {field.type}</p>;
  }

  return <Component field={field} value={value} onChange={onChange} error={error} style={field.style} />;
}

export default GenericFieldRenderer;
