import {useEffect, useState} from "react";
import {FormSchema} from "../../interfaces";
import SchemaEditor from "../../component/FormGenerator/SchemaEditor/SchemaEditor";
import FormRenderer from "../../component/FormGenerator/FormRenderer/FormRenderer";
import {Box, Paper, Typography} from "@mui/material";
import OutputPanel from "../../component/FormGenerator/OutputPanel/OutputPanel.tsx";
import {
    Panel,
    PanelGroup,
    PanelResizeHandle,
} from "react-resizable-panels";

function Home() {
    const [schemaText, setSchemaText] = useState<string>('');
    const [schema, setSchema] = useState<FormSchema>({fields: []});
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [schemaError, setSchemaError] = useState<string | null>(null);

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
            setSchema(parsedSchema);
            setSchemaError(null);
        } catch (error) {
            setSchemaError('Invalid JSON schema');
        }
    }, [schemaText]);

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
                        <Paper elevation={3} sx={{p: 2, height: '100%', border: '1px solid #ccc'}}>
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
                        <Paper elevation={3} sx={{p: 2, height: '100%', border: '1px solid #ccc'}}>
                            <Typography variant="h5" gutterBottom>
                                JSON Output
                            </Typography>
                            <OutputPanel data={formData} errors={formErrors} schema={schema}/>
                        </Paper>
                    </Panel>
                </PanelGroup>
            </Panel>
        </PanelGroup>
    );
}

export default Home;
