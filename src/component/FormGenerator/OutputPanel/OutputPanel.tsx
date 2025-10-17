import { useState } from "react";
import {FieldSchema} from "../../../interfaces";
import ExportDialog from "./ExportDialog.tsx";

interface OutputPanelProps {
    data: Record<string, any>;
    errors: Record<string, string>;
    schema: FieldSchema[];
}

function OutputPanel({data, errors, schema}: OutputPanelProps) {
    const [open, setOpen] = useState(false);
    const [htmlCode, setHtmlCode] = useState('');
    const [jsCode, setJsCode] = useState('');

    const handleExport = () => {
        const generatedHtmlCode = `
<html>
<head>
    <title>Generated Form</title>
    <link rel="stylesheet" href="form.css">
</head>
<body>
    <form id="generated-form">
        ${schema.map(field => {
            switch (field.type) {
                case 'text':
                case 'email':
                case 'number':
                    return `<label for="${field.name}">${field.label}</label><br>\n<input type="${field.type}" id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''}><br><br>\n`;
                case 'select':
                    return `<label for="${field.name}">${field.label}</label><br>\n<select id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''}>\n${field.options?.map(option => `<option value="${option.value}">${option.label}</option>`).join('\n')}\n</select><br><br>\n`;
                case 'checkbox':
                    return `<input type="checkbox" id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''}>\n<label for="${field.name}">${field.label}</label><br><br>\n`;
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
        setOpen(true);
    };

    return (
        <div>
            <button onClick={handleExport}>Export</button>
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
            <ExportDialog open={open} onClose={() => setOpen(false)} htmlCode={htmlCode} jsCode={jsCode} />
        </div>
    );
}

export default OutputPanel;

