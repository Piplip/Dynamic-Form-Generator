import { CSSProperties } from "react";
import { FieldSchema, FormTheme } from "../interfaces";

export function useInputStyles(field: FieldSchema, error?: string, theme?: FormTheme) {
    const { label, name, disabled, readOnly, inputLayout, selectLayout } = field;
    const layout = selectLayout || inputLayout;
    const { variant, size, fullWidth, labelPlacement, helperText } = layout || {};

    const containerStyle: CSSProperties = {
        display: 'flex',
        flexDirection: labelPlacement === 'left' ? 'row' : 'column',
        alignItems: labelPlacement === 'left' ? 'center' : 'stretch',
        gap: labelPlacement === 'left' ? '8px' : '4px',
        width: fullWidth ? '100%' : 'auto',
        opacity: disabled ? 0.6 : 1,
    };

    const labelStyle: CSSProperties = {
        fontWeight: theme?.font?.weight || 500,
        fontSize: theme?.font?.size || (size === 'small' ? '0.8rem' : (size === 'large' ? '1.1rem' : '1rem')),
        display: labelPlacement === 'hidden' ? 'none' : 'block',
        color: theme?.color?.labelColor || '#333',
        fontFamily: theme?.font?.family || 'inherit',
    };

    const baseInputStyle: CSSProperties = {
        fontFamily: theme?.font?.family || 'inherit',
        borderRadius: theme?.layout?.borderRadius || '4px',
        border: `1px solid ${theme?.color?.inputBorder || '#ccc'}`,
        padding: theme?.layout?.padding || (size === 'small' ? '6px 10px' : (size === 'large' ? '12px 16px' : '8px 12px')),
        fontSize: theme?.font?.size || (size === 'small' ? '0.9rem' : (size === 'large' ? '1.1rem' : '1rem')),
        width: fullWidth ? '100%' : 'auto',
        boxSizing: 'border-box',
        backgroundColor: theme?.color?.inputBackground || 'transparent',
        color: theme?.color?.inputText || '#333',
    };

    const variantStyles: Record<string, CSSProperties> = {
        outlined: {
            border: `1px solid ${error ? (theme?.color?.errorColor || 'red') : (theme?.color?.inputBorder || '#ccc')}`,
        },
        filled: {
            border: `1px solid ${error ? (theme?.color?.errorColor || 'red') : (theme?.color?.inputBackground || 'transparent')}`,
            backgroundColor: theme?.color?.inputBackground || '#f0f0f0',
        },
        standard: {
            border: 'none',
            borderBottom: `2px solid ${error ? (theme?.color?.errorColor || 'red') : (theme?.color?.inputBorder || '#ccc')}`,
            borderRadius: 0,
            paddingLeft: 0,
            paddingRight: 0,
            backgroundColor: theme?.color?.inputBackground || 'transparent',
        },
    };

    const finalInputStyle = {
        ...baseInputStyle,
        ...(variantStyles[variant || 'outlined'])
    };

    const helperTextStyle: CSSProperties = {
        fontSize: '0.75rem',
        color: theme?.color?.text || '#666',
        marginTop: '4px',
    };

    const errorTextStyle: CSSProperties = {
        fontSize: theme?.font?.size || '0.75rem',
        color: theme?.color?.errorColor || 'red',
        marginTop: '4px',
    };

    return {
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
        placeholder: field.placeholder,
        defaultValue: field.defaultValue,
        helperText,
    };
}
