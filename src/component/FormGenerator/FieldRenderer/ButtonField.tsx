import {FieldSchema, FormTheme} from "../../../interfaces";
import {CSSProperties} from "react";

interface FieldRendererProps {
    field: FieldSchema;
    theme?: FormTheme;
}

function ButtonField({field, theme}: FieldRendererProps) {
    const {label, name, buttonType, loading, disabled, buttonLayout} = field;
    const {variant, size, fullWidth} = buttonLayout || {};

    const baseStyle: CSSProperties = {
        fontFamily: theme?.font?.family || 'inherit',
        fontWeight: theme?.font?.weight || 600,
        border: '1px solid transparent',
        borderRadius: theme?.layout?.borderRadius || '6px',
        cursor: 'pointer',
        transition: 'opacity 0.2s ease-in-out, background-color 0.2s ease-in-out',
        width: fullWidth ? '100%' : 'auto',
        boxSizing: 'border-box',
    };

    const sizeStyles: Record<string, CSSProperties> = {
        small: {
            fontSize: theme?.font?.size || '0.8rem',
            padding: theme?.layout?.padding || '6px 12px',
        },
        medium: {
            fontSize: theme?.font?.size || '1rem',
            padding: theme?.layout?.padding || '10px 20px',
        },
        large: {
            fontSize: theme?.font?.size || '1.2rem',
            padding: theme?.layout?.padding || '14px 28px',
        },
    };

    const variantStyles: Record<string, CSSProperties> = {
        primary: {
            backgroundColor: theme?.button?.primary?.background || '#007bff',
            color: theme?.button?.primary?.text || 'white',
            border: `1px solid ${theme?.button?.primary?.background || '#007bff'}`,
        },
        secondary: {
            backgroundColor: theme?.button?.secondary?.background || 'transparent',
            color: theme?.button?.secondary?.text || '#007bff',
            border: theme?.button?.secondary?.border || `1px solid ${theme?.button?.secondary?.text || '#007bff'}`,
        },
        danger: {
            backgroundColor: theme?.button?.danger?.background || '#dc3545',
            color: theme?.button?.danger?.text || 'white',
            border: `1px solid ${theme?.button?.danger?.background || '#dc3545'}`,
        },
        ghost: {
            backgroundColor: theme?.button?.ghost?.background || 'transparent',
            color: theme?.button?.ghost?.text || '#007bff',
            border: theme?.button?.ghost?.border || '1px solid transparent',
        },
    };

    const finalStyle = {
        ...baseStyle,
        ...(sizeStyles[size || 'medium']),
        ...(variantStyles[variant || 'primary']),
    };

    if (disabled || loading) {
        finalStyle.opacity = 0.6;
        finalStyle.cursor = 'not-allowed';
    }

    return (
        <button
            type={buttonType}
            disabled={disabled || loading}
            style={finalStyle}
        >
            {loading ? 'Loading...' : (label || name)}
        </button>
    );
}

export default ButtonField;
