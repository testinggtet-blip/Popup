import React from 'react';
import { useForm } from '../contexts/FormContext';
import { DynamicFormField } from './DynamicFormField';

interface FormCanvasProps {
  selectedFieldId: string | null;
  onFieldSelect: (fieldId: string | null) => void;
}

export const FormCanvas: React.FC<FormCanvasProps> = ({ selectedFieldId, onFieldSelect }) => {
  const { currentForm, formData, updateFormData, validateField } = useForm();

  const handleFieldChange = (fieldId: string, value: any) => {
    updateFormData(fieldId, value);
  };

  const handleFieldClick = (fieldId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    onFieldSelect(fieldId);
  };

  return (
    <div className="flex-1 bg-gray-100 flex items-start justify-center p-8 overflow-auto">
      <div 
        className="w-full max-w-2xl bg-white rounded-lg shadow-xl p-8 min-h-96"
        onClick={() => onFieldSelect(null)}
      >
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentForm.name}</h2>
          <p className="text-gray-600">Fill out the form below with dynamic validation and conditional logic.</p>
        </div>

        {currentForm.fields.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Start Building Your Form</h3>
            <p className="text-gray-500">Add form fields from the sidebar to get started</p>
          </div>
        ) : (
          <form className="space-y-6">
            {currentForm.fields
              .filter(field => field.isVisible)
              .map(field => (
                <div
                  key={field.id}
                  className={`relative ${
                    selectedFieldId === field.id 
                      ? 'ring-2 ring-purple-500 ring-opacity-50 rounded-lg p-2 -m-2' 
                      : ''
                  }`}
                  onClick={(e) => handleFieldClick(field.id, e)}
                >
                  <DynamicFormField
                    field={field}
                    value={formData[field.id]}
                    onChange={(value) => handleFieldChange(field.id, value)}
                    onValidate={(value) => validateField(field.id, value)}
                    isSelected={selectedFieldId === field.id}
                  />
                </div>
              ))}

            {currentForm.fields.some(field => field.isVisible) && (
              <div className="pt-6 border-t border-gray-200">
                <button
                  type="button"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  onClick={() => {
                    // Handle form submission
                    console.log('Form submitted:', formData);
                  }}
                >
                  Submit Form
                </button>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};</parameter>