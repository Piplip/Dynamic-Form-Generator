import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Box } from "@mui/material";

interface OptionsDialogProps {
  open: boolean;
  onClose: () => void;
  options: { label: string; value: string }[];
  onOptionsChange: (options: { label: string; value: string }[]) => void;
}

function OptionsDialog({ open, onClose, options, onOptionsChange }: OptionsDialogProps) {
  const handleAddOption = () => {
    onOptionsChange([...options, { label: '', value: '' }]);
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    onOptionsChange(newOptions);
  };

  const handleOptionChange = (index: number, option: { label: string; value: string }) => {
    const newOptions = [...options];
    newOptions[index] = option;
    onOptionsChange(newOptions);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Options</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          {options.map((option, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                label="Label"
                value={option.label}
                onChange={(e) => handleOptionChange(index, { ...option, label: e.target.value })}
              />
              <TextField
                label="Value"
                value={option.value}
                onChange={(e) => handleOptionChange(index, { ...option, value: e.target.value })}
              />
              <Button onClick={() => handleRemoveOption(index)}>Remove</Button>
            </Box>
          ))}
          <Button onClick={handleAddOption}>Add Option</Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default OptionsDialog;
