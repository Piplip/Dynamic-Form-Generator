import {CSSProperties} from "react";

export interface FieldSchema {
    name: string;
    label?: string;
    type: 'text' | 'email' | 'number' | 'select' | 'checkbox' | 'date' | 'file' | 'rich-text' | 'button' | 'textarea';
    options?: { label: string; value: string }[];
    validation?: {
        required?: boolean;
        minLength?: number;
        maxLength?: number;
        pattern?: string;
        min?: number;
        max?: number;
    };
    placeholder?: string;
    defaultValue?: any;
    style?: CSSProperties & {
        checkedIcon?: string;
        uncheckedIcon?: string;
        indeterminateIcon?: string;
        color?: string;
    };
    layout?: {
        row?: number;
        col?: number;
        rowSpan?: number;
        colSpan?: number;
        width?: number | string;
        height?: number | string;
        labelPlacement?: 'top' | 'left' | 'inline';
        variant?: 'outlined' | 'filled' | 'standard';
        preset?: 'button' | 'dropzone';
        buttonText?: string;
    };
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
        size?: number;
        style?: string;
        weight?: string;
        family?: string;
    };
    color?: {
        primary?: string;
        secondary?: string;
        background?: string;
        text?: string;
    };
    layout?: {
        lineHeight?: number;
        lineSpacing?: number;
        padding?: number;
        margin?: number;
    };
    border?: {
        color?: string;
        width?: number;
        style?: string;
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
