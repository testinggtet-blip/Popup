export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'min' | 'max' | 'email' | 'custom';
  value?: any;
  message: string;
  customValidator?: (value: any, formData: Record<string, any>) => boolean;
}

export interface ConditionalRule {
  id: string;
  condition: {
    field: string;
    operator: 'equals' | 'notEquals' | 'contains' | 'notContains' | 'greaterThan' | 'lessThan' | 'greaterThanOrEqual' | 'lessThanOrEqual' | 'isEmpty' | 'isNotEmpty';
    value: any;
  };
  action: {
    type: 'show' | 'hide' | 'enable' | 'disable' | 'setValue' | 'addValidation' | 'removeValidation' | 'showWarning' | 'hideWarning';
    target: string;
    value?: any;
    message?: string;
  };
}

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'file' | 'range' | 'color';
  label: string;
  placeholder?: string;
  defaultValue?: any;
  options?: { label: string; value: any }[];
  validations: ValidationRule[];
  conditionalRules: ConditionalRule[];
  isVisible: boolean;
  isEnabled: boolean;
  hasError: boolean;
  errorMessage?: string;
  warningMessage?: string;
  style: {
    width?: string;
    height?: string;
    fontSize?: string;
    color?: string;
    backgroundColor?: string;
    borderRadius?: string;
    padding?: string;
    margin?: string;
    border?: string;
  };
}

export interface FormConfig {
  id: string;
  name: string;
  fields: FormField[];
  globalRules: ConditionalRule[];
  submitAction: {
    type: 'email' | 'webhook' | 'redirect' | 'popup';
    endpoint?: string;
    redirectUrl?: string;
    emailTo?: string;
    successMessage: string;
    errorMessage: string;
  };
}

export interface FormData {
  [fieldId: string]: any;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  warnings: Record<string, string>;
}</parameter>