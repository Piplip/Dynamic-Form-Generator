import {Box, Button, Checkbox, FormControlLabel, MenuItem, TextField, IconButton} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {useState} from "react";
import ConditionEditor from "./ConditionEditor";
import {FieldSchema} from "../../../../../interfaces";
import {toCamelCase} from "../../../../../utils/string.ts";
import GridOnIcon from '@mui/icons-material/GridOn';
import ListIcon from '@mui/icons-material/List';
import LayoutEditorModal from "./LayoutEditorModal";
import OptionsEditorModal from "./OptionsEditorModal";

interface FieldEditorProps {
    field: FieldSchema;
    index: number;
    onFieldChange: (index: number, field: FieldSchema) => void;
    onRemoveField: (index: number) => void;
    availableFields: FieldSchema[];
}

function FieldEditor({field, index, onFieldChange, onRemoveField, availableFields}: FieldEditorProps) {
    const [showConditionEditor, setShowConditionEditor] = useState(false);
    const [showLayoutEditor, setShowLayoutEditor] = useState(false);
    const [showOptionsEditor, setShowOptionsEditor] = useState(false);

    const handleConditionChange = (condition?: FieldSchema['condition']) => {
        onFieldChange(index, {...field, condition});
    };

    const handleGridChange = (grid?: FieldSchema['grid']) => {
        onFieldChange(index, {...field, grid});
    };

    const handleOptionsChange = (options?: FieldSchema['options']) => {
        onFieldChange(index, {...field, options});
    };

    return (
        <Box sx={{p: 1, display: 'flex', flexDirection: 'column', gap: 2, flexGrow: 1}}>
            <Box sx={{display: 'flex', flexDirection: 'row', gap: 2, flexGrow: 1, alignItems: 'center'}}>
                <TextField
                    label="Name"
                    value={field.name}
                    onChange={(e) => onFieldChange(index, {...field, name: e.target.value})}
                />
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
                    onChange={(e) => onFieldChange(index, {...field, type: e.target.value})}
                >
                    <MenuItem value="text">Text</MenuItem>
                    <MenuItem value="number">Number</MenuItem>
                    <MenuItem value="email">Email</MenuItem>
                    <MenuItem value="select">Select</MenuItem>
                    <MenuItem value="checkbox">Checkbox</MenuItem>
                    <MenuItem value="date">Date</MenuItem>
                </TextField>
                <FormControlLabel
                    control={<Checkbox checked={field.required}
                                       onChange={(e) => onFieldChange(index, {...field, required: e.target.checked})}/>}
                    label="Required"
                />
                <IconButton onClick={() => setShowLayoutEditor(true)}>
                    <GridOnIcon/>
                </IconButton>
                {field.type === 'select' && (
                    <IconButton onClick={() => setShowOptionsEditor(true)}>
                        <ListIcon/>
                    </IconButton>
                )}
                <Button onClick={() => onRemoveField(index)}>
                    <DeleteIcon/>
                </Button>
            </Box>
            <Box sx={{display: 'flex', flexDirection: 'row', gap: 2, flexGrow: 1}}>
                <TextField
                    label="Default Value"
                    value={field.defaultValue}
                    onChange={(e) => onFieldChange(index, {...field, defaultValue: e.target.value})}
                />
                <TextField
                    label="Placeholder"
                    value={field.placeholder}
                    onChange={(e) => onFieldChange(index, {...field, placeholder: e.target.value})}
                />
                <TextField
                    label="Min Length"
                    type="number"
                    value={field.validation?.minLength}
                    onChange={(e) => onFieldChange(index, { ...field, validation: { ...field.validation, minLength: parseInt(e.target.value) } })}
                />
                <TextField
                    label="Max Length"
                    type="number"
                    value={field.validation?.maxLength}
                    onChange={(e) => onFieldChange(index, { ...field, validation: { ...field.validation, maxLength: parseInt(e.target.value) } })}
                />
                <TextField
                    label="Pattern"
                    value={field.validation?.pattern}
                    onChange={(e) => onFieldChange(index, { ...field, validation: { ...field.validation, pattern: e.target.value } })}
                />
            </Box>
            <Button onClick={() => setShowConditionEditor(!showConditionEditor)}>
                {field.condition ? "Edit Condition" : "Add Condition"}
            </Button>
            {showConditionEditor && (
                <ConditionEditor
                    condition={field.condition}
                    onConditionChange={handleConditionChange}
                    availableFields={availableFields}
                    onClose={() => setShowConditionEditor(false)}
                />
            )}
            <LayoutEditorModal
                open={showLayoutEditor}
                onClose={() => setShowLayoutEditor(false)}
                grid={field.grid}
                onGridChange={handleGridChange}
            />
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
