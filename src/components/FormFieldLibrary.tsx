import React from 'react';
import { 
  Type, 
  Mail, 
  Lock, 
  Hash, 
  FileText, 
  ChevronDown, 
  CheckSquare, 
  Circle, 
  Calendar, 
  Upload, 
  Sliders, 
  Palette 
} from 'lucide-react';
import { useForm } from '../contexts/FormContext';
import { FormField } from '../types/FormTypes';

export const FormFieldLibrary: React.FC = () => {
  const { addField } = useForm();

  const fieldTypes = [
    {
      type: 'text',
      name: 'Text Input',
      icon: Type,
      description: 'Single line text input'
    },
    {
      type: 'email',
      name: 'Email Input',
      icon: Mail,
      description: 'Email address input'
    },
    {
      type: 'password',
      name: 'Password Input',
      icon: Lock,
      description: 'Password input field'
    },
    {
      type: 'number',
      name: 'Number Input',
      icon: Hash,
      description: 'Numeric input field'
    },
    {
      type: 'textarea',
      name: 'Text Area',
      icon: FileText,
      description: 'Multi-line text input'
    },
    {
      type: 'select',
      name: 'Dropdown',
      icon: ChevronDown,
      description: 'Dropdown selection'
    },
    {
      type: 'checkbox',
      name: 'Checkbox',
      icon: CheckSquare,
      description: 'Checkbox input'
    },
    {
      type: 'radio',
      name: 'Radio Button',
      icon: Circle,
      description: 'Radio button group'
    },
    {
      type: 'date',
      name: 'Date Picker',
      icon: Calendar,
      description: 'Date selection input'
    },
    {
      type: 'file',
      name: 'File Upload',
      icon: Upload,
      description: 'File upload input'
    },
    {
      type: 'range',
      name: 'Range Slider',
      icon: Sliders,
      description: 'Range slider input'
    },
    {
      type: 'color',
      name: 'Color Picker',
      icon: Palette,
      description: 'Color selection input'
    }
  ];

  const createField = (type: string): FormField => {
    const id = `${type}-${Date.now()}`;
    const baseField: FormField = {
      id,
      type: type as any,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      placeholder: `Enter ${type}...`,
      defaultValue: '',
      validations: [],
      conditionalRules: [],
      isVisible: true,
      isEnabled: true,
      hasError: false,
      style: {
        width: '100%',
        padding: '12px',
        fontSize: '14px',
        borderRadius: '8px',
        border: '1px solid #d1d5db',
        margin: '0 0 16px 0'
      }
    };

    // Type-specific configurations
    switch (type) {
      case 'email':
        baseField.validations = [
          { type: 'required', message: 'Email is required' },
          { type: 'email', message: 'Please enter a valid email address' }
        ];
        break;
      
      case 'password':
        baseField.validations = [
          { type: 'required', message: 'Password is required' },
          { type: 'minLength', value: 8, message: 'Password must be at least 8 characters' }
        ];
        break;
      
      case 'number':
        baseField.defaultValue = 0;
        baseField.validations = [
          { type: 'required', message: 'This field is required' }
        ];
        break;
      
      case 'select':
        baseField.options = [
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' },
          { label: 'Option 3', value: 'option3' }
        ];
        baseField.defaultValue = '';
        break;
      
      case 'radio':
        baseField.options = [
          { label: 'Option A', value: 'a' },
          { label: 'Option B', value: 'b' },
          { label: 'Option C', value: 'c' }
        ];
        baseField.defaultValue = '';
        break;
      
      case 'checkbox':
        baseField.defaultValue = false;
        break;
      
      case 'range':
        baseField.defaultValue = 50;
        baseField.style = {
          ...baseField.style,
          height: '6px'
        };
        break;
      
      case 'color':
        baseField.defaultValue = '#3b82f6';
        baseField.style = {
          ...baseField.style,
          height: '40px',
          padding: '4px'
        };
        break;
      
      case 'date':
        baseField.defaultValue = '';
        break;
      
      case 'file':
        baseField.defaultValue = null;
        break;
      
      case 'textarea':
        baseField.style = {
          ...baseField.style,
          height: '100px'
        };
        break;
    }

    return baseField;
  };

  const handleAddField = (type: string) => {
    const field = createField(type);
    addField(field);
  };

  return (
    <div className="p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Form Fields</h3>
      <div className="space-y-2">
        {fieldTypes.map(fieldType => {
          const Icon = fieldType.icon;
          return (
            <button
              key={fieldType.type}
              onClick={() => handleAddField(fieldType.type)}
              className="w-full p-3 bg-gray-50 hover:bg-purple-50 border border-gray-200 hover:border-purple-200 rounded-lg text-left transition-all duration-200 group"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white group-hover:bg-purple-100 border border-gray-200 group-hover:border-purple-300 rounded-lg flex items-center justify-center transition-colors">
                  <Icon className="w-4 h-4 text-gray-600 group-hover:text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-sm">{fieldType.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{fieldType.description}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};