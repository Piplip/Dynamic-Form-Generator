import {FieldSchema} from "../../../interfaces";
import InputField from "./InputField.tsx";
import DateField from "./DateField.tsx";
import CheckboxField from "./CheckboxField.tsx";
import FileUploadField from "./FileUploadField.tsx";
import RichTextField from "./RichTextField.tsx";
import ButtonField from "./ButtonField.tsx";
import TextareaField from "./TextareaField.tsx";
import SelectField from "./SelectField.tsx";

interface GenericFieldRendererProps {
    field: FieldSchema;
    value: any;
    onChange: (value: any) => void;
    error?: string;
}

function GenericFieldRenderer({field, value, onChange, error}: GenericFieldRendererProps) {
    const commonProps = {
        field,
        value,
        onChange,
        error,
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
