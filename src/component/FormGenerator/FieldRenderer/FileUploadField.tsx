import {FieldSchema} from "../../../interfaces";
import {CSSProperties, useState, useCallback, useRef} from "react";

interface FieldRendererProps {
    field: FieldSchema;
    value: any;
    onChange: (value: any) => void;
    error?: string;
    theme?: FormTheme;
}

function FileUploadField({field, value, onChange, error, theme}: FieldRendererProps) {
    const {label, name, disabled, fileLayout} = field;
    const {preset, accept, multiple, maxSize, maxFiles, showFileList} = fileLayout || {};

    const [selectedFiles, setSelectedFiles] = useState<File[]>(value || []);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateFile = (file: File) => {
        if (accept) {
            const acceptedTypes = accept.split(',').map(type => type.trim());
            const fileType = file.type || '';
            const fileExtension = '.' + file.name.split('.').pop();

            const isAccepted = acceptedTypes.some(type => {
                if (type.endsWith('/*')) {
                    return fileType.startsWith(type.replace('/*', ''));
                } else if (type.startsWith('.')) {
                    return fileExtension.toLowerCase() === type.toLowerCase();
                }
                return fileType === type;
            });

            if (!isAccepted) {
                return `File type not accepted: ${file.name}`;
            }
        }
        if (maxSize && file.size > maxSize) {
            return `File size exceeds ${maxSize / (1024 * 1024)}MB: ${file.name}`;
        }
        return null;
    };

    const handleFiles = useCallback((files: FileList | null) => {
        if (!files) return;

        let newFiles = Array.from(files);
        let currentErrors: string[] = [];

        newFiles = newFiles.filter(file => {
            const validationError = validateFile(file);
            if (validationError) {
                currentErrors.push(validationError);
                return false;
            }
            return true;
        });

        if (!multiple) {
            newFiles = newFiles.slice(0, 1);
        }

        if (maxFiles && (selectedFiles.length + newFiles.length) > maxFiles) {
            currentErrors.push(`Exceeded maximum number of files (${maxFiles})`);
            newFiles = newFiles.slice(0, maxFiles - selectedFiles.length);
        }

        const updatedFiles = multiple ? [...selectedFiles, ...newFiles] : newFiles;
        setSelectedFiles(updatedFiles);
        onChange(updatedFiles);

        if (currentErrors.length > 0) {
            // This would ideally be handled by a more robust error display mechanism
            console.error("File Upload Errors:", currentErrors);
        }
    }, [selectedFiles, onChange, multiple, accept, maxSize, maxFiles]);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        handleFiles(e.target.files);
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Clear input to allow re-uploading same file
        }
    }, [handleFiles]);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (disabled) return;
        handleFiles(e.dataTransfer.files);
    }, [handleFiles, disabled]);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (disabled) return;
        e.dataTransfer.dropEffect = 'copy';
    }, [disabled]);

    const removeFile = useCallback((fileToRemove: File) => {
        const updatedFiles = selectedFiles.filter(file => file !== fileToRemove);
        setSelectedFiles(updatedFiles);
        onChange(updatedFiles);
    }, [selectedFiles, onChange]);

    const commonInputProps = {
        type: "file",
        name: name,
        accept: accept,
        multiple: multiple,
        onChange: handleFileChange,
        disabled: disabled,
        ref: fileInputRef,
    };

    const containerStyle: CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: theme?.layout?.gap || '8px',
        opacity: disabled ? 0.6 : 1,
        pointerEvents: disabled ? 'none' : 'auto',
    };

    const dropzoneStyle: CSSProperties = {
        border: error ? (theme?.color?.errorColor || '2px dashed red') : (theme?.color?.inputBorder ? `2px dashed ${theme.color.inputBorder}` : '2px dashed #ccc'),
        borderRadius: theme?.layout?.borderRadius || '8px',
        padding: theme?.layout?.padding || '20px',
        textAlign: 'center',
        cursor: 'pointer',
        backgroundColor: theme?.color?.inputBackground || '#f9f9f9',
        color: theme?.color?.inputText || '#333',
        transition: 'border-color 0.2s ease-in-out',
    };

    const buttonStyle: CSSProperties = {
        backgroundColor: theme?.button?.primary?.background || '#007bff',
        color: theme?.button?.primary?.text || 'white',
        padding: theme?.layout?.padding || '8px 16px',
        borderRadius: theme?.layout?.borderRadius || '4px',
        border: 'none',
        cursor: 'pointer',
        fontSize: theme?.font?.size || '1rem',
    };

    const fileListItemStyle: CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '4px 0',
        borderBottom: `1px solid ${theme?.color?.inputBorder || '#eee'}`,
        color: theme?.color?.inputText || '#333',
    };

    const removeButtonStyle: CSSProperties = {
        backgroundColor: 'transparent',
        color: theme?.button?.danger?.text || '#dc3545',
        border: 'none',
        cursor: 'pointer'
    };

    const renderFileList = () => {
        if (!showFileList || selectedFiles.length === 0) return null;
        return (
            <div style={{marginTop: '8px', border: `1px solid ${theme?.color?.inputBorder || '#eee'}`, borderRadius: theme?.layout?.borderRadius || '4px', padding: theme?.layout?.padding || '8px'}}>
                <h4 style={{color: theme?.color?.labelColor || '#333'}}>Selected Files:</h4>
                <ul style={{listStyle: 'none', padding: 0}}>
                    {selectedFiles.map((file, idx) => (
                        <li key={idx} style={fileListItemStyle}>
                            <span>{file.name} ({Math.round(file.size / 1024)} KB)</span>
                            <button onClick={() => removeFile(file)} style={removeButtonStyle}>x</button>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    const renderInputArea = () => {
        switch (preset) {
            case 'drag-and-drop':
                return (
                    <div
                        style={dropzoneStyle}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input {...commonInputProps} style={{display: 'none'}}/>
                        <p>Drag 'n' drop files here, or click to select files</p>
                        {error && <p style={{color: theme?.color?.errorColor || 'red'}}>{error}</p>}
                    </div>
                );
            case 'compact':
                return (
                    <label style={{cursor: 'pointer', display: 'inline-block'}}>
                        <input {...commonInputProps} style={{display: 'none'}}/>
                        <span style={{fontSize: '1.5rem'}}>📁</span>
                        {error && <p style={{color: theme?.color?.errorColor || 'red'}}>{error}</p>}
                    </label>
                );
            case 'with-preview': // For now, acts like drag-and-drop with file list
            case 'button-only':
            default:
                return (
                    <label style={buttonStyle}>
                        <input {...commonInputProps} style={{display: 'none'}}/>
                        Upload File
                        {error && <p style={{color: theme?.color?.errorColor || 'red'}}>{error}</p>}
                    </label>
                );
        }
    };

    return (
        <div style={containerStyle}>
            {label && <label style={{fontWeight: theme?.font?.weight || 500, fontSize: theme?.font?.size || '1rem', color: theme?.color?.labelColor || '#333'}}>{label}</label>}
            {renderInputArea()}
            {renderFileList()}
        </div>
    );
}

export default FileUploadField;
