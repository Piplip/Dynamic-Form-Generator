import {FieldSchema, FormTheme} from "../../../interfaces";
import {CSSProperties, useRef} from "react";
import JoditEditor from "jodit-react";
import {FormHelperText} from "@mui/material";

interface FieldRendererProps {
    field: FieldSchema;
    value: any;
    onChange: (value: any) => void;
    error?: string;
    style?: CSSProperties;
    labelPlacement?: 'top' | 'left' | 'inline';
    theme?: FormTheme;
}

function RichTextField({field, value, onChange, error, style, labelPlacement, theme}: FieldRendererProps) {
    const editor = useRef(null);
    const label = field.label || field.name;
    const isInline = labelPlacement === 'inline';

    const richTextStyle: CSSProperties = {
        ...style,
        backgroundColor: theme?.color?.background,
        color: theme?.color?.text,
    };

    return (
        <div style={richTextStyle}>
            {isInline ? (
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <span style={{paddingRight: '10px'}}>{label}</span>
                    <JoditEditor
                        ref={editor}
                        value={value ?? field.defaultValue ?? ''}
                        onBlur={newContent => onChange(newContent)}
                    />
                </div>
            ) : (
                <>
                    <label>{label}</label>
                    <JoditEditor
                        ref={editor}
                        value={value ?? field.defaultValue ?? ''}
                        onBlur={newContent => onChange(newContent)}
                    />
                </>
            )}
            {error && <FormHelperText error>{error}</FormHelperText>}
        </div>
    );
}

export default RichTextField;