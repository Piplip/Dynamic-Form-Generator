import {FieldSchema, FormTheme} from "../../../interfaces";
import {CSSProperties} from "react";
import {TextField} from "@mui/material";

interface FieldRendererProps {
    field: FieldSchema;
    value: any;
    onChange: (value: any) => void;
    error?: string;
    style?: CSSProperties;
    variant?: 'outlined' | 'filled' | 'standard';
    labelPlacement?: 'top' | 'left' | 'inline';
    theme?: FormTheme;
}

function TextareaField({field, value, onChange, error, style, variant, labelPlacement, theme}: FieldRendererProps) {
    const label = field.label || field.name;
    const isInline = labelPlacement === 'inline';

    const textareaStyle: CSSProperties = {
        ...style,
        backgroundColor: theme?.color?.background,
        color: theme?.color?.text,
    };

    return (
        <TextField
            style={textareaStyle}
            multiline
            rows={4}
            name={field.name}
            label={isInline ? '' : label}
            value={value ?? field.defaultValue ?? ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            error={!!error}
            helperText={error}
            variant={variant}
            InputProps={{
                startAdornment: isInline ? <span style={{paddingRight: '10px'}}>{label}</span> : null,
            }}
        />
    );
}

export default TextareaField;
