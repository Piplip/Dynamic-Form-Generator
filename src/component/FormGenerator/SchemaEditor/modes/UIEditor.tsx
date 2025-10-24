import {FieldSchema, FormSchema} from "../../../../interfaces";
import {Box, Button, MenuItem, Paper, TextField} from "@mui/material";
import {useState} from "react";
import FieldEditor from "./UIEditor/FieldEditor";
import LayoutEditorModal from "./UIEditor/LayoutEditorModal";
import ThemeEditor from "./UIEditor/ThemeEditor";
import GridViewIcon from "@mui/icons-material/GridView";

interface UIEditorProps {
    schema: FormSchema;
    onSchemaChange: (schema: FormSchema) => void;
    formData: Record<string, any>;
    onFormChange: (data: Record<string, any>) => void;
}

function UIEditor({schema, onSchemaChange, formData, onFormChange}: UIEditorProps) {
    const [newFieldType, setNewFieldType] = useState('text');
    const [showLayoutEditor, setShowLayoutEditor] = useState(false);

    const handleAddField = () => {

        const newField: FieldSchema = {

            name: `field_${schema.fields.length + 1}`,

            label: `Field ${schema.fields.length + 1}`,

            type: newFieldType,

            layout: {
                row: schema.fields.length,
                col: 0,
                rowSpan: 1,
                colSpan: 1,
            }

        };

        if (newFieldType === 'select') {

            newField.options = [];

        }

        if (newFieldType === 'button') {
            newField.buttonType = 'submit';
        }

        onSchemaChange({...schema, fields: [...schema.fields, newField]});

    };

    const handleRemoveField = (index: number) => {
        const newFields = [...schema.fields];
        const newFormData = { ...formData };
        delete newFormData[newFields[index].name];
        newFields.splice(index, 1);
        onSchemaChange({ ...schema, fields: newFields });
        onFormChange(newFormData);
    };

    const handleFieldChange = (index: number, field: FieldSchema) => {
        const newFields = [...schema.fields];
        newFields[index] = field;
        onSchemaChange({ ...schema, fields: newFields });
    };

    return (
        <Box sx={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', overflowY: "auto"}}>
            <ThemeEditor schema={schema} onSchemaChange={onSchemaChange}/>
            <Box sx={{
                flexGrow: 1,
                overflow: 'auto',
                minHeight: 0,
                width: '100%',
                position: 'relative'
            }}>
                <Box sx={{display: 'flex', flexDirection: 'column', gap: 2, py: 1}}>
                    {schema.fields.map((field, index) => (
                        <FieldEditor
                            key={field.name}
                            field={field}
                            index={index}
                            onFieldChange={handleFieldChange}
                            onRemoveField={handleRemoveField}
                            availableFields={schema.fields}
                            schema={schema}
                            onSchemaChange={onSchemaChange}
                        />
                    ))}
                    <Paper sx={{p: 2, display: 'flex', flexDirection: 'row', gap: 2, mt: 2}}>
                        <TextField
                            sx={{minWidth: 200}}
                            select
                            label="Field Type"
                            value={newFieldType}
                            onChange={(e) => setNewFieldType(e.target.value)}
                        >
                            <MenuItem value="text">Text</MenuItem>
                            <MenuItem value="number">Number</MenuItem>
                            <MenuItem value="email">Email</MenuItem>
                            <MenuItem value="select">Select</MenuItem>
                            <MenuItem value="checkbox">Checkbox</MenuItem>
                            <MenuItem value="date">Date</MenuItem>
                            <MenuItem value="file">File</MenuItem>
                            <MenuItem value="rich-text">Rich Text</MenuItem>
                            <MenuItem value="button">Button</MenuItem>
                            <MenuItem value="textarea">Textarea</MenuItem>
                        </TextField>
                        <Button onClick={handleAddField}>Add Field</Button>
                        <Button onClick={() => setShowLayoutEditor(true)} startIcon={<GridViewIcon/>}>
                            Edit Layout
                        </Button>
                    </Paper>
                </Box>
            </Box>
            <LayoutEditorModal
                open={showLayoutEditor}
                onClose={() => setShowLayoutEditor(false)}
                schema={schema}
                onSchemaChange={onSchemaChange}
            />
        </Box>
    );
}

export default UIEditor;
