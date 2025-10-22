import { GeneratedFile } from "../../code-generator/types";
import { Box, Typography } from "@mui/material";

interface OutputPanelProps {
    generatedFiles: GeneratedFile[];
    generationError: string | null;
}

function OutputPanel({ generatedFiles, generationError }: OutputPanelProps) {
    if (generationError) {
        return <Typography color="error">Error: {generationError}</Typography>;
    }

    if (!generatedFiles || generatedFiles.length === 0) {
        return <Typography>Generate code to see output here.</Typography>;
    }

    return (
        <Box sx={{ height: '100%', overflowY: 'auto' }}>
            {generatedFiles.map((file, index) => (
                <Box key={index} sx={{ mb: 2, border: '1px solid #eee', borderRadius: '4px', p: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{file.fileName}</Typography>
                    <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', backgroundColor: '#f5f5f5', padding: '8px', borderRadius: '4px' }}>
                        {file.content}
                    </pre>
                </Box>
            ))}
        </Box>
    );
}

export default OutputPanel;
