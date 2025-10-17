interface ManualEditorProps {
    schemaText: string;
    onSchemaTextChange: (text: string) => void;
}

function ManualEditor({schemaText, onSchemaTextChange}: ManualEditorProps) {
    return (
        <textarea
            value={schemaText}
            onChange={(e) => onSchemaTextChange(e.target.value)}
            style={{ width: '100%', height: '100%', resize: 'none'}}
        />
    );
}

export default ManualEditor;
