import {CSSProperties} from "react";
import {FieldSchema, FormTheme} from "../../../interfaces";
import InputField from "./InputField.tsx";
import SelectField from "./SelectField.tsx";
import DateField from "./DateField.tsx";
import CheckboxField from "./CheckboxField.tsx";
import FileUploadField from "./FileUploadField.tsx";
import RichTextField from "./RichTextField.tsx";
import ButtonField from "./ButtonField.tsx";

interface GenericFieldRendererProps {
    field: FieldSchema;
    value: any;
    onChange: (value: any) => void;
    error?: string;
    layout?: any;
    theme?: FormTheme;
}

import TextareaField from "./TextareaField.tsx";

function GenericFieldRenderer({field, value, onChange, error, layout, theme}: GenericFieldRendererProps) {
    const style: CSSProperties = {
        ...field.style,
        width: '100%',
        height: '100%',
        padding: theme?.layout?.padding,
        margin: theme?.layout?.margin,
    };

    const variant = field.layout?.variant || layout?.variant || 'outlined';
    const labelPlacement = field.layout?.labelPlacement || layout?.labelPlacement || 'top';

    const commonProps = {
        field,
        value,
        onChange,
        error,
        style,
        variant,
        labelPlacement,
        theme,
    };

    switch (field.type) {
        case 'text':
        case 'email':
        case 'number':
            return <InputField {...commonProps} />;
        case 'select':
            return <SelectField {...commonProps} />;
        case 'checkbox':
            return <CheckboxField {...commonProps} />;
        case 'date':
            return <DateField {...commonProps} />;
        case 'file':
            return <FileUploadField {...commonProps} />;
        case 'rich-text':
            return <RichTextField {...commonProps} />;
        case 'button':
            return <ButtonField {...commonProps} />;
        case 'textarea':
            return <TextareaField {...commonProps} />;
        default:
            return <div>Unknown field type: {field.type}</div>;
    }
}

export default GenericFieldRenderer;
