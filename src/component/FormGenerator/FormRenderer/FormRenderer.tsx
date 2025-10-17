import InputField from "../FieldRenderer/InputField";
import SelectField from "../FieldRenderer/SelectField";
import CheckboxField from "../FieldRenderer/CheckboxField";
import {Typography} from "@mui/material";
import {FieldSchema} from "../../../interfaces";

interface FormRendererProps {
    schema: FieldSchema[];
    formData: Record<string, any>;
    onFormChange: (data: Record<string, any>) => void;
    onValidate: (errors: Record<string, string>) => void;
}

function FormRenderer({schema, formData, onFormChange, onValidate}: FormRendererProps) {

    const handleSubmit = (e: React.FormEvent) => {

        e.preventDefault();

        // TODO: Add validation

    };


    if (!Array.isArray(schema)) {

        return <Typography color="error">Invalid schema: schema is not an array</Typography>;

    }


    if (schema.length === 0) {

        return <Typography>The form is empty. Please provide a schema.</Typography>;

    }


    return (

        <form onSubmit={handleSubmit}>

            {schema.map((field) => {

                const handleChange = (value: any) => {

                    onFormChange({...formData, [field.name]: value});

                };


                switch (field.type) {

                    case "text":

                    case "email":

                    case "number":

                        return <InputField key={field.name} field={field} value={formData[field.name]}
                                           onChange={handleChange}/>;

                    case "select":

                        if (!field.options || !Array.isArray(field.options) || !field.options.every(option => typeof option === 'object' && option.hasOwnProperty('label') && option.hasOwnProperty('value'))) {

                            return <Typography color="error">Invalid options for select
                                field: {field.name}</Typography>;

                        }

                        return <SelectField key={field.name} field={field} value={formData[field.name]}
                                            onChange={handleChange}/>;

                    case "checkbox":

                        return <CheckboxField key={field.name} field={field} value={formData[field.name]}
                                              onChange={handleChange}/>;

                    default:

                        return null;

                }

            })}

            <button type="submit">Submit</button>

        </form>

    );

}

export default FormRenderer;
