import {CSSProperties} from "react";

export interface BaseFieldLayout {
    row?: number;
    col?: number;
    rowSpan?: number;
    colSpan?: number;
    colSpanXs?: number;
    colSpanSm?: number;
    colSpanMd?: number;
    colSpanLg?: number;
    colSpanXl?: number;
    width?: number | string;
    height?: number | string;
}

export interface InputFieldLayout extends BaseFieldLayout {
    labelPlacement?: 'top' | 'left' | 'inside' | 'hidden';
    variant?: 'outlined' | 'filled' | 'standard';
    size?: 'small' | 'medium' | 'large';
    fullWidth?: boolean;
    helperText?: string;
    startAdornment?: string;
    endAdornment?: string;
}

export interface FileFieldLayout extends BaseFieldLayout {
    preset?: 'drag-and-drop' | 'button-only' | 'compact' | 'with-preview';
    accept?: string;
    multiple?: boolean;
    maxSize?: number;
    maxFiles?: number;
    showFileList?: boolean;
}

export interface SelectFieldLayout extends InputFieldLayout {
    multiple?: boolean;
    autocomplete?: boolean;
    creatable?: boolean;
}

export interface CheckboxFieldLayout extends BaseFieldLayout {
    labelPlacement?: 'left' | 'right';
    size?: 'small' | 'medium' | 'large';
    indeterminate?: boolean;
}

export interface RadioGroupFieldLayout extends BaseFieldLayout {
    direction?: 'row' | 'column';
}

export interface RichTextFieldLayout extends BaseFieldLayout {
    editorLibrary?: 'jodit' | 'quill' | 'tinymce' | 'custom';
    toolbarConfig?: 'simple' | 'full' | 'custom';
    height?: number | string;
}

export interface ButtonFieldLayout extends BaseFieldLayout {
    size?: 'small' | 'medium' | 'large';
    fullWidth?: boolean;
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    loadingIndicator?: string; // Or ReactNode, but string for schema
    startIcon?: string; // Or ReactNode
    endIcon?: string; // Or ReactNode
}

export interface DatePickerFieldLayout extends InputFieldLayout {
    minDate?: string; // ISO 8601 format
    maxDate?: string; // ISO 8601 format
    format?: string;
    variant?: 'date' | 'datetime' | 'range';
}

export interface TextareaFieldLayout extends InputFieldLayout {
    rows?: number;
    cols?: number;
}

export interface FieldSchema {
    name: string;
    label?: string;
    type: 'text' | 'email' | 'number' | 'select' | 'checkbox' | 'date' | 'file' | 'rich-text' | 'button' | 'textarea';
    options?: { label: string; value: string }[];
    validation?: {
        required?: boolean;
        requiredError?: string;
        minLength?: number;
        minLengthError?: string;
        maxLength?: number;
        maxLengthError?: string;
        pattern?: string;
        patternError?: string;
        min?: number;
        minError?: string;
        max?: number;
        maxError?: string;
    };
    placeholder?: string;
    defaultValue?: any;
    disabled?: boolean;
    readOnly?: boolean;
    style?: CSSProperties & {
        checkedIcon?: string;
        uncheckedIcon?: string;
        indeterminateIcon?: string;
        color?: string;
    };

    // Type-specific layout properties
    inputLayout?: InputFieldLayout;
    fileLayout?: FileFieldLayout;
    selectLayout?: SelectFieldLayout;
    checkboxLayout?: CheckboxFieldLayout;
    radioGroupLayout?: RadioGroupFieldLayout;
    richTextLayout?: RichTextFieldLayout;
    buttonLayout?: ButtonFieldLayout;
    datePickerLayout?: DatePickerFieldLayout;
    textareaLayout?: TextareaFieldLayout;

    condition?: {
        field: string;
        operator: '==' | '!=' | '>' | '<' | '>=' | '<=' | 'includes' | '!includes';
        value: any;
    };
    api?: {
        url: string;
        method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
        headers?: Record<string, string>;
        body?: Record<string, any>;
        responseMapping?: {
            label: string;
            value: string;
        };
    };
    buttonType?: 'submit' | 'button';
    loading?: boolean;
}

export interface FormTheme {
    font?: {
        size?: string; // e.g., '1rem', '0.9rem'
        style?: string;
        weight?: string;
        family?: string;
    };
    color?: {
        primary?: string;
        secondary?: string;
        background?: string;
        text?: string;
        // Input specific colors
        inputBackground?: string;
        inputBorder?: string;
        inputFocusBorder?: string;
        inputText?: string;
        // Label specific colors
        labelColor?: string;
        // Error specific colors
        errorColor?: string;
    };
    layout?: {
        lineHeight?: number;
        lineSpacing?: number;
        padding?: string; // e.g., '8px 12px'
        margin?: string; // e.g., '0 0 16px 0'
        borderRadius?: string; // e.g., '4px'
        gap?: number; // Gap between fields in pixels
    };
    border?: {
        color?: string;
        width?: string; // e.g., '1px'
        style?: string;
    };
    button?: {
        primary?: {
            background?: string;
            text?: string;
        };
        secondary?: {
            background?: string;
            text?: string;
            border?: string;
        };
        danger?: {
            background?: string;
            text?: string;
        };
        ghost?: {
            background?: string;
            text?: string;
        };
    };
    title?: {
        fontSize?: string;
        fontWeight?: string;
        color?: string;
        textAlign?: 'left' | 'center' | 'right';
        marginTop?: string;
        marginBottom?: string;
        paddingTop?: string;
        paddingBottom?: string;
    };
}

export interface FormSchema {
    meta?: Record<string, any>;
    title?: string;
    fields: FieldSchema[];
    layout?: {
        type?: 'grid' | 'flex';
        columns?: number;
        rows?: number;
        spacing?: number;
        labelPlacement?: 'top' | 'left' | 'inline';
        variant?: 'outlined' | 'filled' | 'standard';
    };
    theme?: FormTheme;
    style?: CSSProperties;
    api?: {
        url: string;
        method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
        headers?: Record<string, string>;
    };
}
