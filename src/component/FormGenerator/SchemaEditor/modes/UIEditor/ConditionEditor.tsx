import {Box, Button, MenuItem, TextField} from "@mui/material";
import React from "react";
import {FieldSchema} from "../../../../../interfaces";

interface ConditionEditorProps {
    condition?: FieldSchema['condition'];
    onConditionChange: (condition?: FieldSchema['condition']) => void;
    availableFields: FieldSchema[];
    onClose: () => void;
}

function ConditionEditor({condition, onConditionChange, availableFields, onClose}: ConditionEditorProps) {
    const selectedConditionField = availableFields.find(f => f.name === condition?.field);

    const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onConditionChange({
            ...condition,
            field: e.target.value,
        });
    };

    const handleOperatorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onConditionChange({
            ...condition,
            operator: e.target.value as FieldSchema['condition']['operator'],
        });
    };

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onConditionChange({
            ...condition,
            value: e.target.value,
        });
    };

    const handleRemoveCondition = () => {
        onConditionChange(undefined);
        onClose();
    };

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 2, border: '1px solid #ccc', p: 2, borderRadius: 1}}>
            <Box sx={{display: 'flex', gap: 2}}>
                <TextField
                    select
                    label="Condition Field"
                    value={condition?.field || ''}
                    onChange={handleFieldChange}
                    fullWidth
                >
                    {availableFields.map((field) => (
                        <MenuItem key={field.name} value={field.name}>
                            {field.label || field.name}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    select
                    label="Operator"
                    value={condition?.operator || ''}
                    onChange={handleOperatorChange}
                    fullWidth
                >
                    <MenuItem value="==">==</MenuItem>
                    <MenuItem value="!=">!=</MenuItem>
                    <MenuItem value=">">{">"}</MenuItem>
                    <MenuItem value="<">{"<"}</MenuItem>
                    <MenuItem value=">=">{">="}</MenuItem>
                    <MenuItem value="<=">{"<="}</MenuItem>
                    <MenuItem value="includes">includes</MenuItem>
                    <MenuItem value="!includes">!includes</MenuItem>
                </TextField>
                <TextField
                    label="Value"
                    type={selectedConditionField?.type === 'number' ? 'number' : 'text'}
                    value={condition?.value || ''}
                    onChange={handleValueChange}
                    fullWidth
                />
            </Box>
            <Button onClick={handleRemoveCondition} color="error">Remove Condition</Button>
        </Box>
    );
}

export default ConditionEditor;
