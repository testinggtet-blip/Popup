import React, { useState, useEffect } from 'react';
import { FormField } from '../types/FormTypes';
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface DynamicFormFieldProps {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  onValidate: (value: any) => { isValid: boolean; error?: string };
  isSelected: boolean;
}

export const DynamicFormField: React.FC<DynamicFormFieldProps> = ({
  field,
  value,
  onChange,
  onValidate,
  isSelected
}) => {
  const [localError, setLocalError] = useState<string | undefined>();
  const [isTouched, setIsTouched] = useState(false);

  useEffect(() => {
    if (isTouched) {
      const validation = onValidate(value);
      setLocalError(validation.error);
    }
  }, [value, onValidate, isTouched]);

  const handleChange = (newValue: any) => {
    onChange(newValue);
    setIsTouched(true);
  };

  const handleBlur = () => {
    setIsTouched(true);
    const validation = onValidate(value);
    setLocalError(validation.error);
  };

  const renderField = () => {
    const commonProps = {
      id: field.id,
      disabled: !field.isEnabled,
      onBlur: handleBlur,
      style: {
        ...field.style,
        borderColor: localError ? '#ef4444' : field.style.border?.includes('#') ? field.style.border : '#d1d5db'
      },
      className: `transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
        !field.isEnabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${localError ? 'border-red-500' : ''}`
    };

    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
        return (
          <input
            {...commonProps}
            type={field.type}
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
          />
        );

      case 'number':
        return (
          <input
            {...commonProps}
            type="number"
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => handleChange(parseFloat(e.target.value) || 0)}
          />
        );

      case 'textarea':
        return (
          <textarea
            {...commonProps}
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            rows={4}
          />
        );

      case 'select':
        return (
          <select
            {...commonProps}
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
          >
            <option value="">{field.placeholder || 'Select an option...'}</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              {...commonProps}
              type="checkbox"
              checked={value || false}
              onChange={(e) => handleChange(e.target.checked)}
              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <label htmlFor={field.id} className="ml-2 text-sm text-gray-700">
              {field.placeholder || 'Check this box'}
            </label>
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map(option => (
              <div key={option.value} className="flex items-center">
                <input
                  id={`${field.id}-${option.value}`}
                  type="radio"
                  name={field.id}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => handleChange(e.target.value)}
                  disabled={!field.isEnabled}
                  className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                />
                <label htmlFor={`${field.id}-${option.value}`} className="ml-2 text-sm text-gray-700">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );

      case 'date':
        return (
          <input
            {...commonProps}
            type="date"
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
          />
        );

      case 'file':
        return (
          <input
            {...commonProps}
            type="file"
            onChange={(e) => handleChange(e.target.files?.[0] || null)}
          />
        );

      case 'range':
        return (
          <div>
            <input
              {...commonProps}
              type="range"
              min="0"
              max="100"
              value={value || 50}
              onChange={(e) => handleChange(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span className="font-medium">{value || 50}</span>
              <span>100</span>
            </div>
          </div>
        );

      case 'color':
        return (
          <div className="flex items-center gap-3">
            <input
              {...commonProps}
              type="color"
              value={value || '#3b82f6'}
              onChange={(e) => handleChange(e.target.value)}
              className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
            />
            <span className="text-sm text-gray-600 font-mono">{value || '#3b82f6'}</span>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
        {field.label}
        {field.validations.some(v => v.type === 'required') && (
          <span className="text-red-500 ml-1">*</span>
        )}
      </label>
      
      {renderField()}
      
      {/* Error Message */}
      {localError && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertTriangle className="w-4 h-4" />
          {localError}
        </div>
      )}
      
      {/* Warning Message */}
      {field.warningMessage && !localError && (
        <div className="flex items-center gap-2 text-amber-600 text-sm">
          <AlertTriangle className="w-4 h-4" />
          {field.warningMessage}
        </div>
      )}
      
      {/* Success State */}
      {isTouched && !localError && value && field.validations.length > 0 && (
        <div className="flex items-center gap-2 text-green-600 text-sm">
          <CheckCircle className="w-4 h-4" />
          Valid
        </div>
      )}
      
      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-purple-500 rounded-full border-2 border-white"></div>
      )}
    </div>
  );
};</parameter>