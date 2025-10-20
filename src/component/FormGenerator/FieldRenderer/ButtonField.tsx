import {FieldSchema, FormTheme} from "../../../interfaces";
import {CSSProperties} from "react";

interface FieldRendererProps {
    field: FieldSchema;
    style?: CSSProperties;
    theme?: FormTheme;
}

function ButtonField({field, style, theme}: FieldRendererProps) {
    const buttonStyle: CSSProperties = {
        ...style,
        backgroundColor: theme?.color?.primary,
        color: theme?.color?.text,
        padding: theme?.layout?.padding,
        margin: theme?.layout?.margin,
        fontSize: theme?.font?.size,
        fontFamily: theme?.font?.family,
        fontWeight: theme?.font?.weight,
        fontStyle: theme?.font?.style,
        lineHeight: theme?.layout?.lineHeight,
    };

    return (
        <div style={style}>
            <button
                type={field.buttonType}
                disabled={field.loading}
                style={buttonStyle}
            >
                {field.loading ? 'Loading...' : (field.label || field.name)}
            </button>
        </div>
    );
}

export default ButtonField;
