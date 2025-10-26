import React, { useState } from 'react';
import { FormFieldLibrary } from './FormFieldLibrary';
import { FormCanvas } from './FormCanvas';
import { FormPropertiesPanel } from './FormPropertiesPanel';
import { FormPreview } from './FormPreview';
import { ConditionalRulesPanel } from './ConditionalRulesPanel';
import { FormProvider } from '../contexts/FormContext';
import { Eye, Settings, Zap, Code, Play } from 'lucide-react';

export const FormBuilder: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'fields' | 'rules' | 'settings'>('fields');
  const [showPreview, setShowPreview] = useState(false);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  const tabs = [
    { id: 'fields', label: 'Fields', icon: Zap },
    { id: 'rules', label: 'Rules', icon: Code },
    { id: 'settings', label: 'Settings', icon: Settings }
  ] as const;

  return (
    <FormProvider>
      <div className="flex flex-col h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">FormCraft</h1>
            </div>
            <div className="h-6 w-px bg-gray-300 ml-2"></div>
            <span className="text-sm text-gray-600">Dynamic Form Builder</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPreview(true)}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>

            <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium">
              <Play className="w-4 h-4" />
              Test Form
            </button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            <div className="border-b border-gray-200">
              <div className="flex">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-purple-600 text-purple-600 bg-purple-50'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {activeTab === 'fields' && <FormFieldLibrary />}
              {activeTab === 'rules' && <ConditionalRulesPanel selectedFieldId={selectedFieldId} />}
              {activeTab === 'settings' && <div className="p-4">Form Settings Panel</div>}
            </div>
          </div>

          {/* Canvas */}
          <FormCanvas
            selectedFieldId={selectedFieldId}
            onFieldSelect={setSelectedFieldId}
          />

          {/* Properties Panel */}
          <FormPropertiesPanel
            selectedFieldId={selectedFieldId}
            onFieldSelect={setSelectedFieldId}
          />
        </div>

        {/* Preview Modal */}
        {showPreview && (
          <FormPreview onClose={() => setShowPreview(false)} />
        )}
      </div>
    </FormProvider>
  );
};
