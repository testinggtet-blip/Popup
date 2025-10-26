import React from 'react';
import { useForm } from '../contexts/FormContext';
import { Eye, Save, Globe, Zap } from 'lucide-react';

interface FormBuilderHeaderProps {
  onPreview: () => void;
}

export const FormBuilderHeader: React.FC<FormBuilderHeaderProps> = ({ onPreview }) => {
  const { currentForm, saveForm, publishForm, savedFormId, isLoading } = useForm();

  const handleSave = async () => {
    const success = await saveForm();
    if (success) {
      alert('Form saved successfully!');
    } else {
      alert('Error saving form. Please try again.');
    }
  };

  const handlePublish = async () => {
    const success = await publishForm(true);
    if (success) {
      alert('Form published successfully!');
    } else {
      alert('Error publishing form. Please try again.');
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">FormCraft</h1>
        </div>
        <div className="h-6 w-px bg-gray-300 ml-2"></div>
        <span className="text-sm text-gray-600">{currentForm.name}</span>
        {savedFormId && (
          <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">Saved</span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onPreview}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
          disabled={isLoading}
        >
          <Eye className="w-4 h-4" />
          Preview
        </button>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
          disabled={isLoading}
        >
          <Save className="w-4 h-4" />
          {isLoading ? 'Saving...' : 'Save'}
        </button>

        <button
          onClick={handlePublish}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
          disabled={isLoading}
        >
          <Globe className="w-4 h-4" />
          Publish
        </button>
      </div>
    </header>
  );
};
