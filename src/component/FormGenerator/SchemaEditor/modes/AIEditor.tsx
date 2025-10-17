import {Button, Checkbox, FormControlLabel, FormGroup, TextField} from "@mui/material";
import {useState} from "react";

function AIEditor() {
    const [text, setText] = useState('');

    const handleGenerate = () => {
        // TODO: Implement AI generation
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
                <FormControlLabel control={<Checkbox/>} label="Required fields"/>
                <FormControlLabel control={<Checkbox/>} label="Default values"/>
                <FormControlLabel control={<Checkbox/>} label="Validation rules"/>
            </FormGroup>
            <Button onClick={handleGenerate}>Generate</Button>
        </div>
    );
}

export default AIEditor;
