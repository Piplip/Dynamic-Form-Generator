import {Grid, Typography} from "@mui/material";
import {FormSchema, FieldSchema} from "../../../interfaces";
import {validateFormData} from "../../../utils/validation";
import GenericFieldRenderer from "../FieldRenderer";

interface FormRendererProps {
    schema: FormSchema;
    formData: Record<string, any>;
    onFormChange: (data: Record<string, any>) => void;
    onValidate: (errors: Record<string, string>) => void;
    formErrors: Record<string, string>;
}

function FormRenderer({schema, formData, onFormChange, onValidate, formErrors}: FormRendererProps) {

    const checkCondition = (field: FieldSchema): boolean => {
        if (!field.condition) {
            return true;
        }

        const {field: conditionField, operator, value: conditionValue} = field.condition;
        const fieldValue = formData[conditionField];

        switch (operator) {
            case '==':
                return fieldValue == conditionValue;
            case '!=':
                return fieldValue != conditionValue;
            case '>':
                return fieldValue > conditionValue;
            case '<':
                return fieldValue < conditionValue;
            case '>=':
                return fieldValue >= conditionValue;
            case '<=':
                return fieldValue <= conditionValue;
            case 'includes':
                return String(fieldValue).includes(String(conditionValue));
            case '!includes':
                return !String(fieldValue).includes(String(conditionValue));
            default:
                return true;
        }
    };

    const handleSubmit = (e: React.FormEvent) => {

        e.preventDefault();

        const errors = validateFormData(schema.fields, formData);
        onValidate(errors);

        if (Object.keys(errors).length === 0) {
            console.log('Form submitted successfully:', formData);
        }

    };


    if (!schema || !Array.isArray(schema.fields)) {

        return <Typography color="error">Invalid schema: schema is not an array</Typography>;

    }


    if (schema.fields.length === 0) {

        return <Typography>The form is empty. Please provide a schema.</Typography>;

    }


    return (

        <form onSubmit={handleSubmit} style={schema.style}>

            <Grid container {...schema.layout}>
                {schema.fields.map((field) => {

                    const handleChange = (value: any) => {

                        onFormChange({...formData, [field.name]: value});

                    };

                    if (!checkCondition(field)) {
                        return null;
                    }

                    return (
                        <Grid item xs={field.grid?.xs} sm={field.grid?.sm} md={field.grid?.md} lg={field.grid?.lg} xl={field.grid?.xl} key={field.name}>
                            <GenericFieldRenderer
                                field={field}
                                value={formData[field.name]}
                                onChange={handleChange}
                                error={formErrors[field.name]}
                            />
                        </Grid>
                    )

                })}
            </Grid>

            <button type="submit">Submit</button>

        </form>

    );

}

export default FormRenderer;
