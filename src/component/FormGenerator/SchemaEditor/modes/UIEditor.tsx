import {FormSchema} from "../../../../interfaces";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    MenuItem,
    Paper,
    TextField,
    Typography
} from "@mui/material";
import {useState} from "react";
import FieldEditor from "./UIEditor/FieldEditor";
import LayoutEditorModal from "./UIEditor/LayoutEditorModal";
import GridViewIcon from "@mui/icons-material/GridView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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

    const handleThemeChange = (theme) => {
        onSchemaChange({...schema, theme});
    }

    return (
        <Box sx={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', overflowY: "auto"}}>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                    <Typography>Theme</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                        <TextField label="Form Title" value={schema.title}
                                   onChange={(e) => onSchemaChange({...schema, title: e.target.value})}/>
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                                <Typography>Font</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                                    <TextField label="Size" value={schema.theme?.font?.size}
                                               onChange={(e) => handleThemeChange({
                                                   ...schema.theme,
                                                   font: {...schema.theme?.font, size: e.target.value}
                                               })}/>
                                    <TextField label="Family" value={schema.theme?.font?.family}
                                               onChange={(e) => handleThemeChange({
                                                   ...schema.theme,
                                                   font: {...schema.theme?.font, family: e.target.value}
                                               })}/>
                                    <TextField label="Style" value={schema.theme?.font?.style}
                                               onChange={(e) => handleThemeChange({
                                                   ...schema.theme,
                                                   font: {...schema.theme?.font, style: e.target.value}
                                               })}/>
                                    <TextField label="Weight" value={schema.theme?.font?.weight}
                                               onChange={(e) => handleThemeChange({
                                                   ...schema.theme,
                                                   font: {...schema.theme?.font, weight: e.target.value}
                                               })}/>
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                                <Typography>Color</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                                    <TextField label="Primary" value={schema.theme?.color?.primary}
                                               onChange={(e) => handleThemeChange({
                                                   ...schema.theme,
                                                   color: {...schema.theme?.color, primary: e.target.value}
                                               })}/>
                                    <TextField label="Secondary" value={schema.theme?.color?.secondary}
                                               onChange={(e) => handleThemeChange({
                                                   ...schema.theme,
                                                   color: {...schema.theme?.color, secondary: e.target.value}
                                               })}/>
                                    <TextField label="Background" value={schema.theme?.color?.background}
                                               onChange={(e) => handleThemeChange({
                                                   ...schema.theme,
                                                   color: {...schema.theme?.color, background: e.target.value}
                                               })}/>
                                    <TextField label="Text" value={schema.theme?.color?.text}
                                               onChange={(e) => handleThemeChange({
                                                   ...schema.theme,
                                                   color: {...schema.theme?.color, text: e.target.value}
                                               })}/>
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                                <Typography>Layout</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                                    <TextField label="Line Height" value={schema.theme?.layout?.lineHeight}
                                               onChange={(e) => handleThemeChange({
                                                   ...schema.theme,
                                                   layout: {...schema.theme?.layout, lineHeight: e.target.value}
                                               })}/>
                                    <TextField label="Line Spacing" value={schema.theme?.layout?.lineSpacing}
                                               onChange={(e) => handleThemeChange({
                                                   ...schema.theme,
                                                   layout: {...schema.theme?.layout, lineSpacing: e.target.value}
                                               })}/>
                                    <TextField label="Padding" value={schema.theme?.layout?.padding}
                                               onChange={(e) => handleThemeChange({
                                                   ...schema.theme,
                                                   layout: {...schema.theme?.layout, padding: e.target.value}
                                               })}/>
                                    <TextField label="Margin" value={schema.theme?.layout?.margin}
                                               onChange={(e) => handleThemeChange({
                                                   ...schema.theme,
                                                   layout: {...schema.theme?.layout, margin: e.target.value}
                                               })}/>
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                                <Typography>Border</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                                    <TextField label="Color" value={schema.theme?.border?.color}
                                               onChange={(e) => handleThemeChange({
                                                   ...schema.theme,
                                                   border: {...schema.theme?.border, color: e.target.value}
                                               })}/>
                                    <TextField label="Width" value={schema.theme?.border?.width}
                                               onChange={(e) => handleThemeChange({
                                                   ...schema.theme,
                                                   border: {...schema.theme?.border, width: e.target.value}
                                               })}/>
                                    <TextField label="Style" value={schema.theme?.border?.style}
                                               onChange={(e) => handleThemeChange({
                                                   ...schema.theme,
                                                   border: {...schema.theme?.border, style: e.target.value}
                                               })}/>
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                    </Box>
                </AccordionDetails>
            </Accordion>
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
