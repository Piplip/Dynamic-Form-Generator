import {Box, Button, TextField, Typography} from "@mui/material";
import {FormSchema} from "../../../../../interfaces";
import {useEffect, useRef, useState} from "react";
import {Group, Layer, Rect, Stage, Text, Transformer} from 'react-konva';
import Konva from "konva";
import {Modal} from "@mui/material";

interface LayoutEditorModalProps {
    open: boolean;
    onClose: () => void;
    schema: FormSchema;
    onSchemaChange: (schema: FormSchema) => void;
}

const FieldRect = ({field, cellWidth, cellHeight, onSelect, isSelected, onDragEnd, onTransformEnd}) => {
    const shapeRef = useRef<Konva.Group>(null);
    const trRef = useRef<Konva.Transformer>(null);

    useEffect(() => {
        if (isSelected && trRef.current && shapeRef.current) {
            trRef.current.nodes([shapeRef.current]);
            trRef.current.getLayer().batchDraw();
        }
    }, [isSelected]);

    const layout = field.layout || {row: 0, col: 0, rowSpan: 1, colSpan: 1};

    return (
        <>
            <Group
                ref={shapeRef}
                x={layout.col * cellWidth}
                y={layout.row * cellHeight}
                width={layout.colSpan * cellWidth}
                height={layout.rowSpan * cellHeight}
                draggable
                onClick={onSelect}
                onTap={onSelect}
                onDragEnd={onDragEnd}
                onTransformEnd={onTransformEnd}
            >
                <Rect
                    width={layout.colSpan * cellWidth}
                    height={layout.rowSpan * cellHeight}
                    fill="lightblue"
                    stroke="black"
                    strokeWidth={2}
                />
                <Text
                    text={field.label || field.name}
                    width={layout.colSpan * cellWidth}
                    height={layout.rowSpan * cellHeight}
                    align="center"
                    verticalAlign="middle"
                    padding={5}
                    fontSize={14}
                />
            </Group>
            {isSelected && (
                <Transformer
                    ref={trRef}
                    boundBoxFunc={(oldBox, newBox) => {
                        if (newBox.width < cellWidth || newBox.height < cellHeight) {
                            return oldBox;
                        }
                        return newBox;
                    }}
                />
            )}
        </>
    );
};

function LayoutEditorModal({open, onClose, schema, onSchemaChange}: LayoutEditorModalProps) {
    const [selectedId, selectShape] = useState<string | null>(null);
    const [gridColumns, setGridColumns] = useState(schema.layout?.columns || 12);
    const [gridRows, setGridRows] = useState(schema.layout?.rows || 10);
    const stageRef = useRef(null);

    const STAGE_WIDTH = Math.min(window.innerWidth * 0.85, 1400);
    const STAGE_HEIGHT = Math.min(window.innerHeight * 0.65, 700);

    const CELL_WIDTH = STAGE_WIDTH / gridColumns;
    const CELL_HEIGHT = STAGE_HEIGHT / gridRows;

    useEffect(() => {
        if (open) {
            const newFields = schema.fields.map((field, index) => {
                const currentLayout = field.layout || {};
                return {
                    ...field,
                    layout: {
                        row: currentLayout.row ?? index, // Default to index if row is missing
                        col: currentLayout.col ?? 0,
                        rowSpan: currentLayout.rowSpan ?? 1,
                        colSpan: currentLayout.colSpan ?? 1,
                    }
                };
            });
            // Only update if there were actual changes to prevent infinite loops
            if (JSON.stringify(newFields) !== JSON.stringify(schema.fields)) {
                onSchemaChange({...schema, fields: newFields});
            }
        }
    }, [open, schema, onSchemaChange]);

    const handleGridChange = (columns: number, rows: number) => {
        setGridColumns(columns);
        setGridRows(rows);
        onSchemaChange({
            ...schema,
            layout: {
                ...schema.layout,
                type: 'grid',
                columns: columns,
                rows: rows
            }
        });
    };

    const handleApplyLayout = () => {
        // Ensure layout type is set to grid when closing
        onSchemaChange({
            ...schema,
            layout: {
                ...schema.layout,
                type: 'grid',
                columns: gridColumns,
                rows: gridRows
            }
        });
        onClose();
    };

    const handleDragEnd = (e, index) => {
        const newFields = [...schema.fields];
        const field = newFields[index];
        const currentLayout = field.layout || {row: 0, col: 0, rowSpan: 1, colSpan: 1};

        const newCol = Math.max(0, Math.min(gridColumns - 1, Math.round(e.target.x() / CELL_WIDTH)));
        const newRow = Math.max(0, Math.round(e.target.y() / CELL_HEIGHT));

        const newLayout = {
            ...currentLayout,
            col: newCol,
            row: newRow,
        };

        newFields[index] = {...field, layout: newLayout};
        onSchemaChange({...schema, fields: newFields});

        e.target.x(newCol * CELL_WIDTH);
        e.target.y(newRow * CELL_HEIGHT);
    };

    const handleTransformEnd = (e, index) => {
        const node = e.target;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();

        node.scaleX(1);
        node.scaleY(1);

        const newFields = [...schema.fields];
        const field = newFields[index];
        const currentLayout = field.layout || {row: 0, col: 0, rowSpan: 1, colSpan: 1};

        const newColSpan = Math.max(1, Math.min(gridColumns - currentLayout.col, Math.round(node.width() * scaleX / CELL_WIDTH)));
        const newRowSpan = Math.max(1, Math.round(node.height() * scaleY / CELL_HEIGHT));

        const newLayout = {
            ...currentLayout,
            colSpan: newColSpan,
            rowSpan: newRowSpan,
        };

        newFields[index] = {...field, layout: newLayout};
        onSchemaChange({...schema, fields: newFields});

        node.width(newColSpan * CELL_WIDTH);
        node.height(newRowSpan * CELL_HEIGHT);
    };

    return (
        <Modal open={open} onClose={() => {
            handleApplyLayout()
            onClose()
        }}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: "90vw",
                maxHeight: "100vh",
                bgcolor: 'background.paper',
                border: '2px solid #000',
                boxShadow: 24,
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
            }}>
                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2}}>
                    <Typography variant="h6" component="h2">
                        Layout Editor
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Drag to move • Resize handles to change size
                    </Typography>
                </Box>

                <Box sx={{
                    display: 'flex',
                    gap: 2,
                    mb: 2,
                    pb: 2,
                    borderBottom: '1px solid #ddd'
                }}>
                    <TextField
                        label="Grid Columns"
                        type="number"
                        value={gridColumns}
                        onChange={(e) => {
                            const val = Math.max(1, Math.min(24, parseInt(e.target.value) || 12));
                            handleGridChange(val, gridRows);
                        }}
                        sx={{width: 140}}
                        size="small"
                        inputProps={{min: 1, max: 24}}
                    />
                    <TextField
                        label="Grid Rows"
                        type="number"
                        value={gridRows}
                        onChange={(e) => {
                            const val = Math.max(1, Math.min(50, parseInt(e.target.value) || 10));
                            handleGridChange(gridColumns, val);
                        }}
                        sx={{width: 140}}
                        size="small"
                        inputProps={{min: 1, max: 50}}
                    />
                    <Box sx={{flexGrow: 1}} />
                    <Typography variant="body2" color="text.secondary" sx={{alignSelf: 'center'}}>
                        Cell Size: {Math.round(CELL_WIDTH)}px
                    </Typography>
                </Box>

                <Box sx={{
                    flexGrow: 1,
                    overflow: 'auto',
                    border: '2px solid #ccc',
                    bgcolor: '#fafafa',
                    borderRadius: 1,
                    position: 'relative'
                }}>
                    <Stage
                        ref={stageRef}
                        width={STAGE_WIDTH}
                        height={Math.max(STAGE_HEIGHT, gridRows * CELL_HEIGHT)}
                        onMouseDown={(e) => {
                            const clickedOnEmpty = e.target === e.target.getStage();
                            if (clickedOnEmpty) {
                                selectShape(null);
                            }
                        }}
                    >
                        <Layer>
                            {/* Draw vertical grid lines */}
                            {Array.from({length: gridColumns + 1}).map((_, i) => (
                                <Rect
                                    key={`grid-v-${i}`}
                                    x={i * CELL_WIDTH}
                                    y={0}
                                    width={1}
                                    height={gridRows * CELL_HEIGHT}
                                    fill="#ddd"
                                />
                            ))}
                            {/* Draw horizontal grid lines */}
                            {Array.from({length: gridRows + 1}).map((_, i) => (
                                <Rect
                                    key={`grid-h-${i}`}
                                    x={0}
                                    y={i * CELL_HEIGHT}
                                    width={STAGE_WIDTH}
                                    height={1}
                                    fill="#ddd"
                                />
                            ))}

                            {/* Render field rectangles */}
                            {schema.fields.map((field, i) => (
                                <FieldRect
                                    key={i}
                                    field={field}
                                    cellWidth={CELL_WIDTH}
                                    cellHeight={CELL_HEIGHT}
                                    isSelected={field.name === selectedId}
                                    onSelect={() => selectShape(field.name)}
                                    onDragEnd={(e) => handleDragEnd(e, i)}
                                    onTransformEnd={(e) => handleTransformEnd(e, i)}
                                />
                            ))}
                        </Layer>
                    </Stage>
                </Box>

                <Box sx={{mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1}}>
                    <Button variant="outlined" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={onClose}>
                        Apply Layout
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default LayoutEditorModal;
