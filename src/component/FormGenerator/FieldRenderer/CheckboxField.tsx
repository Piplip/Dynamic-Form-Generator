import { FieldSchema } from "../../../interfaces";

interface FieldRendererProps {
  field: FieldSchema;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}

function CheckboxField({ field, value, onChange, error }: FieldRendererProps) {
  return (
    <div>
      <label>
        <input
          type="checkbox"
          name={field.name}
          checked={value ?? false}
          onChange={(e) => onChange(e.target.checked)}
        />
        {field.label || field.name}
      </label>
      {error && <span>{error}</span>}
    </div>
  );
}

export default CheckboxField;
