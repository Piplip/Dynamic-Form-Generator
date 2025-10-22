import {FieldSchema} from "../../../interfaces";
import {useInputStyles} from "../../../hooks/useInputStyles.ts";

interface FieldRendererProps {
    field: FieldSchema;
    value: any;
    onChange: (value: any) => void;
    error?: string;
}

function DateField({field, value, onChange, error}: FieldRendererProps) {
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

    const {variant, minDate, maxDate} = field.datePickerLayout || {};

    const inputType = variant === 'datetime' ? 'datetime-local' : 'date';

    return (
        <div style={containerStyle}>
            {label && labelPlacement !== 'inside' && labelPlacement !== 'hidden' && (
                <label htmlFor={name} style={labelStyle}>{label}</label>
            )}
            <input
                id={name}
                type={inputType}
                name={name}
                value={value ?? defaultValue ?? ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder={labelPlacement === 'inside' ? label : placeholder}
                style={finalInputStyle}
                disabled={disabled}
                readOnly={readOnly}
                min={minDate}
                max={maxDate}
            />
            {error && <span style={errorTextStyle}>{error}</span>}
            {!error && helperText && <span style={helperTextStyle}>{helperText}</span>}
        </div>
    );
}

export default DateField;
