import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    MenuItem,
    TextField,
    IconButton,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Switch
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {useState} from "react";
import ConditionEditor from "./ConditionEditor";
import {FieldSchema, FormSchema, InputFieldLayout, FileFieldLayout} from "../../../../../interfaces"; // Added InputFieldLayout, FileFieldLayout
import {toCamelCase} from "../../../../../utils/string.ts";
import ListIcon from '@mui/icons-material/List';
import OptionsEditorModal from "./OptionsEditorModal";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface FieldEditorProps {
    field: FieldSchema;
    index: number;
    onFieldChange: (index: number, field: FieldSchema) => void;
    onRemoveField: (index: number) => void;
    availableFields: FieldSchema[];
    schema: FormSchema;
    onSchemaChange: (schema: FormSchema) => void;
}

function FieldEditor({field, index, onFieldChange, onRemoveField, availableFields, schema, onSchemaChange}: FieldEditorProps) {
    const [showOptionsEditor, setShowOptionsEditor] = useState(false);

    const handleConditionChange = (condition?: FieldSchema['condition']) => {
        onFieldChange(index, {...field, condition});
    };

    const handleOptionsChange = (options?: FieldSchema['options']) => {
        onFieldChange(index, {...field, options});
    };

    // New handlers for type-specific layouts
    const handleInputLayoutChange = (newLayout: InputFieldLayout) => {
        onFieldChange(index, {...field, inputLayout: newLayout});
    };

    const handleFileLayoutChange = (newLayout: FileFieldLayout) => {
        onFieldChange(index, {...field, fileLayout: newLayout});
    };

    return (
        <Box sx={{p: 1, display: 'flex', flexDirection: 'column', gap: 2, flexGrow: 1}}>
            <Box sx={{display: 'flex', flexDirection: 'row', gap: 2, flexGrow: 1, alignItems: 'center'}}>
                <TextField
                    label="Label"
                    value={field.label}
                    onChange={(e) => {
                        const newField = {...field, label: e.target.value};
                        if (field.label !== e.target.value) {
                            newField.name = toCamelCase(e.target.value);
                        }
                        onFieldChange(index, newField);
                    }}
                />
                <TextField
                    sx={{minWidth: 'fit-content'}}
                    select
                    label="Type"
                    value={field.type}
                    onChange={(e) => onFieldChange(index, {...field, type: e.target.value as FieldSchema['type']})}
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
                {field.type !== 'button' &&
                    <FormControlLabel
                        control={<Checkbox checked={field.validation?.required}
                                           onChange={(e) => onFieldChange(index, {
                                               ...field,
                                               validation: {...field.validation, required: e.target.checked}
                                           })}/>}
                        label="Required"
                    />
                }
                {field.type === 'select' && (
                    <IconButton onClick={() => setShowOptionsEditor(true)}>
                        <ListIcon/>
                    </IconButton>
                )}
                <Button onClick={() => onRemoveField(index)}>
                    <DeleteIcon/>
                </Button>
            </Box>
            {field.type === 'button' && (
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                        <Typography>Button</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                            <TextField
                                select
                                label="Button Type"
                                value={field.buttonType || 'submit'}
                                onChange={(e) => onFieldChange(index, {
                                    ...field,
                                    buttonType: e.target.value as FieldSchema['buttonType']
                                })}
                            >
                                <MenuItem value="submit">Submit</MenuItem>
                                <MenuItem value="button">Button</MenuItem>
                            </TextField>
                            <FormControlLabel
                                control={<Switch checked={field.loading}
                                                 onChange={(e) => onFieldChange(index, {
                                                     ...field,
                                                     loading: e.target.checked
                                                 })}/>}
                                label="Loading"
                            />
                        </Box>
                    </AccordionDetails>
                </Accordion>
            )}
            {field.type === 'file' && (
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                        <Typography>File Upload Layout</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                            <TextField
                                select
                                label="Preset"
                                value={field.fileLayout?.preset || 'button'}
                                onChange={(e) => handleFileLayoutChange({
                                    ...field.fileLayout,
                                    preset: e.target.value as FileFieldLayout['preset']
                                })}
                            >
                                <MenuItem value="button">Button</MenuItem>
                                <MenuItem value="dropzone">Dropzone</MenuItem>
                            </TextField>
                            <TextField
                                label="Button Text"
                                value={field.fileLayout?.buttonText}
                                onChange={(e) => handleFileLayoutChange({
                                    ...field.fileLayout,
                                    buttonText: e.target.value
                                })}
                            />
                        </Box>
                    </AccordionDetails>
                </Accordion>
            )}
            {(field.type === 'text' || field.type === 'email' || field.type === 'number' || field.type === 'select' || field.type === 'textarea') && (
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                        <Typography>Input Layout</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                            <TextField
                                select
                                label="Label Placement"
                                value={field.inputLayout?.labelPlacement || 'top'}
                                onChange={(e) => handleInputLayoutChange({
                                    ...field.inputLayout,
                                    labelPlacement: e.target.value as InputFieldLayout['labelPlacement']
                                })}
                            >
                                <MenuItem value="top">Top</MenuItem>
                                <MenuItem value="left">Left</MenuItem>
                                <MenuItem value="inline">Inline</MenuItem>
                            </TextField>
                            <TextField
                                select
                                label="Variant"
                                value={field.inputLayout?.variant || 'outlined'}
                                onChange={(e) => handleInputLayoutChange({
                                    ...field.inputLayout,
                                    variant: e.target.value as InputFieldLayout['variant']
                                })}
                            >
                                <MenuItem value="outlined">Outlined</MenuItem>
                                <MenuItem value="filled">Filled</MenuItem>
                                <MenuItem value="standard">Standard</MenuItem>
                            </TextField>
                        </Box>
                    </AccordionDetails>
                </Accordion>
            )}
            {field.type !== 'button' &&
                <>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                            <Typography>Advanced</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                                <TextField
                                    label="Name"
                                    value={field.name}
                                    onChange={(e) => onFieldChange(index, {...field, name: e.target.value})}
                                />
                                <TextField
                                    label="Default Value"
                                    value={field.defaultValue}
                                    onChange={(e) => onFieldChange(index, {
                                        ...field,
                                        defaultValue: e.target.value
                                    })}
                                />
                                <TextField
                                    label="Placeholder"
                                    value={field.placeholder}
                                    onChange={(e) => onFieldChange(index, {
                                        ...field,
                                        placeholder: e.target.value
                                    })}
                                />
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                            <Typography>Validation</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                                {field.type === 'number' && (
                                    <>
                                        <TextField
                                            label="Min"
                                            type="number"
                                            value={field.validation?.min}
                                            onChange={(e) => onFieldChange(index, {
                                                ...field,
                                                validation: {
                                                    ...field.validation,
                                                    min: parseInt(e.target.value)
                                                }
                                            })}
                                        />
                                        <TextField
                                            label="Max"
                                            type="number"
                                            value={field.validation?.max}
                                            onChange={(e) => onFieldChange(index, {
                                                ...field,
                                                validation: {
                                                    ...field.validation,
                                                    max: parseInt(e.target.value)
                                                }
                                            })}
                                        />
                                    </>
                                )}
                                <TextField
                                    label="Min Length"
                                    type="number"
                                    value={field.validation?.minLength}
                                    onChange={(e) => onFieldChange(index, {
                                        ...field,
                                        validation: {
                                            ...field.validation,
                                            minLength: parseInt(e.target.value)
                                        }
                                    })}
                                />
                                <TextField
                                    label="Max Length"
                                    type="number"
                                    value={field.validation?.maxLength}
                                    onChange={(e) => onFieldChange(index, {
                                        ...field,
                                        validation: {
                                            ...field.validation,
                                            maxLength: parseInt(e.target.value)
                                        }
                                    })}
                                />
                                <TextField
                                    label="Pattern"
                                    value={field.validation?.pattern}
                                    onChange={(e) => onFieldChange(index, {
                                        ...field,
                                        validation: {...field.validation, pattern: e.target.value}
                                    })}
                                />
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                </>
            }
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                    <Typography>Conditional Logic</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <ConditionEditor
                        condition={field.condition}
                        onConditionChange={handleConditionChange}
                        availableFields={availableFields}
                        onClose={() => {}}
                    />
                </AccordionDetails>
            </Accordion>
            {field.type === 'select' && (
                <OptionsEditorModal
                    open={showOptionsEditor}
                    onClose={() => setShowOptionsEditor(false)}
                    options={field.options}
                    onOptionsChange={handleOptionsChange}
                />
            )}
        </Box>
    );
}

export default FieldEditor;
