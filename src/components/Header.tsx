import React from 'react';
import { Eye, Download, Save, Zap } from 'lucide-react';

interface HeaderProps {
  onPreview: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onPreview }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">PopupCraft</h1>
        </div>
        <div className="h-6 w-px bg-gray-300 ml-2"></div>
        <span className="text-sm text-gray-600">No-Code Popup Builder</span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onPreview}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <Eye className="w-4 h-4" />
          Preview
        </button>
        
        <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
          <Save className="w-4 h-4" />
          Save
        </button>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">
          <Download className="w-4 h-4" />
          Export Code
        </button>
      </div>
    </header>
  );
};