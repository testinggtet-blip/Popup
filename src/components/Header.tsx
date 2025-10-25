import React from 'react';
import { Eye, Download, Save, Zap, FormInput } from 'lucide-react';

interface HeaderProps {
  onPreview: () => void;
  activeMode?: 'popup' | 'form';
  onModeChange?: (mode: 'popup' | 'form') => void;
}

export const Header: React.FC<HeaderProps> = ({ onPreview, activeMode = 'popup', onModeChange }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 bg-gradient-to-br ${
            activeMode === 'popup' 
              ? 'from-blue-500 to-purple-600' 
              : 'from-purple-500 to-pink-600'
          } rounded-lg flex items-center justify-center`}>
            {activeMode === 'popup' ? (
              <Zap className="w-5 h-5 text-white" />
            ) : (
              <FormInput className="w-5 h-5 text-white" />
            )}
          </div>
          <h1 className="text-xl font-bold text-gray-900">
            {activeMode === 'popup' ? 'PopupCraft' : 'FormCraft'}
          </h1>
        </div>
        <div className="h-6 w-px bg-gray-300 ml-2"></div>
        <span className="text-sm text-gray-600">
          {activeMode === 'popup' ? 'No-Code Popup Builder' : 'Dynamic Form Builder'}
        </span>
      </div>

      <div className="flex items-center gap-3">
        {onModeChange && (
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => onModeChange('popup')}
              className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                activeMode === 'popup'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Zap className="w-4 h-4" />
              Popup
            </button>
            <button
              onClick={() => onModeChange('form')}
              className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                activeMode === 'form'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FormInput className="w-4 h-4" />
              Form
            </button>
          </div>
        )}
        
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
        
        <button className={`flex items-center gap-2 px-4 py-2 ${
          activeMode === 'popup' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-purple-600 hover:bg-purple-700'
        } text-white rounded-lg transition-colors font-medium`}>
          <Download className="w-4 h-4" />
          Export Code
        </button>
      </div>
    </header>
  );
};