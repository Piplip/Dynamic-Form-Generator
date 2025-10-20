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

function CheckboxField({field, value, onChange, error, style, labelPlacement, theme}: FieldRendererProps) {
    const label = field.label || field.name;

    const checkboxStyle: CSSProperties = {
        ...style,
        accentColor: theme?.color?.primary,
        borderColor: theme?.border?.color,
        borderWidth: theme?.border?.width,
        borderStyle: theme?.border?.style,
    };

    return (
        <div>
            <label style={{
                fontSize: theme?.font?.size,
                fontFamily: theme?.font?.family,
                fontWeight: theme?.font?.weight,
                fontStyle: theme?.font?.style,
                lineHeight: theme?.layout?.lineHeight,
                color: theme?.color?.text,
            }}>
                <input
                    type="checkbox"
                    name={field.name}
                    checked={value ?? field.defaultValue ?? false}
                    onChange={(e) => onChange(e.target.checked)}
                    style={checkboxStyle}
                />
                {label}
            </label>
            {error && <span style={{color: 'red'}}>{error}</span>}
        </div>
    );
}

export default CheckboxField;