import React from 'react';
import { usePopup } from '../contexts/PopupContext';
import { Trash2, Settings } from 'lucide-react';

export const PropertiesPanel: React.FC = () => {
  const { selectedElement, currentPopup, updateElement, deleteElement, updatePopupStyle } = usePopup();

  if (!selectedElement) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-4 h-4 text-gray-600" />
          <h3 className="text-sm font-semibold text-gray-900">Popup Settings</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Width</label>
            <input
              type="text"
              value={currentPopup.style.width}
              onChange={(e) => updatePopupStyle({ width: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
            <input
              type="text"
              value={currentPopup.style.height}
              onChange={(e) => updatePopupStyle({ height: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
            <input
              type="color"
              value={currentPopup.style.backgroundColor}
              onChange={(e) => updatePopupStyle({ backgroundColor: e.target.value })}
              className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Border Radius</label>
            <input
              type="text"
              value={currentPopup.style.borderRadius}
              onChange={(e) => updatePopupStyle({ borderRadius: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Padding</label>
            <input
              type="text"
              value={currentPopup.style.padding}
              onChange={(e) => updatePopupStyle({ padding: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-gray-600" />
          <h3 className="text-sm font-semibold text-gray-900">Element Properties</h3>
        </div>
        <button
          onClick={() => deleteElement(selectedElement.id)}
          className="p-1 text-red-600 hover:bg-red-50 rounded"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
          <textarea
            value={selectedElement.content}
            onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows={3}
          />
        </div>

        {selectedElement.type === 'text' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
              <input
                type="text"
                value={selectedElement.style.fontSize || '16px'}
                onChange={(e) => updateElement(selectedElement.id, { 
                  style: { ...selectedElement.style, fontSize: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Font Weight</label>
              <select
                value={selectedElement.style.fontWeight || '400'}
                onChange={(e) => updateElement(selectedElement.id, { 
                  style: { ...selectedElement.style, fontWeight: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="300">Light</option>
                <option value="400">Normal</option>
                <option value="600">Semi Bold</option>
                <option value="700">Bold</option>
                <option value="800">Extra Bold</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Text Align</label>
              <select
                value={selectedElement.style.textAlign || 'left'}
                onChange={(e) => updateElement(selectedElement.id, { 
                  style: { ...selectedElement.style, textAlign: e.target.value as any }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
          <input
            type="color"
            value={selectedElement.style.color || '#000000'}
            onChange={(e) => updateElement(selectedElement.id, { 
              style: { ...selectedElement.style, color: e.target.value }
            })}
            className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
          />
        </div>

        {(selectedElement.type === 'button' || selectedElement.type === 'input') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
            <input
              type="color"
              value={selectedElement.style.backgroundColor || '#ffffff'}
              onChange={(e) => updateElement(selectedElement.id, { 
                style: { ...selectedElement.style, backgroundColor: e.target.value }
              })}
              className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Padding</label>
          <input
            type="text"
            value={selectedElement.style.padding || '0px'}
            onChange={(e) => updateElement(selectedElement.id, { 
              style: { ...selectedElement.style, padding: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Margin Bottom</label>
          <input
            type="text"
            value={selectedElement.style.marginBottom || '0px'}
            onChange={(e) => updateElement(selectedElement.id, { 
              style: { ...selectedElement.style, marginBottom: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Border Radius</label>
          <input
            type="text"
            value={selectedElement.style.borderRadius || '0px'}
            onChange={(e) => updateElement(selectedElement.id, { 
              style: { ...selectedElement.style, borderRadius: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
};