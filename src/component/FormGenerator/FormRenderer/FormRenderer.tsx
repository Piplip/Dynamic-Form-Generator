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
        return <p style={{color: 'red'}}>Invalid schema: schema is not an array</p>;
    }

    if (schema.fields.length === 0) {
        return <p>The form is empty. Please provide a schema.</p>;
    }

    // Check if any field has layout properties - if so, use grid layout
    const hasGridLayout = schema.fields.some(field =>
        field.layout &&
        (field.layout.row !== undefined || field.layout.col !== undefined)
    );

    const useGridLayout = schema.layout?.type === 'grid' || hasGridLayout;

    const renderFields = () => {
        return schema.fields.map((field) => {
            const handleChange = (value: any) => {
                onFormChange({...formData, [field.name]: value});
            };

            if (!checkCondition(field)) {
                return null;
            }

            const fieldElement = (
                <GenericFieldRenderer
                    key={field.name}
                    field={field}
                    value={formData[field.name]}
                    onChange={handleChange}
                    error={formErrors[field.name]}
                    layout={field.layout || schema.layout}
                    theme={schema.theme}
                />
            );

            if (useGridLayout) {
                return (
                    <div
                        key={field.name}
                        style={{
                            gridColumn: `${(field.layout?.col || 0) + 1} / span ${field.layout?.colSpan || 1}`,
                            gridRow: `${(field.layout?.row || 0) + 1} / span ${field.layout?.rowSpan || 1}`,
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        {fieldElement}
                    </div>
                );
            }

            return fieldElement;
        });
    };

    // Calculate grid dimensions based on field layouts
    const getGridDimensions = () => {
        if (schema.layout?.columns && schema.layout?.rows) {
            return {
                columns: schema.layout.columns,
                rows: schema.layout.rows
            };
        }

        // Calculate from field positions
        let maxCol = 0;
        let maxRow = 0;

        schema.fields.forEach(field => {
            if (field.layout) {
                const endCol = (field.layout.col || 0) + (field.layout.colSpan || 1);
                const endRow = (field.layout.row || 0) + (field.layout.rowSpan || 1);
                maxCol = Math.max(maxCol, endCol);
                maxRow = Math.max(maxRow, endRow);
            }
        });

        return {
            columns: Math.max(maxCol, schema.layout?.columns || 12),
            rows: Math.max(maxRow, schema.layout?.rows || 10)
        };
    };

    const gridDimensions = getGridDimensions();

    const formStyle = {
        ...schema.style,
        padding: schema.theme?.layout?.padding,
        margin: schema.theme?.layout?.margin,
        backgroundColor: schema.theme?.color?.background,
        color: schema.theme?.color?.text,
        fontFamily: schema.theme?.font?.family,
        fontSize: schema.theme?.font?.size,
        fontStyle: schema.theme?.font?.style,
        fontWeight: schema.theme?.font?.weight,
        lineHeight: schema.theme?.layout?.lineHeight,
    };

    return (
        <form onSubmit={handleSubmit} style={formStyle}>
            {schema.title && <h1>{schema.title}</h1>}
            {useGridLayout ? (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${gridDimensions.columns}, 1fr)`,
                    gridTemplateRows: `repeat(${gridDimensions.rows}, auto)`,
                    gap: `${schema.layout?.spacing || 8}px`,
                    width: '100%'
                }}>
                    {renderFields()}
                </div>
            ) : (
                <div style={{display: 'flex', flexDirection: 'column', gap: `${schema.layout?.spacing || 8}px`}}>
                    {renderFields()}
                </div>
            )}
        </form>
    );
}

export default FormRenderer;
