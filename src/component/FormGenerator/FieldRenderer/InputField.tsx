import { FieldSchema } from "../../../interfaces";

interface FieldRendererProps {
  field: FieldSchema;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}

function InputField({ field, value, onChange, error }: FieldRendererProps) {
  return (
    <div>
      <label>{field.label || field.name}</label>
      <input
        type={field.type}
        name={field.name}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <span>{error}</span>}
    </div>
  );
}

export default InputField;
