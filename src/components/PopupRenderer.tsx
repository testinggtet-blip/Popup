import React from 'react';
import { PopupConfig, PopupElement } from '../contexts/PopupContext';

interface PopupRendererProps {
  popup: PopupConfig;
  selectedElement: PopupElement | null;
  onElementSelect: (element: PopupElement | null) => void;
  isEditMode: boolean;
}

export const PopupRenderer: React.FC<PopupRendererProps> = ({
  popup,
  selectedElement,
  onElementSelect,
  isEditMode
}) => {
  const renderElement = (element: PopupElement) => {
    const isSelected = selectedElement?.id === element.id;
    const className = `${isEditMode ? 'cursor-pointer hover:outline hover:outline-2 hover:outline-blue-400' : ''} ${
      isSelected ? 'outline outline-2 outline-blue-600' : ''
    }`;

    const commonProps = {
      key: element.id,
      className,
      style: {
        ...element.style,
        position: 'relative' as const,
        display: 'block',
        marginBottom: element.style.marginBottom || '0'
      },
      onClick: isEditMode ? (e: React.MouseEvent) => {
        e.stopPropagation();
        onElementSelect(element);
      } : undefined
    };

    switch (element.type) {
      case 'text':
        return (
          <div {...commonProps}>
            {element.content}
          </div>
        );
      
      case 'button':
        return (
          <button 
            {...commonProps}
            style={{
              ...commonProps.style,
              border: 'none',
              cursor: isEditMode ? 'pointer' : 'pointer'
            }}
          >
            {element.content}
          </button>
        );
      
      case 'image':
        return (
          <img
            {...commonProps}
            src={element.content}
            alt="Popup image"
            style={{
              ...commonProps.style,
              objectFit: 'cover' as const
            }}
          />
        );
      
      case 'input':
        return (
          <input
            {...commonProps}
            type="email"
            placeholder={element.content}
            disabled={isEditMode}
            style={{
              ...commonProps.style,
              outline: isSelected ? '2px solid #2563eb' : element.style.border || '1px solid #d1d5db'
            }}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-0">
      {popup.elements.map(renderElement)}
    </div>
  );
};