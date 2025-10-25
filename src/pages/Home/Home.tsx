import { useEffect, useState, useCallback } from "react";
import { FieldSchema, FormSchema } from "../../interfaces";
import SchemaEditor from "../../component/FormGenerator/SchemaEditor/SchemaEditor";
import FormRenderer from "../../component/FormGenerator/FormRenderer/FormRenderer";
import {
    Box,
    Button,
    MenuItem,
    Paper,
    Select,
    Typography,
    CircularProgress,
    TextField,
    SelectChangeEvent,
} from "@mui/material";
import {
    Panel,
    PanelGroup,
    PanelResizeHandle,
} from "react-resizable-panels";
import { generateCode, GenerationOptions } from "../../code-generator";
import { GeneratedFile } from "../../code-generator/types";
import GeneratedCodeModal from "../../component/FormGenerator/OutputPanel/GeneratedCodeModal";
import { useAlert } from "../../hooks/useAlert";
import {suggestGenerationOptions} from "../../utils/ai.ts";

// --- TYPE DEFINITIONS & CONSTANTS ---

// Helper type for cleaner setState functions with specific keys
type GenerationOptionKey = keyof Omit<GenerationOptions, 'language'> | 'language';

// Default options for cleaner state initialization
const DEFAULT_GENERATION_OPTIONS: GenerationOptions = {
    framework: "react",
    language: "typescript",
    uiLibrary: "Tailwind",
    stateManagement: "React-Hook-Form",
    validation: "Zod",
};

const COMPATIBLE_OPTIONS = {
    "react": {
        uiLibraries: ["Tailwind", "MUI"],
        stateManagement: ["React-Hook-Form", "Formik"],
        validation: ["Zod", "Yup"],
    },
    "vue": {
        uiLibraries: ["Tailwind", "Quasar"],
        stateManagement: ["Vuex", "Pinia"],
        validation: ["Vee-validate", "Vuelidate"],
    },
    "angular": {
        uiLibraries: ["Material", "Bootstrap"],
        stateManagement: ["Ngrx", "Ngxs"],
        validation: ["Forms"],
    },
};

// --- UTILITY FUNCTION (Extracted for cleaner useEffect) ---

/**
 * Safely parses the JSON schema text and initializes default layout properties.
 * @param schemaText The raw JSON schema string.
 * @returns The parsed and initialized FormSchema, or null if parsing fails.
 */
function parseAndInitializeSchema(schemaText: string): FormSchema | null {
    if (schemaText.trim() === '') {
        return { fields: [] };
    }

    try {
        const parsedSchema = JSON.parse(schemaText) as FormSchema;

        if (!parsedSchema.fields || !Array.isArray(parsedSchema.fields)) {
            // Note: The original error check was slightly too simple.
            // Returning null/throwing here allows the caller to handle the error.
            return null;
        }

        const initializedFields: FieldSchema[] = parsedSchema.fields.map((field, index) => {
            // Ensure field has the correct type structure, even if it's missing entirely
            const currentField = field as FieldSchema;
            const currentGrid = currentField.grid || {};

            // Initialize defaults for the layout/grid properties
            return {
                ...currentField,
                // Using nullish coalescing for cleaner defaults
                grid: {
                    xs: currentGrid.xs ?? 12, // Assuming a 12-column default for xs
                    sm: currentGrid.sm,
                    md: currentGrid.md,
                    lg: currentGrid.lg,
                    xl: currentGrid.xl,
                }
            };
        });

        // Use spread to ensure any other top-level properties are preserved
        return { ...parsedSchema, fields: initializedFields };
    } catch (error) {
        return null; // Invalid JSON
    }
}

// --- REACT COMPONENT ---

function Home() {
    // STATE DECLARATIONS
    const [schemaText, setSchemaText] = useState<string>('');
    const [schema, setSchema] = useState<FormSchema>({ fields: [] });
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [schemaError, setSchemaError] = useState<string | null>(null);
    const [generationOptions, setGenerationOptions] = useState<GenerationOptions>(DEFAULT_GENERATION_OPTIONS);
    const [generatedCode, setGeneratedCode] = useState<GeneratedFile[]>([]);
    const [generationError, setGenerationError] = useState<string | null>(null);
    const [triggerGeneration, setTriggerGeneration] = useState(false);
    const [showGeneratedCodeModal, setShowGeneratedCodeModal] = useState(false);
    const [isGeneratingCode, setIsGeneratingCode] = useState(false);
    const [suggestionDescription, setSuggestionDescription] = useState('');

    const { showAlert } = useAlert();

    // --- HANDLERS & MEMOIZED CALLBACKS ---

    /**
     * Generic handler for updating generation options from Select inputs.
     */
    const handleOptionChange = useCallback((key: GenerationOptionKey) => (e: SelectChangeEvent<unknown>) => {
        const newValue = e.target.value;
        setGenerationOptions(prev => {
            const newOptions = { ...prev, [key]: newValue };

            // If framework changes, reset other options to compatible defaults
            if (key === 'framework') {
                const compatible = COMPATIBLE_OPTIONS[newValue as keyof typeof COMPATIBLE_OPTIONS];
                if (compatible) {
                    return {
                        ...newOptions,
                        uiLibrary: compatible.uiLibraries[0],
                        stateManagement: compatible.stateManagement[0],
                        validation: compatible.validation[0],
                    };
                }
            }
            return newOptions;
        });
    }, []);

    const handleSuggestOptions = useCallback(async () => {
        if (!suggestionDescription.trim()) {
            showAlert('Please provide a description for AI suggestion.', 'warning', 2000);
            return;
        }

        // Indicate loading or disable button if needed (optional for suggestion)

        try {
            const suggestedOptions = await suggestGenerationOptions(suggestionDescription);
            setGenerationOptions(suggestedOptions);
            showAlert('AI suggested options applied! 🎉', 'success', 2000);
        } catch (error: any) {
            showAlert(error.message || 'Failed to get AI suggestions.', 'error', 2000);
        }
    }, [suggestionDescription, showAlert]);

    // --- EFFECTS ---

    /**
     * Effect to parse and validate the schema whenever schemaText changes.
     */
    useEffect(() => {
        const result = parseAndInitializeSchema(schemaText);

        if (result === null) {
            // Parsing failed (invalid JSON or missing fields)
            const errorMessage = schemaText.trim() === ''
                ? null // Clear error if text is empty
                : 'Invalid JSON schema or missing/invalid "fields" property.';

            setSchema({ fields: [] });
            setSchemaError(errorMessage);
            if (errorMessage) {
                showAlert(errorMessage, 'error', 2000);
            }
        } else {
            // Parsing succeeded
            setSchema(result);
            setSchemaError(null);
        }
    }, [schemaText, showAlert]);

    /**
     * Effect to trigger code generation.
     */
    useEffect(() => {
        const generate = async () => {
            // Only proceed if the trigger is set, a schema exists, and it has fields.
            if (!triggerGeneration || schemaError || schema.fields.length === 0) {
                setGeneratedCode([]);
                setGenerationError(null);
                return;
            }

            setIsGeneratingCode(true);
            setTriggerGeneration(false);

            try {
                const files = await generateCode(schema, generationOptions);
                setGeneratedCode(files);
                setGenerationError(null);
                showAlert('Code generated successfully!', 'success', 2000);
            } catch (error: any) {
                setGeneratedCode([]);
                setGenerationError(error.message || "Failed to generate code.");
                showAlert(error.message || "Failed to generate code.", 'error', 2000);
            } finally {
                setIsGeneratingCode(false);
            }
        };

        // Only call generate if triggerGeneration is true.
        if (triggerGeneration) {
            generate();
        }
    }, [schema, generationOptions, triggerGeneration, schemaError, showAlert]);


    // --- RENDER LOGIC ---

    return (
        <PanelGroup direction="horizontal">
            {/* Schema Editor Panel */}
            <Panel defaultSize={30} minSize={20}>
                <Paper elevation={3} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', border: '1px solid #ccc' }}>
                    <Typography variant="h5" gutterBottom>Schema Editor</Typography>
                    <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
                        <SchemaEditor
                            schemaText={schemaText}
                            onSchemaTextChange={setSchemaText}
                            formData={formData}
                            onFormChange={setFormData}
                        />
                    </Box>
                </Paper>
            </Panel>

            <PanelResizeHandle />

            {/* Preview & Output Panel Group */}
            <Panel>
                <PanelGroup direction="vertical">
                    {/* Form Preview Panel */}
                    <Panel defaultSize={40} minSize={20}>
                        <Paper elevation={3} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', border: '1px solid #ccc', overflowY: 'auto' }}>
                            <Typography variant="h5" gutterBottom>Form Preview</Typography>
                                                        {schemaError ? (
                                                            <Box sx={{ p: 2, color: 'error.main' }}>Error: {schemaError}</Box>
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

                                                <PanelResizeHandle />

                                                {/* Code Generation Panel */}
                                                <Panel collapsible={true} minSize={20}>
                                                    <Paper elevation={3} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', border: '1px solid #ccc' }}>
                                                        <Typography variant="h5" gutterBottom>Code Generation</Typography>

                                                        {/* Options Selectors */}
                                                        <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                                                                            <Select
                                                                                                value={generationOptions.framework}
                                                                                                onChange={handleOptionChange('framework')}
                                                                                                displayEmpty
                                                                                                inputProps={{ 'aria-label': 'Select framework' }}
                                                                                                sx={{ minWidth: 120 }}
                                                                                            >
                                                                                                <MenuItem value="react">React</MenuItem>
                                                                                                <MenuItem value="vue">Vue</MenuItem>
                                                                                                <MenuItem value="angular">Angular</MenuItem>
                                                                                            </Select>
                                                                                            <Select
                                                                                                value={generationOptions.language}
                                                                                                onChange={handleOptionChange('language') as (e: SelectChangeEvent<string>) => void} // Cast for MUI Select compatibility
                                                                                                displayEmpty
                                                                                                inputProps={{ 'aria-label': 'Select language' }}
                                                                                                sx={{ minWidth: 120 }}
                                                                                            >
                                                                                                <MenuItem value="typescript">TypeScript</MenuItem>
                                                                                                <MenuItem value="javascript">JavaScript</MenuItem>
                                                                                            </Select>
                                                                                            <Select
                                                                                                value={generationOptions.uiLibrary}
                                                                                                onChange={handleOptionChange('uiLibrary')}
                                                                                                displayEmpty
                                                                                                inputProps={{ 'aria-label': 'Select UI Library' }}
                                                                                                sx={{ minWidth: 120 }}
                                                                                            >
                                                                                                {COMPATIBLE_OPTIONS[generationOptions.framework as keyof typeof COMPATIBLE_OPTIONS]?.uiLibraries.map(lib => (
                                                                                                    <MenuItem sx={{textTransform: 'capitalize'}}
                                                                                                        key={lib} value={lib}>{lib}</MenuItem>
                                                                                                ))}
                                                                                            </Select>
                                                                                            <Select
                                                                                                value={generationOptions.stateManagement}
                                                                                                onChange={handleOptionChange('stateManagement')}
                                                                                                displayEmpty
                                                                                                inputProps={{ 'aria-label': 'Select State Management' }}
                                                                                                sx={{ minWidth: 120 }}
                                                                                            >
                                                                                                {COMPATIBLE_OPTIONS[generationOptions.framework as keyof typeof COMPATIBLE_OPTIONS]?.stateManagement.map(sm => (
                                                                                                    <MenuItem sx={{textTransform: 'capitalize'}}
                                                                                                        key={sm} value={sm}>{sm}</MenuItem>
                                                                                                ))}
                                                                                            </Select>
                                                                                            <Select
                                                                                                value={generationOptions.validation}
                                                                                                onChange={handleOptionChange('validation')}
                                                                                                displayEmpty
                                                                                                inputProps={{ 'aria-label': 'Select Validation' }}
                                                                                                sx={{ minWidth: 120 }}
                                                                                            >
                                                                                                {COMPATIBLE_OPTIONS[generationOptions.framework as keyof typeof COMPATIBLE_OPTIONS]?.validation.map(val => (
                                                                                                    <MenuItem
                                                                                                        sx={{textTransform: 'capitalize'}}
                                                                                                        key={val} value={val}>{val}</MenuItem>
                                                                                                ))}
                                                                                            </Select>                                                            <Button
                                                                variant="contained"
                                                                onClick={() => setTriggerGeneration(true)}
                                                                disabled={isGeneratingCode || !!schemaError || schema.fields.length === 0}
                                                                sx={{ minWidth: 150 }}
                                                            >
                                                                {isGeneratingCode ? <CircularProgress size={24} color="inherit" /> : "Generate Code"}
                                                            </Button>

                                                            <Button
                                                                variant="outlined"
                                                                onClick={() => setShowGeneratedCodeModal(true)}
                                                                disabled={generatedCode.length === 0}
                                                                sx={{ minWidth: 150 }}
                                                            >
                                                                View Generated Code
                                                            </Button>
                                                        </Box>

                                                        {/* AI Suggestion Input */}
                                                        <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
                                                            <TextField
                                                                fullWidth
                                                                label="Describe desired code generation options for AI suggestion"
                                                                value={suggestionDescription}
                                                                onChange={(e) => setSuggestionDescription(e.target.value)}
                                                                size="small"
                                                            />
                                                            <Button variant="outlined" onClick={() => { handleSuggestOptions(); setTriggerGeneration(true); }} sx={{ minWidth: 150 }}>
                                                                Suggest Options
                                                            </Button>
                                                        </Box>

                                                        {/* Status Message */}
                                                        <Box>
                                                            {generationError ? (
                                                                <Typography color="error" component="div">
                                                                    <Typography component="span" fontWeight="bold">Generation Failed:</Typography> {generationError}
                                                                </Typography>
                                                            ) : generatedCode.length > 0 ? (
                                                                <Typography color="success.main">Code successfully generated. Click 'View Generated Code'.</Typography>
                                                            ) : (
                                                                <Typography color="text.secondary">Configure options and click 'Generate Code' to begin.</Typography>
                                                            )}
                                                        </Box>
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