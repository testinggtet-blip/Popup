import React from 'react';
import { usePopup } from '../contexts/PopupContext';
import { PopupRenderer } from './PopupRenderer';

export const Canvas: React.FC = () => {
  const { currentPopup, selectedElement, setSelectedElement } = usePopup();

  return (
    <div className="flex-1 bg-gray-100 flex items-center justify-center p-8 overflow-auto">
      <div 
        className="relative bg-white rounded-lg shadow-xl"
        style={{
          width: currentPopup.style.width,
          height: currentPopup.style.height,
          minHeight: currentPopup.style.height,
          backgroundColor: currentPopup.style.backgroundColor,
          borderRadius: currentPopup.style.borderRadius,
          padding: currentPopup.style.padding
        }}
        onClick={() => setSelectedElement(null)}
      >
        <PopupRenderer 
          popup={currentPopup}
          selectedElement={selectedElement}
          onElementSelect={setSelectedElement}
          isEditMode={true}
        />
        
        {currentPopup.elements.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <p className="text-lg font-medium mb-2">Start building your popup</p>
              <p className="text-sm">Drag components from the sidebar to get started</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};