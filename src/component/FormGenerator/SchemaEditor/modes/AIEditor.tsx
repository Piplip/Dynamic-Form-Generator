import {Button, Checkbox, FormControlLabel, FormGroup, TextField, CircularProgress, Typography} from "@mui/material";
import {useState} from "react";
import {FormSchema} from "../../../../interfaces";
import {generateSchemaFromText} from "../../../../utils/ai";

interface AIEditorProps {
    onGenerateSchema: (schema: FormSchema) => void;
}

function AIEditor({onGenerateSchema}: AIEditorProps) {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        setLoading(true);
        setError(null);
        try {
            const generatedSchema = await generateSchemaFromText(text);
            onGenerateSchema(generatedSchema);
        } catch (error) {
            setError("Failed to generate schema. Please try again.");
            console.error(error);
        } finally {
            setLoading(false);
        }
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
            <Button onClick={handleGenerate} disabled={loading}>
                {loading ? <CircularProgress size={24} /> : "Generate"}
            </Button>
            {error && <Typography color="error">{error}</Typography>}
        </div>
    );
}

export default AIEditor;
