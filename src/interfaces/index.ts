import {CSSProperties} from "react";

export interface FieldSchema {
    name: string;
    label?: string;
    type: 'text' | 'email' | 'number' | 'select' | 'checkbox' | 'date';
    required?: boolean;
    options?: { label: string; value: string }[];
    min?: number;
    max?: number;
    validation?: {
        minLength?: number;
        maxLength?: number;
        pattern?: string;
    };
    placeholder?: string;
    defaultValue?: any;
    style?: CSSProperties;
    grid?: {
        xs?: number;
        sm?: number;
        md?: number;
        lg?: number;
            xl?: number;
            condition?: {
                field: string;
                operator: '==' | '!=' | '>' | '<' | '>=' | '<=' | 'includes' | '!includes';
                value: any;
            };
        }
        
        export interface FormSchema {
            meta?: Record<string, any>;
            fields: FieldSchema[];
            layout?: {
                container?: boolean;
                spacing?: number;
            };
            style?: CSSProperties;
        }
