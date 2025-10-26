import React, { useState } from 'react';
import { FormFieldLibrary } from './FormFieldLibrary';
import { FormCanvas } from './FormCanvas';
import { FormPropertiesPanel } from './FormPropertiesPanel';
import { FormPreview } from './FormPreview';
import { ConditionalRulesPanel } from './ConditionalRulesPanel';
import { FormBuilderHeader } from './FormBuilderHeader';
import { FormProvider } from '../contexts/FormContext';
import { Settings, Zap, Code } from 'lucide-react';

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
        <FormBuilderHeader onPreview={() => setShowPreview(true)} />

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
                          ? 'border-blue-600 text-blue-600 bg-blue-50'
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
