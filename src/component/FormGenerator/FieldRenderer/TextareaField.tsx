import {FieldSchema} from "../../../interfaces";
import {useInputStyles} from "../../../hooks/useInputStyles.ts";

interface FieldRendererProps {
    field: FieldSchema;
    value: any;
    onChange: (value: any) => void;
    error?: string;
}

function TextareaField({field, value, onChange, error}: FieldRendererProps) {
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

    const {rows, cols} = field.textareaLayout || {};

    return (
        <div style={containerStyle}>
            {label && labelPlacement !== 'inside' && labelPlacement !== 'hidden' && (
                <label htmlFor={name} style={labelStyle}>{label}</label>
            )}
            <textarea
                id={name}
                name={name}
                value={value ?? defaultValue ?? ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder={labelPlacement === 'inside' ? label : placeholder}
                style={finalInputStyle}
                disabled={disabled}
                readOnly={readOnly}
                rows={rows || 4} // Default to 4 rows if not specified
                cols={cols}
            />
            {error && <span style={errorTextStyle}>{error}</span>}
            {!error && helperText && <span style={helperTextStyle}>{helperText}</span>}
        </div>
    );
}

export default TextareaField;
