import React, { useState } from 'react';
import { ComponentLibrary } from './ComponentLibrary';
import { TemplateLibrary } from './TemplateLibrary';
import { TargetingPanel } from './TargetingPanel';
import { Layers, Palette, Target } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'components' | 'templates' | 'targeting'>('components');

  const tabs = [
    { id: 'components', label: 'Components', icon: Layers },
    { id: 'templates', label: 'Templates', icon: Palette },
    { id: 'targeting', label: 'Targeting', icon: Target }
  ] as const;

  return (
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
        {activeTab === 'components' && <ComponentLibrary />}
        {activeTab === 'templates' && <TemplateLibrary />}
        {activeTab === 'targeting' && <TargetingPanel />}
      </div>
    </div>
  );
};