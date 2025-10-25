import React from 'react';
import { X } from 'lucide-react';
import { useForm } from '../contexts/FormContext';
import { DynamicFormField } from './DynamicFormField';

interface FormPreviewProps {
  onClose: () => void;
}

export const FormPreview: React.FC<FormPreviewProps> = ({ onClose }) => {
  const { currentForm, formData, updateFormData, validateField, validateForm, submitForm } = useForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateForm();
    if (validation.isValid) {
      const success = await submitForm();
      if (success) {
        alert('Form submitted successfully!');
        onClose();
      } else {
        alert('Error submitting form. Please try again.');
      }
    } else {
      alert('Please fix the validation errors before submitting.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-gray-900 z-10"
        >
          <X className="w-4 h-4" />
        </button>
        
        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentForm.name}</h2>
            <p className="text-gray-600">Preview your dynamic form with live validation and conditional logic.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {currentForm.fields
              .filter(field => field.isVisible)
              .map(field => (
                <DynamicFormField
                  key={field.id}
                  field={field}
                  value={formData[field.id]}
                  onChange={(value) => updateFormData(field.id, value)}
                  onValidate={(value) => validateField(field.id, value)}
                  isSelected={false}
                />
              ))}

            {currentForm.fields.some(field => field.isVisible) && (
              <div className="pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  Submit Form
                </button>
              </div>
            )}
          </form>

          {currentForm.fields.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Fields Added</h3>
              <p className="text-gray-500">Add some form fields to see the preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};</parameter>