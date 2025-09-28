import React from 'react';
import { usePopup } from '../contexts/PopupContext';

export const TemplateLibrary: React.FC = () => {
  const { templates, loadTemplate } = usePopup();

  return (
    <div className="p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Templates</h3>
      <div className="space-y-4">
        {templates.map(template => (
          <div
            key={template.id}
            className="group cursor-pointer"
            onClick={() => loadTemplate(template)}
          >
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 group-hover:border-blue-300 rounded-lg p-4 transition-all duration-200 group-hover:shadow-md">
              <div className="aspect-video bg-white rounded-lg mb-3 flex items-center justify-center border border-gray-200 group-hover:border-blue-200 transition-colors">
                <div className="text-center">
                  <div className="w-12 h-8 bg-blue-100 rounded mx-auto mb-2"></div>
                  <div className="space-y-1">
                    <div className="w-16 h-2 bg-gray-200 rounded mx-auto"></div>
                    <div className="w-12 h-2 bg-gray-100 rounded mx-auto"></div>
                  </div>
                </div>
              </div>
              
              <div className="font-medium text-sm text-gray-900">{template.name}</div>
              <div className="text-xs text-gray-500 mt-1">
                {template.elements.length} components
              </div>
              
              <div className="mt-2 px-3 py-1 bg-blue-50 group-hover:bg-blue-100 text-blue-600 text-xs rounded-full inline-block transition-colors">
                Use Template
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};