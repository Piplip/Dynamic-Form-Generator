import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box, MenuItem,
    TextField,
    Typography
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {FormSchema, FormTheme} from "../../../../../interfaces";

interface ThemeEditorProps {
    schema: FormSchema;
    onSchemaChange: (schema: FormSchema) => void;
}

function ThemeEditor({schema, onSchemaChange}: ThemeEditorProps) {
    const handleThemeChange = (newTheme: FormTheme) => {
        onSchemaChange({...schema, theme: newTheme});
    };

    return (
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
                                                                <Typography>Title</Typography>
                                                            </AccordionSummary>
                                                            <AccordionDetails>
                                                                <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                                                                    <TextField label="Font Size" value={schema.theme?.title?.fontSize}
                                                                               onChange={(e) => handleThemeChange({
                                                                                   ...schema.theme,
                                                                                   title: {...schema.theme?.title, fontSize: e.target.value}
                                                                               })}/>
                                                                    <TextField label="Font Weight" value={schema.theme?.title?.fontWeight}
                                                                               onChange={(e) => handleThemeChange({
                                                                                   ...schema.theme,
                                                                                   title: {...schema.theme?.title, fontWeight: e.target.value}
                                                                               })}/>
                                                                    <TextField label="Color" value={schema.theme?.title?.color}
                                                                               onChange={(e) => handleThemeChange({
                                                                                   ...schema.theme,
                                                                                   title: {...schema.theme?.title, color: e.target.value}
                                                                               })}/>
                                                                                                                                                                        <TextField select label="Text Align" value={schema.theme?.title?.textAlign || 'left'}
                                                                                                                                                                                   onChange={(e) => handleThemeChange({
                                                                                                                                                                                       ...schema.theme,
                                                                                                                                                                                       title: {...schema.theme?.title, textAlign: e.target.value as 'left' | 'center' | 'right'}
                                                                                                                                                                                   })}>
                                                                                                                                                                            <MenuItem value="left">Left</MenuItem>
                                                                                                                                                                            <MenuItem value="center">Center</MenuItem>                                                                                                                <MenuItem value="right">Right</MenuItem>
                                                                                                            </TextField>
                                                                                                            <TextField label="Margin Top" value={schema.theme?.title?.marginTop}
                                                                                                                       onChange={(e) => handleThemeChange({
                                                                                                                           ...schema.theme,
                                                                                                                           title: {...schema.theme?.title, marginTop: e.target.value}
                                                                                                                       })}/>
                                                                                                            <TextField label="Margin Bottom" value={schema.theme?.title?.marginBottom}
                                                                                                                       onChange={(e) => handleThemeChange({
                                                                                                                           ...schema.theme,
                                                                                                                           title: {...schema.theme?.title, marginBottom: e.target.value}
                                                                                                                       })}/>
                                                                                                            <TextField label="Padding Top" value={schema.theme?.title?.paddingTop}
                                                                                                                       onChange={(e) => handleThemeChange({
                                                                                                                           ...schema.theme,
                                                                                                                           title: {...schema.theme?.title, paddingTop: e.target.value}
                                                                                                                       })}/>
                                                                                                            <TextField label="Padding Bottom" value={schema.theme?.title?.paddingBottom}
                                                                                                                       onChange={(e) => handleThemeChange({
                                                                                                                           ...schema.theme,
                                                                                                                           title: {...schema.theme?.title, paddingBottom: e.target.value}
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
                                                                                                                       })}/>                                <TextField label="Secondary" value={schema.theme?.color?.secondary}
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
                                                                    <TextField label="Gap" type="number" value={schema.theme?.layout?.gap}
                                                                               onChange={(e) => handleThemeChange({
                                                                                   ...schema.theme,
                                                                                   layout: {...schema.theme?.layout, gap: parseInt(e.target.value || "0")}
                                                                               })}/>
                                                            </Box>
                                                        </AccordionDetails>
                                                    </Accordion>                    <Accordion>
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
    );
}

export default ThemeEditor;
