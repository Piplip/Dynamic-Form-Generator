import {FieldSchema, FormTheme} from "../../../interfaces";
import {CSSProperties} from "react";

interface FieldRendererProps {
    field: FieldSchema;
    value: any;
    onChange: (value: any) => void;
    error?: string;
    theme?: FormTheme;
}

function CheckboxField({field, value, onChange, error, theme}: FieldRendererProps) {
    const {label, name, disabled, checkboxLayout} = field;
    const {labelPlacement, size} = checkboxLayout || {};

    const containerStyle: CSSProperties = {
        display: 'flex',
        flexDirection: labelPlacement === 'left' ? 'row-reverse' : 'row',
        alignItems: 'center',
        gap: '8px',
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
    };

    const labelStyle: CSSProperties = {
        fontWeight: theme?.font?.weight || 500,
        fontSize: theme?.font?.size || (size === 'small' ? '0.8rem' : (size === 'large' ? '1.1rem' : '1rem')),
        color: theme?.color?.labelColor || '#333',
        cursor: disabled ? 'not-allowed' : 'pointer',
    };

    const inputStyle: CSSProperties = {
        width: size === 'small' ? '16px' : (size === 'large' ? '24px' : '20px'),
        height: size === 'small' ? '16px' : (size === 'large' ? '24px' : '20px'),
        cursor: disabled ? 'not-allowed' : 'pointer',
        // Native checkboxes are notoriously hard to style consistently across browsers with just CSS.
        // For custom styling, a custom checkbox component would be needed.
        // For now, we rely on browser defaults for the checkbox input itself.
    };

    const errorTextStyle: CSSProperties = {
        fontSize: theme?.font?.size || '0.75rem',
        color: theme?.color?.errorColor || 'red',
        marginTop: '4px',
    };

    return (
        <div style={containerStyle}>
            <input
                id={name}
                type="checkbox"
                name={name}
                checked={value ?? field.defaultValue ?? false}
                onChange={(e) => onChange(e.target.checked)}
                style={inputStyle}
                disabled={disabled}
            />
            {label && <label htmlFor={name} style={labelStyle}>{label}</label>}
            {error && <span style={errorTextStyle}>{error}</span>}
        </div>
    );
}

export default CheckboxField;