import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography} from "@mui/material";
import React from "react";
import {FieldSchema} from "../../../../../../interfaces";

interface OptionsEditorModalProps {
    open: boolean;
    onClose: () => void;
    options?: FieldSchema['options'];
    onOptionsChange: (options?: FieldSchema['options']) => void;
}

function OptionsEditorModal({open, onClose, options, onOptionsChange}: OptionsEditorModalProps) {
    const handleAddOption = () => {
        onOptionsChange([...(options || []), {label: '', value: ''}]);
    };

    const handleRemoveOption = (index: number) => {
        const newOptions = [...(options || [])];
        newOptions.splice(index, 1);
        onOptionsChange(newOptions);
    };

    const handleOptionChange = (index: number, prop: 'label' | 'value', value: string) => {
        const newOptions = [...(options || [])];
        newOptions[index] = {...newOptions[index], [prop]: value};
        onOptionsChange(newOptions);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Edit Options</DialogTitle>
            <DialogContent>
                <Box sx={{display: 'flex', flexDirection: 'column', gap: 2, mt: 2}}>
                    {options?.map((option, index) => (
                        <Box key={index} sx={{display: 'flex', gap: 2, alignItems: 'center'}}>
                            <TextField
                                label="Label"
                                value={option.label}
                                onChange={(e) => handleOptionChange(index, 'label', e.target.value)}
                            />
                            <TextField
                                label="Value"
                                value={option.value}
                                onChange={(e) => handleOptionChange(index, 'value', e.target.value)}
                            />
                            <Button onClick={() => handleRemoveOption(index)} color="error">Remove</Button>
                        </Box>
                    ))}
                    <Button onClick={handleAddOption} variant="outlined">Add Option</Button>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}

export default OptionsEditorModal;
