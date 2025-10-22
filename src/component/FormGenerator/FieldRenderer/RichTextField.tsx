import {FieldSchema, FormTheme} from "../../../interfaces";
import {CSSProperties, useRef} from "react";
import JoditEditor from "jodit-react";

interface FieldRendererProps {
    field: FieldSchema;
    value: any;
    onChange: (value: any) => void;
    error?: string;
    theme?: FormTheme;
}

function RichTextField({field, value, onChange, error, theme}: FieldRendererProps) {
    const editorRef = useRef(null);
    const {label, name, disabled, readOnly, richTextLayout} = field;
    const {toolbarConfig, height} = richTextLayout || {};

    const containerStyle: CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: theme?.layout?.gap || '4px',
        opacity: disabled ? 0.6 : 1,
        pointerEvents: disabled ? 'none' : 'auto',
    };

    const labelStyle: CSSProperties = {
        fontWeight: theme?.font?.weight || 500,
        fontSize: theme?.font?.size || '1rem',
        color: theme?.color?.labelColor || '#333',
    };

    const errorTextStyle: CSSProperties = {
        fontSize: theme?.font?.size || '0.75rem',
        color: theme?.color?.errorColor || 'red',
        marginTop: '4px',
    };

    const joditConfig = {
        readonly: disabled || readOnly,
        height: height || '200px',
        toolbarButtonSize: 'small',
        style: {
            backgroundColor: theme?.color?.inputBackground || 'transparent',
            color: theme?.color?.inputText || '#333',
            fontFamily: theme?.font?.family || 'inherit',
            fontSize: theme?.font?.size || '1rem',
            borderRadius: theme?.layout?.borderRadius || '4px',
            border: `1px solid ${theme?.color?.inputBorder || '#ccc'}`,
        },
        ...(toolbarConfig === 'simple' && {buttons: 'bold,italic,underline,strikethrough,|,ul,ol,|,link,cut,copy,paste'}),
        ...(toolbarConfig === 'full' && {buttons: 'bold,italic,underline,strikethrough,|,ul,ol,|,link,cut,copy,paste,|,font,fontsize,paragraph,align,|,undo,redo,|,source'}),
        // For 'custom', a more complex object would be needed here.
    };

    return (
        <div style={containerStyle}>
            {label && <label htmlFor={name} style={labelStyle}>{label}</label>}
            <JoditEditor
                ref={editorRef}
                value={value ?? field.defaultValue ?? ''}
                config={joditConfig}
                onBlur={newContent => onChange(newContent)}
            />
            {error && <span style={errorTextStyle}>{error}</span>}
        </div>
    );
}

export default RichTextField;