import {FieldSchema} from "../../../interfaces";
import {CSSProperties} from "react";

interface FieldRendererProps {
  field: FieldSchema;
  value: any;
  onChange: (value: any) => void;
  error?: string;
    style?: CSSProperties;
}

function InputField({field, value, onChange, error, style}: FieldRendererProps) {
  return (
      <div style={style}>
      <label>{field.label || field.name}</label>
      <input
        type={field.type}
        name={field.name}
        value={value ?? field.defaultValue ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
      />
      {error && <span>{error}</span>}
    </div>
  );
}

export default InputField;
