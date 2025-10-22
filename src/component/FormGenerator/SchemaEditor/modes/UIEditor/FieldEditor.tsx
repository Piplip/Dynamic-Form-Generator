import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    IconButton,
    MenuItem,
    Switch,
    TextField,
    Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {useState} from "react";
import ConditionEditor from "./ConditionEditor";
import {
    CheckboxFieldLayout,
    FieldSchema,
    FileFieldLayout,
    InputFieldLayout,
    ButtonFieldLayout,
    DatePickerFieldLayout,
    RichTextFieldLayout,
    SelectFieldLayout,
} from "../../../../../interfaces";
import {toCamelCase} from "../../../../../utils/string.ts";
import ListIcon from "@mui/icons-material/List";
import OptionsEditorModal from "./OptionsEditorModal";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// NOTE: Removed `schema` and `onSchemaChange` from the interface
// since they are not used in the FieldEditor component's logic.
interface FieldEditorProps {
    field: FieldSchema;
    index: number;
    onFieldChange: (index: number, field: FieldSchema) => void;
    onRemoveField: (index: number) => void;
    availableFields: FieldSchema[];
    // schema: FormSchema; // Removed unused prop
    // onSchemaChange: (schema: FormSchema) => void; // Removed unused prop
}

function FieldEditor({
                         field,
                         index,
                         onFieldChange,
                         onRemoveField,
                         availableFields, // Destructured for ConditionEditor
                     }: FieldEditorProps) {
    const [showOptionsEditor, setShowOptionsEditor] = useState(false);

    const handleConditionChange = (condition?: FieldSchema["condition"]) => {
        onFieldChange(index, {...field, condition});
    };

    const handleOptionsChange = (options?: FieldSchema["options"]) => {
        onFieldChange(index, {...field, options});
    };

    // Handlers for type-specific layouts
    const handleInputLayoutChange = (newLayout: InputFieldLayout | undefined) => {
        // Use an empty object if newLayout is undefined to prevent errors in {...field.inputLayout} later
        onFieldChange(index, {...field, inputLayout: newLayout || {}});
    };

    const handleFileLayoutChange = (newLayout: FileFieldLayout | undefined) => {
        onFieldChange(index, {...field, fileLayout: newLayout || {}});
    };

    const handleCheckboxLayoutChange = (newLayout: CheckboxFieldLayout | undefined) => {
        onFieldChange(index, {...field, checkboxLayout: newLayout || {}});
    };

    // Assuming DatePickerFieldLayout exists
    const handleDatePickerLayoutChange = (newLayout: DatePickerFieldLayout | undefined) => {
        onFieldChange(index, {...field, datePickerLayout: newLayout || {}});
    };

    // Assuming RichTextFieldLayout exists
    const handleRichTextLayoutChange = (newLayout: RichTextFieldLayout | undefined) => {
        onFieldChange(index, {...field, richTextLayout: newLayout || {}});
    };

    // Assuming ButtonFieldLayout exists
    const handleButtonLayoutChange = (newLayout: ButtonFieldLayout | undefined) => {
        onFieldChange(index, {...field, buttonLayout: newLayout || {}});
    };

    // Assuming SelectFieldLayout exists
    const handleSelectLayoutChange = (newLayout: SelectFieldLayout | undefined) => {
        onFieldChange(index, {...field, selectLayout: newLayout || {}});
    };

    return (
        <Box
            sx={{
                p: 1,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                flexGrow: 1,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 2,
                    flexGrow: 1,
                    alignItems: "center",
                }}
            >
                <TextField
                    label="Label"
                    value={field.label}
                    onChange={(e) => {
                        const newLabel = e.target.value;
                        const newField = {...field, label: newLabel};

                        if (field.label !== newLabel) {
                            newField.name = toCamelCase(newLabel);
                        }

                        onFieldChange(index, newField);
                    }}
                />

                <TextField
                    sx={{minWidth: "fit-content"}}
                    select
                    label="Type"
                    value={field.type}
                    onChange={(e) =>
                        onFieldChange(index, {
                            ...field,
                            type: e.target.value as FieldSchema["type"],
                        })
                    }
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

                {field.type !== "button" && (
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={field.validation?.required || false}
                                onChange={(e) =>
                                    onFieldChange(index, {
                                        ...field,
                                        validation: {
                                            ...field.validation,
                                            required: e.target.checked,
                                        },
                                    })
                                }
                            />
                        }
                        label="Required"
                    />
                )}

                {field.type === "select" && (
                    <IconButton onClick={() => setShowOptionsEditor(true)}>
                        <ListIcon/>
                    </IconButton>
                )}

                <Button onClick={() => onRemoveField(index)} aria-label="Remove Field">
                    <DeleteIcon/>
                </Button>
            </Box>

            {/* --- BUTTON PROPERTIES ACCORDION --- */}
            {field.type === "button" && (
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                        <Typography>Button Properties</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
                            <TextField
                                select
                                label="Button Type"
                                value={field.buttonType || "submit"}
                                onChange={(e) =>
                                    onFieldChange(index, {
                                        ...field,
                                        buttonType: e.target.value as FieldSchema["buttonType"],
                                    })
                                }
                            >
                                <MenuItem value="submit">Submit</MenuItem>
                                <MenuItem value="button">Button</MenuItem>
                            </TextField>

                            <TextField
                                select
                                label="Variant"
                                value={field.buttonLayout?.variant || "primary"}
                                onChange={(e) =>
                                    handleButtonLayoutChange({
                                        ...field.buttonLayout,
                                        variant: e.target.value as ButtonFieldLayout["variant"],
                                    })
                                }
                            >
                                <MenuItem value="primary">Primary</MenuItem>
                                <MenuItem value="secondary">Secondary</MenuItem>
                                <MenuItem value="danger">Danger</MenuItem>
                                <MenuItem value="ghost">Ghost</MenuItem>
                            </TextField>

                            <TextField
                                select
                                label="Size"
                                value={field.buttonLayout?.size || "medium"}
                                onChange={(e) =>
                                    handleButtonLayoutChange({
                                        ...field.buttonLayout,
                                        size: e.target.value as ButtonFieldLayout["size"],
                                    })
                                }
                            >
                                <MenuItem value="small">Small</MenuItem>
                                <MenuItem value="medium">Medium</MenuItem>
                                <MenuItem value="large">Large</MenuItem>
                            </TextField>

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={field.buttonLayout?.fullWidth || false}
                                        onChange={(e) =>
                                            handleButtonLayoutChange({
                                                ...field.buttonLayout,
                                                fullWidth: e.target.checked,
                                            })
                                        }
                                    />
                                }
                                label="Full Width"
                            />

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={field.loading || false}
                                        onChange={(e) =>
                                            onFieldChange(index, {
                                                ...field,
                                                loading: e.target.checked,
                                            })
                                        }
                                    />
                                }
                                label="Loading"
                            />
                        </Box>
                    </AccordionDetails>
                </Accordion>
            )}

            {/* --- SELECT PROPERTIES ACCORDION --- */}
            {field.type === "select" && (
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                        <Typography>Select Properties</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={field.selectLayout?.multiple || false}
                                        onChange={(e) =>
                                            handleSelectLayoutChange({
                                                ...field.selectLayout,
                                                multiple: e.target.checked,
                                            })
                                        }
                                    />
                                }
                                label="Multiple"
                            />

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={field.selectLayout?.autocomplete || false}
                                        onChange={(e) =>
                                            handleSelectLayoutChange({
                                                ...field.selectLayout,
                                                autocomplete: e.target.checked,
                                            })
                                        }
                                    />
                                }
                                label="Autocomplete"
                            />

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={field.selectLayout?.creatable || false}
                                        onChange={(e) =>
                                            handleSelectLayoutChange({
                                                ...field.selectLayout,
                                                creatable: e.target.checked,
                                            })
                                        }
                                    />
                                }
                                label="Creatable"
                            />
                        </Box>
                    </AccordionDetails>
                </Accordion>
            )}

            {/* --- CHECKBOX PROPERTIES ACCORDION --- */}
            {field.type === "checkbox" && (
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                        <Typography>Checkbox Properties</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
                            <TextField
                                select
                                label="Label Placement"
                                value={field.checkboxLayout?.labelPlacement || "right"}
                                onChange={(e) =>
                                    handleCheckboxLayoutChange({
                                        ...field.checkboxLayout,
                                        labelPlacement: e.target
                                            .value as CheckboxFieldLayout["labelPlacement"],
                                    })
                                }
                            >
                                <MenuItem value="right">Right</MenuItem>
                                <MenuItem value="left">Left</MenuItem>
                            </TextField>

                            <TextField
                                select
                                label="Size"
                                value={field.checkboxLayout?.size || "medium"}
                                onChange={(e) =>
                                    handleCheckboxLayoutChange({
                                        ...field.checkboxLayout,
                                        size: e.target.value as CheckboxFieldLayout["size"],
                                    })
                                }
                            >
                                <MenuItem value="small">Small</MenuItem>
                                <MenuItem value="medium">Medium</MenuItem>
                                <MenuItem value="large">Large</MenuItem>
                            </TextField>
                        </Box>
                    </AccordionDetails>
                </Accordion>
            )}

            {/* --- FILE UPLOAD PROPERTIES ACCORDION --- */}
            {field.type === "file" && (
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                        <Typography>File Upload Properties</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
                            <TextField
                                select
                                label="Preset"
                                value={field.fileLayout?.preset || "button-only"}
                                onChange={(e) =>
                                    handleFileLayoutChange({
                                        ...field.fileLayout,
                                        preset: e.target.value as FileFieldLayout["preset"],
                                    })
                                }
                            >
                                <MenuItem value="button-only">Button Only</MenuItem>
                                <MenuItem value="drag-and-drop">Drag and Drop</MenuItem>
                                <MenuItem value="compact">Compact</MenuItem>
                                <MenuItem value="with-preview">With Preview</MenuItem>
                            </TextField>

                            <TextField
                                label="Accepted File Types (e.g., image/*, .pdf)"
                                value={field.fileLayout?.accept}
                                onChange={(e) =>
                                    handleFileLayoutChange({
                                        ...field.fileLayout,
                                        accept: e.target.value,
                                    })
                                }
                            />

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={field.fileLayout?.multiple || false}
                                        onChange={(e) =>
                                            handleFileLayoutChange({
                                                ...field.fileLayout,
                                                multiple: e.target.checked,
                                            })
                                        }
                                    />
                                }
                                label="Allow Multiple Files"
                            />

                            <TextField
                                label="Max File Size (bytes)"
                                type="number"
                                value={field.fileLayout?.maxSize || ""}
                                onChange={(e) =>
                                    handleFileLayoutChange({
                                        ...field.fileLayout,
                                        maxSize: parseInt(e.target.value || "0"),
                                    })
                                }
                            />

                            <TextField
                                label="Max Files"
                                type="number"
                                value={field.fileLayout?.maxFiles || ""}
                                onChange={(e) =>
                                    handleFileLayoutChange({
                                        ...field.fileLayout,
                                        maxFiles: parseInt(e.target.value || "0"),
                                    })
                                }
                            />

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={field.fileLayout?.showFileList || false}
                                        onChange={(e) =>
                                            handleFileLayoutChange({
                                                ...field.fileLayout,
                                                showFileList: e.target.checked,
                                            })
                                        }
                                    />
                                }
                                label="Show File List"
                            />
                        </Box>
                    </AccordionDetails>
                </Accordion>
            )}

            {/* --- INPUT LAYOUT ACCORDION (For common input types) --- */}
            {(field.type === "text" ||
                field.type === "email" ||
                field.type === "number" ||
                field.type === "select" ||
                field.type === "textarea") && (
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                        <Typography>Input Layout</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
                            <TextField
                                select
                                label="Label Placement"
                                value={field.inputLayout?.labelPlacement || "top"}
                                onChange={(e) =>
                                    handleInputLayoutChange({
                                        ...field.inputLayout,
                                        labelPlacement: e.target
                                            .value as InputFieldLayout["labelPlacement"],
                                    })
                                }
                            >
                                <MenuItem value="top">Top</MenuItem>
                                <MenuItem value="left">Left</MenuItem>
                                <MenuItem value="inside">Inside</MenuItem>
                                <MenuItem value="hidden">Hidden</MenuItem>
                            </TextField>
                            <TextField
                                select
                                label="Variant"
                                value={field.inputLayout?.variant || "outlined"}
                                onChange={(e) =>
                                    handleInputLayoutChange({
                                        ...field.inputLayout,
                                        variant: e.target.value as InputFieldLayout["variant"],
                                    })
                                }
                            >
                                <MenuItem value="outlined">Outlined</MenuItem>
                                <MenuItem value="filled">Filled</MenuItem>
                                <MenuItem value="standard">Standard</MenuItem>
                            </TextField>
                            <TextField
                                select
                                label="Size"
                                value={field.inputLayout?.size || "medium"}
                                onChange={(e) =>
                                    handleInputLayoutChange({
                                        ...field.inputLayout,
                                        size: e.target.value as InputFieldLayout["size"],
                                    })
                                }
                            >
                                <MenuItem value="small">Small</MenuItem>
                                <MenuItem value="medium">Medium</MenuItem>
                                <MenuItem value="large">Large</MenuItem>
                            </TextField>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={field.inputLayout?.fullWidth || false}
                                        onChange={(e) =>
                                            handleInputLayoutChange({
                                                ...field.inputLayout,
                                                fullWidth: e.target.checked,
                                            })
                                        }
                                    />
                                }
                                label="Full Width"
                            />
                        </Box>
                    </AccordionDetails>
                </Accordion>
            )}

            {/* --- ADVANCED & VALIDATION ACCORDIONS (Restored and cleaned up) --- */}
            {field.type !== "button" && (
                <>
                    {/* Advanced Accordion */}
                                        <Accordion>
                                            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                                                <Typography>Advanced</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
                                                    <TextField
                                                        label="Name"
                                                        value={field.name}
                                                        onChange={(e) =>
                                                            onFieldChange(index, {...field, name: e.target.value})
                                                        }
                                                    />
                                                    <TextField
                                                        label="Default Value"
                                                        value={field.defaultValue}
                                                        onChange={(e) =>
                                                            onFieldChange(index, {
                                                                ...field,
                                                                defaultValue: e.target.value,
                                                            })
                                                        }
                                                    />
                                                    <TextField
                                                        label="Placeholder"
                                                        value={field.placeholder}
                                                        onChange={(e) =>
                                                            onFieldChange(index, {
                                                                ...field,
                                                                placeholder: e.target.value,
                                                            })
                                                        }
                                                    />
                                                    <TextField
                                                        label="Helper Text"
                                                        value={field.inputLayout?.helperText}
                                                        onChange={(e) =>
                                                            handleInputLayoutChange({
                                                                ...field.inputLayout,
                                                                helperText: e.target.value,
                                                            })
                                                        }
                                                    />
                                                    <FormControlLabel
                                                        control={
                                                            <Switch
                                                                checked={field.disabled || false}
                                                                onChange={(e) =>
                                                                    onFieldChange(index, {
                                                                        ...field,
                                                                        disabled: e.target.checked,
                                                                    })
                                                                }
                                                            />
                                                        }
                                                        label="Disabled"
                                                    />
                                                    <FormControlLabel
                                                        control={
                                                            <Switch
                                                                checked={field.readOnly || false}
                                                                onChange={(e) =>
                                                                    onFieldChange(index, {
                                                                        ...field,
                                                                        readOnly: e.target.checked,
                                                                    })
                                                                }
                                                            />
                                                        }
                                                        label="Read Only"
                                                    />
                    
                                                    {/* Responsive Layout Accordion */}
                                                    <Accordion>
                                                        <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                                                            <Typography>Responsive Layout</Typography>
                                                        </AccordionSummary>
                                                        <AccordionDetails>
                                                            <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
                                                                <TextField
                                                                    label="Col Span (Default)"
                                                                    type="number"
                                                                    value={field.layout?.colSpan || ""}
                                                                    onChange={(e) => onFieldChange(index, {
                                                                        ...field,
                                                                        layout: {...field.layout, colSpan: parseInt(e.target.value || "0")}
                                                                    })}
                                                                />
                                                                <TextField
                                                                    label="Col Span (xs)"
                                                                    type="number"
                                                                    value={field.layout?.colSpanXs || ""}
                                                                    onChange={(e) => onFieldChange(index, {
                                                                        ...field,
                                                                        layout: {...field.layout, colSpanXs: parseInt(e.target.value || "0")}
                                                                    })}
                                                                />
                                                                <TextField
                                                                    label="Col Span (sm)"
                                                                    type="number"
                                                                    value={field.layout?.colSpanSm || ""}
                                                                    onChange={(e) => onFieldChange(index, {
                                                                        ...field,
                                                                        layout: {...field.layout, colSpanSm: parseInt(e.target.value || "0")}
                                                                    })}
                                                                />
                                                                <TextField
                                                                    label="Col Span (md)"
                                                                    type="number"
                                                                    value={field.layout?.colSpanMd || ""}
                                                                    onChange={(e) => onFieldChange(index, {
                                                                        ...field,
                                                                        layout: {...field.layout, colSpanMd: parseInt(e.target.value || "0")}
                                                                    })}
                                                                />
                                                                <TextField
                                                                    label="Col Span (lg)"
                                                                    type="number"
                                                                    value={field.layout?.colSpanLg || ""}
                                                                    onChange={(e) => onFieldChange(index, {
                                                                        ...field,
                                                                        layout: {...field.layout, colSpanLg: parseInt(e.target.value || "0")}
                                                                    })}
                                                                />
                                                                <TextField
                                                                    label="Col Span (xl)"
                                                                    type="number"
                                                                    value={field.layout?.colSpanXl || ""}
                                                                    onChange={(e) => onFieldChange(index, {
                                                                        ...field,
                                                                        layout: {...field.layout, colSpanXl: parseInt(e.target.value || "0")}
                                                                    })}
                                                                />
                                                            </Box>
                                                        </AccordionDetails>
                                                    </Accordion>
                                                </Box>
                                            </AccordionDetails>
                                        </Accordion>

                    {/* Validation Accordion */}
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>Validation</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>

                                {/* Required Error Message (applies to all non-button types) */}
                                <TextField
                                    label="Required Error Message"
                                    value={field.validation?.requiredError}
                                    onChange={(e) => onFieldChange(index, {
                                        ...field,
                                        validation: {...field.validation, requiredError: e.target.value}
                                    })}
                                />

                                {field.type === "number" && (
                                    <>
                                        <TextField
                                            label="Min"
                                            type="number"
                                            value={field.validation?.min || ""}
                                            onChange={(e) =>
                                                onFieldChange(index, {
                                                    ...field,
                                                    validation: {
                                                        ...field.validation,
                                                        min: parseInt(e.target.value || "0"),
                                                    },
                                                })
                                            }
                                        />
                                        <TextField
                                            label="Min Error Message"
                                            value={field.validation?.minError}
                                            onChange={(e) => onFieldChange(index, {
                                                ...field,
                                                validation: {...field.validation, minError: e.target.value}
                                            })}
                                        />
                                        <TextField
                                            label="Max"
                                            type="number"
                                            value={field.validation?.max || ""}
                                            onChange={(e) =>
                                                onFieldChange(index, {
                                                    ...field,
                                                    validation: {
                                                        ...field.validation,
                                                        max: parseInt(e.target.value || "0"),
                                                    },
                                                })
                                            }
                                        />
                                        <TextField
                                            label="Max Error Message"
                                            value={field.validation?.maxError}
                                            onChange={(e) => onFieldChange(index, {
                                                ...field,
                                                validation: {...field.validation, maxError: e.target.value}
                                            })}
                                        />
                                    </>
                                )}

                                {/* Min/Max Length and Pattern (applies to string/text types) */}
                                {(field.type === "text" || field.type === "email" || field.type === "textarea") && (
                                    <>
                                        <TextField
                                            label="Min Length"
                                            type="number"
                                            value={field.validation?.minLength || ""}
                                            onChange={(e) =>
                                                onFieldChange(index, {
                                                    ...field,
                                                    validation: {
                                                        ...field.validation,
                                                        minLength: parseInt(e.target.value || "0"),
                                                    },
                                                })
                                            }
                                        />
                                        <TextField
                                            label="Min Length Error Message"
                                            value={field.validation?.minLengthError}
                                            onChange={(e) => onFieldChange(index, {
                                                ...field,
                                                validation: {...field.validation, minLengthError: e.target.value}
                                            })}
                                        />
                                        <TextField
                                            label="Max Length"
                                            type="number"
                                            value={field.validation?.maxLength || ""}
                                            onChange={(e) =>
                                                onFieldChange(index, {
                                                    ...field,
                                                    validation: {
                                                        ...field.validation,
                                                        maxLength: parseInt(e.target.value || "0"),
                                                    },
                                                })
                                            }
                                        />
                                        <TextField
                                            label="Max Length Error Message"
                                            value={field.validation?.maxLengthError}
                                            onChange={(e) => onFieldChange(index, {
                                                ...field,
                                                validation: {...field.validation, maxLengthError: e.target.value}
                                            })}
                                        />
                                        <TextField
                                            label="Pattern (Regex)"
                                            value={field.validation?.pattern}
                                            onChange={(e) =>
                                                onFieldChange(index, {
                                                    ...field,
                                                    validation: {
                                                        ...field.validation,
                                                        pattern: e.target.value,
                                                    },
                                                })
                                            }
                                        />
                                        <TextField
                                            label="Pattern Error Message"
                                            value={field.validation?.patternError}
                                            onChange={(e) => onFieldChange(index, {
                                                ...field,
                                                validation: {...field.validation, patternError: e.target.value}
                                            })}
                                        />
                                    </>
                                )}
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                </>
            )}

            {/* --- RICH TEXT PROPERTIES ACCORDION --- */}
            {field.type === 'rich-text' && (
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                        <Typography>Rich Text Properties</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                            <TextField
                                select
                                label="Editor Library"
                                value={field.richTextLayout?.editorLibrary || 'jodit'}
                                onChange={(e) => handleRichTextLayoutChange({
                                    ...field.richTextLayout,
                                    editorLibrary: e.target.value as RichTextFieldLayout['editorLibrary']
                                })}
                            >
                                <MenuItem value="jodit">Jodit</MenuItem>
                                <MenuItem value="quill">Quill</MenuItem>
                                <MenuItem value="tinymce">TinyMCE</MenuItem>
                                <MenuItem value="custom">Custom</MenuItem>
                            </TextField>
                            <TextField
                                select
                                label="Toolbar Configuration"
                                value={field.richTextLayout?.toolbarConfig || 'full'}
                                onChange={(e) => handleRichTextLayoutChange({
                                    ...field.richTextLayout,
                                    toolbarConfig: e.target.value as RichTextFieldLayout['toolbarConfig']
                                })}
                            >
                                <MenuItem value="simple">Simple</MenuItem>
                                <MenuItem value="full">Full</MenuItem>
                                <MenuItem value="custom">Custom</MenuItem>
                            </TextField>
                            <TextField
                                label="Height (e.g., 200px, 100%)"
                                value={field.richTextLayout?.height || ""}
                                onChange={(e) => handleRichTextLayoutChange({
                                    ...field.richTextLayout,
                                    height: e.target.value
                                })}
                            />
                        </Box>
                    </AccordionDetails>
                </Accordion>
            )}

            {/* --- CONDITIONAL LOGIC ACCORDION --- */}
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

            {/* --- OPTIONS EDITOR MODAL --- */}
            {field.type === "select" && (
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
