import {FieldSchema} from "../../../interfaces";
import {CSSProperties} from "react";

interface FieldRendererProps {
    field: FieldSchema;
    value: any;
    onChange: (value: any) => void;
    error?: string;
    style?: CSSProperties;
}

function SelectField({field, value, onChange, error, style}: FieldRendererProps) {
    return (
        <div style={style}>
            <label>{field.label || field.name}</label>
            <select
                name={field.name}
                value={value ?? field.defaultValue ?? ''}
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
