import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Tab, Tabs } from "@mui/material";
import { useState } from "react";

interface ExportDialogProps {
  open: boolean;
  onClose: () => void;
  htmlCode: string;
  jsCode: string;
}

function ExportDialog({ open, onClose, htmlCode, jsCode }: ExportDialogProps) {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  const handleDownload = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = () => {
    // TODO: Implement zip download
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Export Form</DialogTitle>
      <DialogContent>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="HTML" />
          <Tab label="JavaScript" />
        </Tabs>
        {tabValue === 0 && (
          <div>
            <pre>{htmlCode}</pre>
            <Button onClick={() => handleCopy(htmlCode)}>Copy</Button>
          </div>
        )}
        {tabValue === 1 && (
          <div>
            <pre>{jsCode}</pre>
            <Button onClick={() => handleCopy(jsCode)}>Copy</Button>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleDownload('form.html', htmlCode)}>Download form.html</Button>
        <Button onClick={handleDownloadAll}>Download all</Button>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ExportDialog;