export interface FieldSchema {
    name: string;
    label?: string;
    type: 'text' | 'email' | 'number' | 'select' | 'checkbox';
    required?: boolean;
    options?: { label: string; value: string }[];
    min?: number;
    max?: number;
}

export interface FormSchema {
    meta?: Record<string, any>;
    fields: FieldSchema[];
}
