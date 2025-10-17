import {SyntheticEvent, useState} from "react";
import {Tab, Tabs} from "@mui/material";
import ManualEditor from "./modes/ManualEditor";
import UIEditor from "./modes/UIEditor";
import AIEditor from "./modes/AIEditor";
import {FormSchema} from "../../../interfaces";

interface SchemaEditorProps {
    schemaText: string;
    onSchemaTextChange: (text: string) => void;
    formData: Record<string, any>;
    onFormChange: (data: Record<string, any>) => void;
}

function SchemaEditor({schemaText, onSchemaTextChange, formData, onFormChange}: SchemaEditorProps) {
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event: SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const schema: FormSchema = JSON.parse(schemaText || '{"fields": []}');

    const handleSchemaChange = (newSchema: FormSchema) => {
        onSchemaTextChange(JSON.stringify(newSchema, null, 2));
    };

    return (
        <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
            <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label="Manual"/>
                <Tab label="UI"/>
                <Tab label="AI"/>
            </Tabs>
            <div style={{flex: 1, display: 'flex', minHeight: 0, overflow: 'hidden', width: '100%'}}>
                {tabValue === 0 && (
                    <ManualEditor schemaText={schemaText} onSchemaTextChange={onSchemaTextChange}/>
                )}
                {tabValue === 1 && (
                    <UIEditor schema={schema} onSchemaChange={handleSchemaChange} formData={formData}
                              onFormChange={onFormChange}/>
                )}
                {tabValue === 2 && (
                    <AIEditor onGenerateSchema={handleSchemaChange}/>
                )}
            </div>
        </div>
    );
}

export default SchemaEditor;

