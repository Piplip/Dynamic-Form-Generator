import {FieldSchema} from "../../../interfaces";

interface FieldRendererProps {
    field: FieldSchema;
    value: any;
    onChange: (value: any) => void;
    error?: string;
}

function SelectField({field, value, onChange, error}: FieldRendererProps) {
    return (
        <div>
            <label>{field.label || field.name}</label>
            <select
                name={field.name}
                value={value ? value.value : ''}
                onChange={(e) => onChange(e.target.value)}
            >
                {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <span>{error}</span>}
        </div>
    );
}

export default SelectField;
