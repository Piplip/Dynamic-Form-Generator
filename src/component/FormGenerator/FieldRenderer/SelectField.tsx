import {FieldSchema} from "../../../interfaces";
import {useInputStyles} from "../../../hooks/useInputStyles.ts";

interface FieldRendererProps {
    field: FieldSchema;
    value: any;
    onChange: (value: any) => void;
    error?: string;
}

function SelectField({field, value, onChange, error}: FieldRendererProps) {
    const {
        containerStyle,
        labelStyle,
        finalInputStyle,
        helperTextStyle,
        errorTextStyle,
        label,
        name,
        disabled,
        readOnly,
        labelPlacement,
        placeholder,
        defaultValue,
        helperText
    } = useInputStyles(field, error);

    const {multiple} = field.selectLayout || {};

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (multiple) {
            const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
            onChange(selectedOptions);
        } else {
            onChange(e.target.value);
        }
    };

    return (
        <div style={containerStyle}>
            {label && labelPlacement !== 'inside' && labelPlacement !== 'hidden' && (
                <label htmlFor={name} style={labelStyle}>{label}</label>
            )}
            <select
                id={name}
                name={name}
                value={value ?? defaultValue ?? (multiple ? [] : '')}
                onChange={handleChange}
                style={finalInputStyle}
                disabled={disabled}
                multiple={multiple}
            >
                {placeholder && !multiple && <option value="">{placeholder}</option>}
                {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <span style={errorTextStyle}>{error}</span>}
            {!error && helperText && <span style={helperTextStyle}>{helperText}</span>}
        </div>
    );
}

export default SelectField;
