import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Tab, Tabs } from "@mui/material";
import { useState } from "react";

interface ExportCodeDialogProps {
  open: boolean;
  onClose: () => void;
  code: string;
}

function ExportCodeDialog({ open, onClose, code }: ExportCodeDialogProps) {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Export Form</DialogTitle>
      <DialogContent>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="React Component" />
        </Tabs>
        {tabValue === 0 && (
          <div>
            <pre>{code}</pre>
            <Button onClick={() => handleCopy(code)}>Copy</Button>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ExportCodeDialog;
