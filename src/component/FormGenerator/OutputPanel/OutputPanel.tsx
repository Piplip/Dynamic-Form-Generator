import { useState } from "react";
import {FormSchema} from "../../../interfaces";
import ExportDialog from "./ExportDialog.tsx";
import {generateCode} from "../../../utils/codeGenerator";
import ExportCodeDialog from "./ExportCodeDialog.tsx";
import {Select, MenuItem} from "@mui/material";

interface OutputPanelProps {
    data: Record<string, any>;
    errors: Record<string, string>;
    schema: FormSchema;
}

function OutputPanel({data, errors, schema}: OutputPanelProps) {
    const [openHtmlJs, setOpenHtmlJs] = useState(false);
    const [openCode, setOpenCode] = useState(false);
    const [htmlCode, setHtmlCode] = useState('');
    const [jsCode, setJsCode] = useState('');
    const [generatedCode, setGeneratedCode] = useState('');
    const [technology, setTechnology] = useState<"react" | "vue" | "angular">("react");

    const handleExportHtmlJs = () => {
        const generatedHtmlCode = `
<html>
<head>
    <title>Generated Form</title>
    <link rel="stylesheet" href="form.css">
</head>
<body>
    <form id="generated-form">
        ${schema.fields.map(field => {
            switch (field.type) {
                case 'text':
                case 'email':
                case 'number':
                    return `<label for="${field.name}">${field.label}</label><br>\n<input type="${field.type}" id="${field.name}" name="${field.name}" ${field.validation?.required ? 'required' : ''}><br><br>\n`;
                case 'select':
                    return `<label for="${field.name}">${field.label}</label><br>\n<select id="${field.name}" name="${field.name}" ${field.validation?.required ? 'required' : ''}>\n${field.options?.map(option => `<option value="${option.value}">${option.label}</option>`).join('\n')}\n</select><br><br>\n`;
                case 'checkbox':
                    return `<input type="checkbox" id="${field.name}" name="${field.name}" ${field.validation?.required ? 'required' : ''}>\n<label for="${field.name}">${field.label}</label><br><br>\n`;
                case 'date':
                    return `<label for="${field.name}">${field.label}</label><br>\n<input type="date" id="${field.name}" name="${field.name}" ${field.validation?.required ? 'required' : ''}><br><br>\n`;
                default:
                    return '';
            }
        }).join('')}
        <button type="submit">Submit</button>
    </form>

    <script src="form.js"></script>
</body>
</html>
`;

        const generatedJsCode = `
const form = document.getElementById('generated-form');
const formData = {};

form.addEventListener('input', (e) => {
    const target = e.target;
    if (target.type === 'checkbox') {
        formData[target.name] = target.checked;
    } else {
        formData[target.name] = target.value;
    }
    console.log(formData);
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    // TODO: Add validation
    console.log('Form submitted:', formData);
});
`;

        setHtmlCode(generatedHtmlCode);
        setJsCode(generatedJsCode);
        setOpenHtmlJs(true);
    };

    const handleExportCode = () => {
        const code = generateCode(schema, technology);
        setGeneratedCode(code);
        setOpenCode(true);
    };

    return (
        <div>
            <button onClick={handleExportHtmlJs}>Export HTML/JS</button>
            <Select
                value={technology}
                onChange={(e) => setTechnology(e.target.value as "react" | "vue" | "angular")}
            >
                <MenuItem value="react">React</MenuItem>
                <MenuItem value="vue" disabled>Vue</MenuItem>
                <MenuItem value="angular" disabled>Angular</MenuItem>
            </Select>
            <button onClick={handleExportCode}>Export Code</button>
            <h2>Form Data</h2>
            <pre>{JSON.stringify(data, null, 2)}</pre>
            {Object.keys(errors).length > 0 && (
                <div>
                    <h2>Errors</h2>
                    <ul>
                        {Object.entries(errors).map(([field, error]) => (
                            <li key={field}>
                                <strong>{field}:</strong> {error}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <ExportDialog open={openHtmlJs} onClose={() => setOpenHtmlJs(false)} htmlCode={htmlCode} jsCode={jsCode} />
            <ExportCodeDialog open={openCode} onClose={() => setOpenCode(false)} code={generatedCode} />
        </div>
    );
}

export default OutputPanel;
