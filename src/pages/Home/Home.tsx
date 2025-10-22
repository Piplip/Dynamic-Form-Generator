import {useEffect, useState} from "react";
import {FieldSchema, FormSchema} from "../../interfaces";
import SchemaEditor from "../../component/FormGenerator/SchemaEditor/SchemaEditor";
import FormRenderer from "../../component/FormGenerator/FormRenderer/FormRenderer";
import {Box, Button, MenuItem, Paper, Select, Typography} from "@mui/material";
import OutputPanel from "../../component/FormGenerator/OutputPanel/OutputPanel.tsx";
import {
    Panel,
    PanelGroup,
    PanelResizeHandle,
} from "react-resizable-panels";
import {generateCode, GenerationOptions} from "../../code-generator";
import {GeneratedFile} from "../../code-generator/types";
import GeneratedCodeModal from "../../component/FormGenerator/OutputPanel/GeneratedCodeModal";

function Home() {
    const [schemaText, setSchemaText] = useState<string>('');
    const [schema, setSchema] = useState<FormSchema>({fields: []});
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [schemaError, setSchemaError] = useState<string | null>(null);
    const [generationOptions, setGenerationOptions] = useState<GenerationOptions>({
        framework: "react",
        language: "typescript",
        uiLibrary: "tailwind",
        stateManagement: "react-hook-form",
        validation: "zod",
    });
    const [generatedCode, setGeneratedCode] = useState<GeneratedFile[]>([]);
    const [generationError, setGenerationError] = useState<string | null>(null);
    const [triggerGeneration, setTriggerGeneration] = useState(false);
    const [showGeneratedCodeModal, setShowGeneratedCodeModal] = useState(false);

    useEffect(() => {
        if (schemaText.trim() === '') {
            setSchema({fields: []});
            setSchemaError(null);
            return;
        }
        try {
            const parsedSchema = JSON.parse(schemaText);
            if (!parsedSchema.fields) {
                setSchemaError('Invalid schema: missing fields property');
                return;
            }

            const initializedFields = parsedSchema.fields.map((field: FieldSchema, index: number) => {
                const currentLayout = field.layout || {};
                return {
                    ...field,
                    layout: {
                        row: currentLayout.row ?? index,
                        col: currentLayout.col ?? 0,
                        rowSpan: currentLayout.rowSpan ?? 1,
                        colSpan: currentLayout.colSpan ?? 1,
                        colSpanXs: currentLayout.colSpanXs,
                        colSpanSm: currentLayout.colSpanSm,
                        colSpanMd: currentLayout.colSpanMd,
                        colSpanLg: currentLayout.colSpanLg,
                        colSpanXl: currentLayout.colSpanXl,
                    }
                };
            });

            setSchema({...parsedSchema, fields: initializedFields});
            setSchemaError(null);
        } catch (error) {
            setSchemaError('Invalid JSON schema');
        }
    }, [schemaText]);

    useEffect(() => {
        const generate = async () => {
            if (!schema || schema.fields.length === 0 || !triggerGeneration) {
                setGeneratedCode([]);
                setGenerationError(null);
                return;
            }
            try {
                const files = await generateCode(schema, generationOptions);
                setGeneratedCode(files);
                setGenerationError(null);
            } catch (error: any) {
                setGeneratedCode([]);
                setGenerationError(error.message || "Failed to generate code.");
            } finally {
                setTriggerGeneration(false);
            }
        };
        generate();
    }, [schema, generationOptions, triggerGeneration]);

    return (
        <PanelGroup direction="horizontal">
            <Panel>
                <Paper elevation={3} sx={{p: 2, height: '100%', display: 'flex', flexDirection: 'column', border: '1px solid #ccc'}}>
                    <Typography variant="h5" gutterBottom>
                        Schema Editor
                    </Typography>
                    <Box sx={{flex: 1, minHeight: 0, overflow: 'hidden'}}>
                        <SchemaEditor
                            schemaText={schemaText}
                            onSchemaTextChange={setSchemaText}
                            formData={formData}
                            onFormChange={setFormData}
                        />
                    </Box>
                </Paper>
            </Panel>
            <PanelResizeHandle/>
            <Panel>
                <PanelGroup direction="vertical">
                    <Panel>
                        <Paper elevation={3} sx={{p: 2, height: '100%', display: 'flex', flexDirection: 'column', border: '1px solid #ccc', overflowY: 'auto'}}>
                            <Typography variant="h5" gutterBottom>
                                Form Preview
                            </Typography>
                            {schemaError ? (
                                <Typography color="error">{schemaError}</Typography>
                            ) : (
                                <FormRenderer
                                    schema={schema}
                                    formData={formData}
                                    onFormChange={setFormData}
                                    onValidate={setFormErrors}
                                    formErrors={formErrors}
                                />
                            )}
                        </Paper>
                    </Panel>
                    <PanelResizeHandle/>
                    <Panel collapsible={true}>
                        <Paper elevation={3} sx={{p: 2, height: '100%', display: 'flex', flexDirection: 'column', border: '1px solid #ccc'}}>
                            <Typography variant="h5" gutterBottom>
                                Generated Code
                            </Typography>
                            <Box sx={{mb: 2, display: 'flex', gap: 2}}>
                                <Select
                                    value={generationOptions.framework}
                                    onChange={(e) => setGenerationOptions(prev => ({...prev, framework: e.target.value}))}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Select framework' }}
                                >
                                    <MenuItem value="react">React</MenuItem>
                                    <MenuItem value="vue">Vue</MenuItem>
                                </Select>
                                <Select
                                    value={generationOptions.uiLibrary}
                                    onChange={(e) => setGenerationOptions(prev => ({...prev, uiLibrary: e.target.value}))}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Select UI Library' }}
                                >
                                    <MenuItem value="tailwind">Tailwind CSS</MenuItem>
                                    <MenuItem value="mui">Material-UI</MenuItem>
                                </Select>
                                <Button variant="contained" onClick={() => setTriggerGeneration(true)}>
                                    Generate Code
                                </Button>
                                <Button variant="outlined" onClick={() => setShowGeneratedCodeModal(true)} disabled={generatedCode.length === 0 && !generationError}>
                                    View Generated Code
                                </Button>
                            </Box>
                            {generationError ? (
                                <Typography color="error">{generationError}</Typography>
                            ) : (
                                <Typography>Click 'View Generated Code' to see the output.</Typography>
                            )}
                        </Paper>
                    </Panel>
                </PanelGroup>
            </Panel>
            <GeneratedCodeModal
                open={showGeneratedCodeModal}
                onClose={() => setShowGeneratedCodeModal(false)}
                generatedFiles={generatedCode}
                generationError={generationError}
            />
        </PanelGroup>
    );
}

export default Home;
