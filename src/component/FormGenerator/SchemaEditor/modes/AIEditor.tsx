import {Button, Checkbox, FormControlLabel, FormGroup, TextField} from "@mui/material";
import {useState} from "react";
import {FormSchema} from "../../../../interfaces";

interface AIEditorProps {
    onGenerateSchema: (schema: FormSchema) => void;
}

function AIEditor({onGenerateSchema}: AIEditorProps) {
    const [text, setText] = useState('');
    const [requiredFields, setRequiredFields] = useState(false);
    const [defaultValues, setDefaultValues] = useState(false);
    const [validationRules, setValidationRules] = useState(false);

    const handleGenerate = async () => {
        // Simulate API call to LLM
        const mockGeneratedSchema: FormSchema = {
            fields: [
                {
                    name: "name",
                    label: "Name",
                    type: "text",
                    required: requiredFields,
                    placeholder: "Enter your name",
                    validation: validationRules ? { minLength: 3 } : undefined,
                    defaultValue: defaultValues ? "John Doe" : undefined,
                },
                {
                    name: "email",
                    label: "Email",
                    type: "email",
                    required: requiredFields,
                    placeholder: "Enter your email",
                    validation: validationRules ? { pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$" } : undefined,
                    defaultValue: defaultValues ? "john.doe@example.com" : undefined,
                },
                {
                    name: "message",
                    label: "Message",
                    type: "text",
                    required: requiredFields,
                    placeholder: "Enter your message",
                    validation: validationRules ? { maxLength: 500 } : undefined,
                },
                {
                    name: "subscribe",
                    label: "Subscribe to newsletter",
                    type: "checkbox",
                    defaultValue: defaultValues ? true : false,
                },
            ],
        };
        onGenerateSchema(mockGeneratedSchema);
    };

    return (
        <div style={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 2}}>
            <TextField
                multiline
                rows={4}
                fullWidth
                label="Describe your form"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <FormGroup>
                <FormControlLabel control={<Checkbox checked={requiredFields} onChange={(e) => setRequiredFields(e.target.checked)}/>} label="Required fields"/>
                <FormControlLabel control={<Checkbox checked={defaultValues} onChange={(e) => setDefaultValues(e.target.checked)}/>} label="Default values"/>
                <FormControlLabel control={<Checkbox checked={validationRules} onChange={(e) => setValidationRules(e.target.checked)}/>} label="Validation rules"/>
            </FormGroup>
            <Button onClick={handleGenerate}>Generate</Button>
        </div>
    );
}

export default AIEditor;
