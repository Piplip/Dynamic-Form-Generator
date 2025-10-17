import {FieldSchema} from "../../../interfaces";
import {CSSProperties} from "react";

interface FieldRendererProps {
  field: FieldSchema;
  value: any;
  onChange: (value: any) => void;
  error?: string;
    style?: CSSProperties;
}

function CheckboxField({field, value, onChange, error, style}: FieldRendererProps) {
  return (
      <div style={style}>
      <label>
        <input
          type="checkbox"
          name={field.name}
          checked={value ?? field.defaultValue ?? false}
          onChange={(e) => onChange(e.target.checked)}
        />
        {field.label || field.name}
      </label>
      {error && <span>{error}</span>}
    </div>
  );
}

export default CheckboxField;
