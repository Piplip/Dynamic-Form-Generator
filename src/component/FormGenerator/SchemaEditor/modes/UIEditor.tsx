import { rectIntersection, DndContext, DragEndEvent } from "@dnd-kit/core";
import {arrayMove, SortableContext, useSortable, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {FormSchema} from "../../../../interfaces";
import {Box, Button, IconButton, MenuItem, Paper, TextField} from "@mui/material";
import {ReactNode, useState} from "react";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import FieldEditor from "./UIEditor/FieldEditor";

interface UIEditorProps {
    schema: FormSchema;
    onSchemaChange: (schema: FormSchema) => void;
    formData: Record<string, any>;
    onFormChange: (data: Record<string, any>) => void;
}

function SortableItem({id, children}: { id: string; children: ReactNode }) {
    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style}>
            <Box sx={{display: 'flex', alignItems: 'center'}}>
                <IconButton {...attributes} {...listeners}>
                    <DragIndicatorIcon/>
                </IconButton>
                {children}
            </Box>
        </div>
    );
}

function UIEditor({schema, onSchemaChange, formData, onFormChange}: UIEditorProps) {
    const [newFieldType, setNewFieldType] = useState('text');

    const handleAddField = () => {

        const newField: FieldSchema = {

            name: `field_${schema.fields.length + 1}`,

            label: `Field ${schema.fields.length + 1}`,

            type: newFieldType,

        };

        if (newFieldType === 'select') {

            newField.options = [];

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

    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over} = event;

        if (active.id !== over.id) {
            const oldIndex = parseInt(active.id as string);
            const newIndex = parseInt(over.id as string);
            onSchemaChange({...schema, fields: arrayMove(schema.fields, oldIndex, newIndex)});
        }
    };

    return (
        <Box sx={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative'}}>
            <Box sx={{
                flexGrow: 1,
                overflow: 'auto',
                minHeight: 0,
                width: '100%',
                position: 'relative'
            }}>
                <DndContext collisionDetection={rectIntersection} onDragEnd={handleDragEnd}>
                    <SortableContext items={schema.fields.map((_, index) => index.toString())}
                                     strategy={verticalListSortingStrategy}>
                        <Box sx={{display: 'flex', flexDirection: 'column', gap: 2, py: 1}}>
                            {schema.fields.map((field, index) => (
                                <SortableItem key={index} id={index.toString()}>
                                    <FieldEditor
                                        field={field}
                                        index={index}
                                        onFieldChange={handleFieldChange}
                                        onRemoveField={handleRemoveField}
                                        availableFields={schema.fields}
                                    />
                                </SortableItem>
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
                                </TextField>
                                <Button onClick={handleAddField}>Add Field</Button>
                            </Paper>
                        </Box>
                    </SortableContext>
                </DndContext>
            </Box>
        </Box>
    );
}

export default UIEditor;
