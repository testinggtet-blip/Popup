import React from 'react';
import { useForm } from '../contexts/FormContext';
import { Trash2, Settings, Plus } from 'lucide-react';
import { ValidationRule } from '../types/FormTypes';

interface FormPropertiesPanelProps {
  selectedFieldId: string | null;
  onFieldSelect: (fieldId: string | null) => void;
}

export const FormPropertiesPanel: React.FC<FormPropertiesPanelProps> = ({
  selectedFieldId,
  onFieldSelect
}) => {
  const { currentForm, updateField, deleteField } = useForm();
  
  const selectedField = currentForm.fields.find(f => f.id === selectedFieldId);

  const addValidation = (type: ValidationRule['type']) => {
    if (!selectedField) return;
    
    const newValidation: ValidationRule = {
      type,
      message: `Please enter a valid ${type}`,
      ...(type === 'minLength' && { value: 3 }),
      ...(type === 'maxLength' && { value: 50 }),
      ...(type === 'min' && { value: 0 }),
      ...(type === 'max' && { value: 100 }),
      ...(type === 'pattern' && { value: '^[a-zA-Z]+$' })
    };

    updateField(selectedField.id, {
      validations: [...selectedField.validations, newValidation]
    });
  };

  const updateValidation = (index: number, updates: Partial<ValidationRule>) => {
    if (!selectedField) return;
    
    const updatedValidations = selectedField.validations.map((validation, i) =>
      i === index ? { ...validation, ...updates } : validation
    );
    
    updateField(selectedField.id, { validations: updatedValidations });
  };

  const removeValidation = (index: number) => {
    if (!selectedField) return;
    
    const updatedValidations = selectedField.validations.filter((_, i) => i !== index);
    updateField(selectedField.id, { validations: updatedValidations });
  };

  if (!selectedField) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-4 h-4 text-gray-600" />
          <h3 className="text-sm font-semibold text-gray-900">Form Properties</h3>
        </div>
        
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <Settings className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-sm text-gray-500">Select a field to edit its properties</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-gray-600" />
          <h3 className="text-sm font-semibold text-gray-900">Field Properties</h3>
        </div>
        <button
          onClick={() => {
            deleteField(selectedField.id);
            onFieldSelect(null);
          }}
          className="p-1 text-red-600 hover:bg-red-50 rounded"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-6">
        {/* Basic Properties */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Basic Properties</h4>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Label</label>
              <input
                type="text"
                value={selectedField.label}
                onChange={(e) => updateField(selectedField.id, { label: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Placeholder</label>
              <input
                type="text"
                value={selectedField.placeholder || ''}
                onChange={(e) => updateField(selectedField.id, { placeholder: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Default Value</label>
              <input
                type="text"
                value={selectedField.defaultValue || ''}
                onChange={(e) => updateField(selectedField.id, { defaultValue: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Options for Select/Radio */}
        {(selectedField.type === 'select' || selectedField.type === 'radio') && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Options</h4>
            <div className="space-y-2">
              {selectedField.options?.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={option.label}
                    onChange={(e) => {
                      const newOptions = [...(selectedField.options || [])];
                      newOptions[index] = { ...option, label: e.target.value };
                      updateField(selectedField.id, { options: newOptions });
                    }}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                    placeholder="Label"
                  />
                  <input
                    type="text"
                    value={option.value}
                    onChange={(e) => {
                      const newOptions = [...(selectedField.options || [])];
                      newOptions[index] = { ...option, value: e.target.value };
                      updateField(selectedField.id, { options: newOptions });
                    }}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                    placeholder="Value"
                  />
                </div>
              ))}
              <button
                onClick={() => {
                  const newOptions = [...(selectedField.options || [])];
                  newOptions.push({ label: 'New Option', value: `option${newOptions.length + 1}` });
                  updateField(selectedField.id, { options: newOptions });
                }}
                className="w-full px-3 py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-purple-300 hover:text-purple-600"
              >
                + Add Option
              </button>
            </div>
          </div>
        )}

        {/* Validation Rules */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-900">Validation Rules</h4>
            <div className="relative">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    addValidation(e.target.value as ValidationRule['type']);
                    e.target.value = '';
                  }
                }}
                className="text-xs border border-gray-300 rounded px-2 py-1"
              >
                <option value="">Add Rule</option>
                <option value="required">Required</option>
                <option value="minLength">Min Length</option>
                <option value="maxLength">Max Length</option>
                <option value="pattern">Pattern</option>
                <option value="min">Min Value</option>
                <option value="max">Max Value</option>
                <option value="email">Email</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-3">
            {selectedField.validations.map((validation, index) => (
              <div key={index} className="p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-700 capitalize">
                    {validation.type}
                  </span>
                  <button
                    onClick={() => removeValidation(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                
                {(validation.type === 'minLength' || validation.type === 'maxLength' || 
                  validation.type === 'min' || validation.type === 'max') && (
                  <input
                    type="number"
                    value={validation.value || ''}
                    onChange={(e) => updateValidation(index, { value: parseInt(e.target.value) })}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs mb-2"
                    placeholder="Value"
                  />
                )}
                
                {validation.type === 'pattern' && (
                  <input
                    type="text"
                    value={validation.value || ''}
                    onChange={(e) => updateValidation(index, { value: e.target.value })}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs mb-2"
                    placeholder="Regular expression"
                  />
                )}
                
                <input
                  type="text"
                  value={validation.message}
                  onChange={(e) => updateValidation(index, { message: e.target.value })}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                  placeholder="Error message"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Styling */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Styling</h4>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Width</label>
              <input
                type="text"
                value={selectedField.style.width || '100%'}
                onChange={(e) => updateField(selectedField.id, { 
                  style: { ...selectedField.style, width: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Padding</label>
              <input
                type="text"
                value={selectedField.style.padding || '12px'}
                onChange={(e) => updateField(selectedField.id, { 
                  style: { ...selectedField.style, padding: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Border Radius</label>
              <input
                type="text"
                value={selectedField.style.borderRadius || '8px'}
                onChange={(e) => updateField(selectedField.id, { 
                  style: { ...selectedField.style, borderRadius: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Background Color</label>
              <input
                type="color"
                value={selectedField.style.backgroundColor || '#ffffff'}
                onChange={(e) => updateField(selectedField.id, { 
                  style: { ...selectedField.style, backgroundColor: e.target.value }
                })}
                className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Visibility & State */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Field State</h4>
          
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedField.isVisible}
                onChange={(e) => updateField(selectedField.id, { isVisible: e.target.checked })}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="ml-2 text-sm text-gray-700">Visible</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedField.isEnabled}
                onChange={(e) => updateField(selectedField.id, { isEnabled: e.target.checked })}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="ml-2 text-sm text-gray-700">Enabled</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};</parameter>