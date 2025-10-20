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

function FileUploadField({field, value, onChange, error, style, labelPlacement, theme}: FieldRendererProps) {
    const label = field.label || field.name;
    const preset = field.layout?.preset || 'button';
    const buttonText = field.layout?.buttonText || 'Upload File';

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            onChange(e.target.files[0]);
        }
    };

    const fileStyle: CSSProperties = {
        ...style,
        backgroundColor: theme?.color?.background,
        color: theme?.color?.text,
        fontSize: theme?.font?.size,
        fontFamily: theme?.font?.family,
        borderColor: theme?.border?.color,
        borderWidth: theme?.border?.width,
        borderStyle: theme?.border?.style,
    };

    const buttonStyle: CSSProperties = {
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

    if (preset === 'dropzone') {
        return (
            <div style={{...fileStyle, border: '2px dashed #ccc', padding: '20px', textAlign: 'center'}}>
                <input
                    type="file"
                    name={field.name}
                    onChange={handleFileChange}
                    style={{display: 'none'}}
                    id={field.name}
                />
                <label htmlFor={field.name}>
                    <p>Drag and drop a file here, or click to select a file</p>
                    {value && <p>Selected file: {value.name}</p>}
                    {error && <p style={{color: 'red'}}>{error}</p>}
                </label>
            </div>
        )
    }

    return (
        <div>
            <label>{label}</label>
            <button
                style={buttonStyle}
            >
                {buttonText}
                <input
                    type="file"
                    hidden
                    onChange={handleFileChange}
                />
            </button>
            {value && <span style={{marginLeft: '10px'}}>{value.name}</span>}
            {error && <span>{error}</span>}
        </div>
    );
}

export default FileUploadField;