import React, {useState} from 'react';
import {Alert, AppBar, Box, Button, IconButton, Modal, Snackbar, Tab, Tabs, Toolbar, Typography} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import {GeneratedFile} from "../../../code-generator/types";

interface GeneratedCodeModalProps {
  open: boolean;
  onClose: () => void;
  generatedFiles: GeneratedFile[];
  generationError: string | null;
}

function TabPanel(props: { children?: React.ReactNode; index: number; value: number }) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const GeneratedCodeModal: React.FC<GeneratedCodeModalProps> = ({
  open, onClose, generatedFiles, generationError
}) => {
  const [value, setValue] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="generated-code-modal-title"
      aria-describedby="generated-code-modal-description"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90vw',
        maxWidth: '1200px',
        height: '90vh',
        bgcolor: 'background.paper',
        boxShadow: 24,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '8px',
        overflow: 'hidden',
      }}>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Generated Code
            </Typography>
            <IconButton
              edge="end"
              color="inherit"
              onClick={onClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        {generationError ? (
          <Box sx={{ p: 3 }}>
            <Alert severity="error">Error generating code: {generationError}</Alert>
          </Box>
        ) : generatedFiles.length === 0 ? (
          <Box sx={{ p: 3 }}>
            <Typography>No code generated. Please check your schema and options.</Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={value} onChange={handleChange} aria-label="Generated code tabs" variant="scrollable" scrollButtons="auto">
                {generatedFiles.map((file, index) => (
                  <Tab label={file.fileName} {...a11yProps(index)} key={file.fileName} />
                ))}
              </Tabs>
            </Box>
            {generatedFiles.map((file, index) => (
              <TabPanel value={value} index={index} key={file.fileName}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<FileCopyIcon />}
                    onClick={() => handleCopy(file.content)}
                  >
                    Copy Code
                  </Button>
                </Box>
                <Box sx={{ maxHeight: 'calc(90vh - 200px)', overflowY: 'auto', border: '1px solid #ddd', borderRadius: '4px' }}>
                  <pre style={{ margin: 0, padding: '16px', whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontSize: '0.85rem' }}>
                    {file.content}
                  </pre>
                </Box>
              </TabPanel>
            ))}
          </>
        )}

        <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
            Code copied to clipboard!
          </Alert>
        </Snackbar>
      </Box>
    </Modal>
  );
};

export default GeneratedCodeModal;
