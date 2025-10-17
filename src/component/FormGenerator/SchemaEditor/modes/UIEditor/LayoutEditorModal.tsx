import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography} from "@mui/material";
import React from "react";
import {FieldSchema} from "../../../../../../interfaces";

interface LayoutEditorModalProps {
    open: boolean;
    onClose: () => void;
    grid?: FieldSchema['grid'];
    onGridChange: (grid?: FieldSchema['grid']) => void;
}

function LayoutEditorModal({open, onClose, grid, onGridChange}: LayoutEditorModalProps) {
    const handleGridValueChange = (prop: keyof FieldSchema['grid'], value: string) => {
        onGridChange({
            ...grid,
            [prop]: parseInt(value),
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Edit Layout (Grid) Properties</DialogTitle>
            <DialogContent>
                <Box sx={{display: 'flex', flexDirection: 'column', gap: 2, mt: 2}}>
                    <Typography variant="subtitle1">Grid Breakpoints</Typography>
                    <Box sx={{display: 'flex', gap: 2}}>
                        <TextField
                            label="xs"
                            type="number"
                            value={grid?.xs || ''}
                            onChange={(e) => handleGridValueChange('xs', e.target.value)}
                        />
                        <TextField
                            label="sm"
                            type="number"
                            value={grid?.sm || ''}
                            onChange={(e) => handleGridValueChange('sm', e.target.value)}
                        />
                        <TextField
                            label="md"
                            type="number"
                            value={grid?.md || ''}
                            onChange={(e) => handleGridValueChange('md', e.target.value)}
                        />
                        <TextField
                            label="lg"
                            type="number"
                            value={grid?.lg || ''}
                            onChange={(e) => handleGridValueChange('lg', e.target.value)}
                        />
                        <TextField
                            label="xl"
                            type="number"
                            value={grid?.xl || ''}
                            onChange={(e) => handleGridValueChange('xl', e.target.value)}
                        />
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}

export default LayoutEditorModal;
