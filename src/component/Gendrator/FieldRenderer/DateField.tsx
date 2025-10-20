import {FieldSchema, FormTheme} from "../../../interfaces";
import {CSSProperties} from "react";

interface FieldRendererProps {
    field: FieldSchema;
    value: any;
    onChange: (value: any) => void;
    error?: string;
    style?: CSSProperties;
    labelPlacement?: 'top' | 'left' | 'inline';
    theme?: FormTheme;
}

function DateField({field, value, onChange, error, style, labelPlacement, theme}: FieldRendererProps) {
    const label = field.label || field.name;

    const dateStyle: CSSProperties = {
        ...style,
        backgroundColor: theme?.color?.background,
        color: theme?.color?.text,
        fontSize: theme?.font?.size,
        fontFamily: theme?.font?.family,
        fontWeight: theme?.font?.weight,
        fontStyle: theme?.font?.style,
        lineHeight: theme?.layout?.lineHeight,
        padding: theme?.layout?.padding,
        margin: theme?.layout?.margin,
        borderColor: theme?.border?.color,
        borderWidth: theme?.border?.width,
        borderStyle: theme?.border?.style,
    };

    return (
        <div>
            <label>{label}</label>
            <input
                type="date"
                name={field.name}
                value={value ?? field.defaultValue ?? ''}
                onChange={(e) => onChange(e.target.value)}
                style={dateStyle}
            />
            {error && <span>{error}</span>}
        </div>
    );
}

export default DateField;