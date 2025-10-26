import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { FormConfig, FormField, FormData, ValidationResult, ConditionalRule, ValidationRule } from '../types/FormTypes';

interface FormContextType {
  currentForm: FormConfig;
  formData: FormData;
  validationResults: ValidationResult;
  setCurrentForm: (form: FormConfig) => void;
  updateFormData: (fieldId: string, value: any) => void;
  addField: (field: FormField) => void;
  updateField: (fieldId: string, updates: Partial<FormField>) => void;
  deleteField: (fieldId: string) => void;
  addConditionalRule: (fieldId: string, rule: ConditionalRule) => void;
  removeConditionalRule: (fieldId: string, ruleId: string) => void;
  validateForm: () => ValidationResult;
  validateField: (fieldId: string, value: any) => { isValid: boolean; error?: string };
  processConditionalRules: () => void;
  resetForm: () => void;
  submitForm: () => Promise<boolean>;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

const defaultForm: FormConfig = {
  id: 'form-1',
  name: 'Dynamic Form',
  fields: [],
  globalRules: [],
  submitAction: {
    type: 'popup',
    successMessage: 'Form submitted successfully!',
    errorMessage: 'There was an error submitting the form.'
  }
};

export const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentForm, setCurrentForm] = useState<FormConfig>(defaultForm);
  const [formData, setFormData] = useState<FormData>({});
  const [validationResults, setValidationResults] = useState<ValidationResult>({
    isValid: true,
    errors: {},
    warnings: {}
  });

  const updateFormData = useCallback((fieldId: string, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [fieldId]: value };
      
      // Process conditional rules after data update
      setTimeout(() => processConditionalRules(newData), 0);
      
      return newData;
    });
  }, []);

  const validateField = useCallback((fieldId: string, value: any): { isValid: boolean; error?: string } => {
    const field = currentForm.fields.find(f => f.id === fieldId);
    if (!field || !field.isVisible) return { isValid: true };

    for (const validation of field.validations) {
      switch (validation.type) {
        case 'required':
          if (!value || (typeof value === 'string' && value.trim() === '')) {
            return { isValid: false, error: validation.message };
          }
          break;
        
        case 'minLength':
          if (typeof value === 'string' && value.length < validation.value) {
            return { isValid: false, error: validation.message };
          }
          break;
        
        case 'maxLength':
          if (typeof value === 'string' && value.length > validation.value) {
            return { isValid: false, error: validation.message };
          }
          break;
        
        case 'pattern':
          if (typeof value === 'string' && !new RegExp(validation.value).test(value)) {
            return { isValid: false, error: validation.message };
          }
          break;
        
        case 'min':
          if (typeof value === 'number' && value < validation.value) {
            return { isValid: false, error: validation.message };
          }
          break;
        
        case 'max':
          if (typeof value === 'number' && value > validation.value) {
            return { isValid: false, error: validation.message };
          }
          break;
        
        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (typeof value === 'string' && !emailRegex.test(value)) {
            return { isValid: false, error: validation.message };
          }
          break;
        
        case 'custom':
          if (validation.customValidator && !validation.customValidator(value, formData)) {
            return { isValid: false, error: validation.message };
          }
          break;
      }
    }

    return { isValid: true };
  }, [currentForm.fields, formData]);

  const validateForm = useCallback((): ValidationResult => {
    const errors: Record<string, string> = {};
    const warnings: Record<string, string> = {};

    currentForm.fields.forEach(field => {
      if (field.isVisible) {
        const value = formData[field.id];
        const validation = validateField(field.id, value);
        
        if (!validation.isValid && validation.error) {
          errors[field.id] = validation.error;
        }
        
        if (field.warningMessage) {
          warnings[field.id] = field.warningMessage;
        }
      }
    });

    const result = {
      isValid: Object.keys(errors).length === 0,
      errors,
      warnings
    };

    setValidationResults(result);
    return result;
  }, [currentForm.fields, formData, validateField]);

  const evaluateCondition = useCallback((condition: ConditionalRule['condition'], data: FormData): boolean => {
    const fieldValue = data[condition.field];
    const { operator, value } = condition;

    switch (operator) {
      case 'equals':
        return fieldValue === value;
      case 'notEquals':
        return fieldValue !== value;
      case 'contains':
        return typeof fieldValue === 'string' && fieldValue.includes(value);
      case 'notContains':
        return typeof fieldValue === 'string' && !fieldValue.includes(value);
      case 'greaterThan':
        return typeof fieldValue === 'number' && fieldValue > value;
      case 'lessThan':
        return typeof fieldValue === 'number' && fieldValue < value;
      case 'greaterThanOrEqual':
        return typeof fieldValue === 'number' && fieldValue >= value;
      case 'lessThanOrEqual':
        return typeof fieldValue === 'number' && fieldValue <= value;
      case 'isEmpty':
        return !fieldValue || (typeof fieldValue === 'string' && fieldValue.trim() === '');
      case 'isNotEmpty':
        return fieldValue && (typeof fieldValue !== 'string' || fieldValue.trim() !== '');
      default:
        return false;
    }
  }, []);

  const processConditionalRules = useCallback((data: FormData = formData) => {
    setCurrentForm(prev => {
      const updatedFields = prev.fields.map(field => {
        let updatedField = { ...field };
        
        // Reset warnings
        updatedField.warningMessage = undefined;
        
        // Process field-specific rules
        field.conditionalRules.forEach(rule => {
          if (evaluateCondition(rule.condition, data)) {
            switch (rule.action.type) {
              case 'show':
                if (rule.action.target === field.id) {
                  updatedField.isVisible = true;
                }
                break;
              case 'hide':
                if (rule.action.target === field.id) {
                  updatedField.isVisible = false;
                }
                break;
              case 'enable':
                if (rule.action.target === field.id) {
                  updatedField.isEnabled = true;
                }
                break;
              case 'disable':
                if (rule.action.target === field.id) {
                  updatedField.isEnabled = false;
                }
                break;
              case 'setValue':
                if (rule.action.target === field.id && rule.action.value !== undefined) {
                  setFormData(prevData => ({ ...prevData, [field.id]: rule.action.value }));
                }
                break;
              case 'showWarning':
                if (rule.action.target === field.id && rule.action.message) {
                  updatedField.warningMessage = rule.action.message;
                }
                break;
              case 'hideWarning':
                if (rule.action.target === field.id) {
                  updatedField.warningMessage = undefined;
                }
                break;
            }
          }
        });

        // Process global rules
        prev.globalRules.forEach(rule => {
          if (evaluateCondition(rule.condition, data)) {
            switch (rule.action.type) {
              case 'show':
                if (rule.action.target === field.id) {
                  updatedField.isVisible = true;
                }
                break;
              case 'hide':
                if (rule.action.target === field.id) {
                  updatedField.isVisible = false;
                }
                break;
              case 'enable':
                if (rule.action.target === field.id) {
                  updatedField.isEnabled = true;
                }
                break;
              case 'disable':
                if (rule.action.target === field.id) {
                  updatedField.isEnabled = false;
                }
                break;
            }
          }
        });

        return updatedField;
      });

      return { ...prev, fields: updatedFields };
    });
  }, [formData, evaluateCondition]);

  const addField = useCallback((field: FormField) => {
    setCurrentForm(prev => ({
      ...prev,
      fields: [...prev.fields, field]
    }));
  }, []);

  const updateField = useCallback((fieldId: string, updates: Partial<FormField>) => {
    setCurrentForm(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.id === fieldId ? { ...field, ...updates } : field
      )
    }));
  }, []);

  const deleteField = useCallback((fieldId: string) => {
    setCurrentForm(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId)
    }));
    
    setFormData(prev => {
      const newData = { ...prev };
      delete newData[fieldId];
      return newData;
    });
  }, []);

  const addConditionalRule = useCallback((fieldId: string, rule: ConditionalRule) => {
    setCurrentForm(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.id === fieldId 
          ? { ...field, conditionalRules: [...field.conditionalRules, rule] }
          : field
      )
    }));
  }, []);

  const removeConditionalRule = useCallback((fieldId: string, ruleId: string) => {
    setCurrentForm(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.id === fieldId 
          ? { ...field, conditionalRules: field.conditionalRules.filter(rule => rule.id !== ruleId) }
          : field
      )
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({});
    setValidationResults({ isValid: true, errors: {}, warnings: {} });
    processConditionalRules({});
  }, [processConditionalRules]);

  const submitForm = useCallback(async (): Promise<boolean> => {
    const validation = validateForm();
    
    if (!validation.isValid) {
      return false;
    }

    try {
      // Simulate form submission
      console.log('Submitting form:', formData);
      
      // Here you would implement actual submission logic based on submitAction
      switch (currentForm.submitAction.type) {
        case 'webhook':
          // await fetch(currentForm.submitAction.endpoint, { method: 'POST', body: JSON.stringify(formData) });
          break;
        case 'email':
          // Send email logic
          break;
        case 'redirect':
          // window.location.href = currentForm.submitAction.redirectUrl;
          break;
        case 'popup':
          alert(currentForm.submitAction.successMessage);
          break;
      }
      
      return true;
    } catch (error) {
      console.error('Form submission error:', error);
      return false;
    }
  }, [formData, validateForm, currentForm.submitAction]);

  return (
    <FormContext.Provider value={{
      currentForm,
      formData,
      validationResults,
      setCurrentForm,
      updateFormData,
      addField,
      updateField,
      deleteField,
      addConditionalRule,
      removeConditionalRule,
      validateForm,
      validateField,
      processConditionalRules,
      resetForm,
      submitForm
    }}>
      {children}
    </FormContext.Provider>
  );
};

export const useForm = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
};