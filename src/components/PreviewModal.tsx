import React from 'react';
import { X } from 'lucide-react';
import { usePopup } from '../contexts/PopupContext';
import { PopupRenderer } from './PopupRenderer';

interface PreviewModalProps {
  onClose: () => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ onClose }) => {
  const { currentPopup } = usePopup();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0"
        style={{ backgroundColor: currentPopup.style.overlay }}
        onClick={onClose}
      />
      
      <div className="relative">
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-900 z-10"
        >
          <X className="w-4 h-4" />
        </button>
        
        <div
          className="relative bg-white shadow-2xl"
          style={{
            width: currentPopup.style.width,
            height: currentPopup.style.height,
            backgroundColor: currentPopup.style.backgroundColor,
            borderRadius: currentPopup.style.borderRadius,
            padding: currentPopup.style.padding
          }}
        >
          <PopupRenderer 
            popup={currentPopup}
            selectedElement={null}
            onElementSelect={() => {}}
            isEditMode={false}
          />
        </div>
      </div>
    </div>
  );
};