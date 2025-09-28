import React from 'react';
import { Type, Square, Image, MessageSquare } from 'lucide-react';
import { usePopup } from '../contexts/PopupContext';

export const ComponentLibrary: React.FC = () => {
  const { addElement } = usePopup();

  const components = [
    {
      type: 'text',
      name: 'Text',
      icon: Type,
      description: 'Add headings and paragraphs'
    },
    {
      type: 'button',
      name: 'Button',
      icon: Square,
      description: 'Call-to-action buttons'
    },
    {
      type: 'image',
      name: 'Image',
      icon: Image,
      description: 'Add images and graphics'
    },
    {
      type: 'input',
      name: 'Input Field',
      icon: MessageSquare,
      description: 'Email and text inputs'
    }
  ];

  const handleAddComponent = (type: string) => {
    const id = `${type}-${Date.now()}`;
    const baseElement = {
      id,
      type: type as any,
      position: { x: 50, y: 50 }
    };

    let element;
    switch (type) {
      case 'text':
        element = {
          ...baseElement,
          content: 'Your text here',
          style: {
            fontSize: '16px',
            color: '#1f2937',
            fontWeight: '400'
          }
        };
        break;
      case 'button':
        element = {
          ...baseElement,
          content: 'Click me',
          style: {
            padding: '12px 24px',
            backgroundColor: '#3b82f6',
            color: '#ffffff',
            borderRadius: '8px',
            fontWeight: '600',
            textAlign: 'center' as const
          }
        };
        break;
      case 'image':
        element = {
          ...baseElement,
          content: 'https://images.pexels.com/photos/3184300/pexels-photo-3184300.jpeg?auto=compress&cs=tinysrgb&w=400',
          style: {
            width: '200px',
            height: '120px',
            borderRadius: '8px'
          }
        };
        break;
      case 'input':
        element = {
          ...baseElement,
          content: 'Enter your email',
          style: {
            padding: '12px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            width: '100%'
          }
        };
        break;
      default:
        return;
    }

    addElement(element);
  };

  return (
    <div className="p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Components</h3>
      <div className="space-y-2">
        {components.map(component => {
          const Icon = component.icon;
          return (
            <button
              key={component.type}
              onClick={() => handleAddComponent(component.type)}
              className="w-full p-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded-lg text-left transition-all duration-200 group"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white group-hover:bg-blue-100 border border-gray-200 group-hover:border-blue-300 rounded-lg flex items-center justify-center transition-colors">
                  <Icon className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-sm">{component.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{component.description}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};