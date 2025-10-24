import {FormSchema, FieldSchema} from "../../../interfaces";
import {validateFormData} from "../../../utils/validation";
import GenericFieldRenderer from "../FieldRenderer";
import {useMediaQuery, Breakpoint} from "../../../hooks/useMediaQuery";
import {useRef} from "react";

interface FormRendererProps {
    schema: FormSchema;
    formData: Record<string, any>;
    onFormChange: (data: Record<string, any>) => void;
    onValidate: (errors: Record<string, string>) => void;
    formErrors: Record<string, string>;
}

function FormRenderer({schema, formData, onFormChange, onValidate, formErrors}: FormRendererProps) {
    const formRef = useRef<HTMLFormElement>(null);
    const currentBreakpoint = useMediaQuery(formRef);

    const getResponsiveColSpan = (field: FieldSchema, breakpoint: Breakpoint): number => {
        const layout = field.layout;
        if (!layout) return 1; // Default colSpan

        switch (breakpoint) {
            case 'xl': return layout.colSpanXl ?? layout.colSpanLg ?? layout.colSpanMd ?? layout.colSpanSm ?? layout.colSpanXs ?? layout.colSpan ?? 1;
            case 'lg': return layout.colSpanLg ?? layout.colSpanMd ?? layout.colSpanSm ?? layout.colSpanXs ?? layout.colSpan ?? 1;
            case 'md': return layout.colSpanMd ?? layout.colSpanSm ?? layout.colSpanXs ?? layout.colSpan ?? 1;
            case 'sm': return layout.colSpanSm ?? layout.colSpanXs ?? layout.colSpan ?? 1;
            case 'xs': return layout.colSpanXs ?? layout.colSpan ?? 1;
            default: return layout.colSpan ?? 1;
        }
    };

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

            const fieldColSpan = getResponsiveColSpan(field, currentBreakpoint);

            const fieldElement = (
                <GenericFieldRenderer
                    key={field.name}
                    field={field}
                    value={formData[field.name]}
                    onChange={handleChange}
                    error={formErrors[field.name]}
                    theme={schema.theme}
                />
            );

            if (useGridLayout) {
                const startCol = (fieldColSpan === gridDimensions.columns) ? 1 : (field.layout?.col || 0) + 1;
                return (
                    <div
                        key={field.name}
                        style={{
                            gridColumn: `${startCol} / span ${fieldColSpan}`,
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
        const baseColumns = schema.layout?.columns || 12;
        let responsiveColumns = baseColumns;

        switch (currentBreakpoint) {
            case 'xl': responsiveColumns = schema.layout?.columnsXl ?? schema.layout?.columnsLg ?? schema.layout?.columnsMd ?? schema.layout?.columnsSm ?? schema.layout?.columnsXs ?? baseColumns;
                break;
            case 'lg': responsiveColumns = schema.layout?.columnsLg ?? schema.layout?.columnsMd ?? schema.layout?.columnsSm ?? schema.layout?.columnsXs ?? baseColumns;
                break;
            case 'md': responsiveColumns = schema.layout?.columnsMd ?? schema.layout?.columnsSm ?? schema.layout?.columnsXs ?? baseColumns;
                break;
            case 'sm': responsiveColumns = schema.layout?.columnsSm ?? schema.layout?.columnsXs ?? baseColumns;
                break;
            case 'xs': responsiveColumns = schema.layout?.columnsXs ?? baseColumns;
                break;
        }

        return {
            columns: responsiveColumns,
            rows: schema.layout?.rows || 10 // Rows are not responsive in this implementation
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
        <form onSubmit={handleSubmit} style={formStyle} ref={formRef}>
            {schema.title && <h1 style={{
                fontSize: schema.theme?.title?.fontSize,
                fontWeight: schema.theme?.title?.fontWeight,
                color: schema.theme?.title?.color,
                textAlign: schema.theme?.title?.textAlign,
                marginTop: schema.theme?.title?.marginTop,
                marginBottom: schema.theme?.title?.marginBottom,
                paddingTop: schema.theme?.title?.paddingTop,
                paddingBottom: schema.theme?.title?.paddingBottom,
            }}>{schema.title}</h1>}
            {useGridLayout ? (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${gridDimensions.columns}, 1fr)`,
                    gridTemplateRows: `repeat(${gridDimensions.rows}, auto)`,
                    gap: `${schema.theme?.layout?.gap || 8}px`, // Use theme gap or a default small gap
                    width: '100%'
                }}>
                    {renderFields()}
                </div>
            ) : (
                <div style={{display: 'flex', flexDirection: 'column', gap: `${schema.theme?.layout?.gap || 8}px`}}>
                    {renderFields()}
                </div>
            )}
        </form>
    );
}

export default FormRenderer;
