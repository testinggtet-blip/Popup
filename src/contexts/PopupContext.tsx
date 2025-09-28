import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface PopupElement {
  id: string;
  type: 'text' | 'button' | 'image' | 'input' | 'container';
  content: string;
  style: {
    fontSize?: string;
    color?: string;
    backgroundColor?: string;
    padding?: string;
    margin?: string;
    borderRadius?: string;
    border?: string;
    textAlign?: 'left' | 'center' | 'right';
    fontWeight?: string;
    width?: string;
    height?: string;
  };
  position: { x: number; y: number };
}

export interface PopupConfig {
  id: string;
  name: string;
  elements: PopupElement[];
  style: {
    width: string;
    height: string;
    backgroundColor: string;
    borderRadius: string;
    padding: string;
    overlay: string;
  };
  targeting: {
    trigger: 'immediate' | 'scroll' | 'exit' | 'time';
    value?: number;
    pages?: string[];
    devices?: string[];
  };
}

interface PopupContextType {
  currentPopup: PopupConfig;
  selectedElement: PopupElement | null;
  templates: PopupConfig[];
  setCurrentPopup: (popup: PopupConfig) => void;
  setSelectedElement: (element: PopupElement | null) => void;
  addElement: (element: PopupElement) => void;
  updateElement: (id: string, updates: Partial<PopupElement>) => void;
  deleteElement: (id: string) => void;
  updatePopupStyle: (style: Partial<PopupConfig['style']>) => void;
  updateTargeting: (targeting: Partial<PopupConfig['targeting']>) => void;
  loadTemplate: (template: PopupConfig) => void;
}

const PopupContext = createContext<PopupContextType | undefined>(undefined);

const defaultPopup: PopupConfig = {
  id: 'popup-1',
  name: 'New Popup',
  elements: [],
  style: {
    width: '400px',
    height: '300px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    overlay: 'rgba(0, 0, 0, 0.5)'
  },
  targeting: {
    trigger: 'immediate',
    pages: ['*'],
    devices: ['desktop', 'mobile']
  }
};

const templates: PopupConfig[] = [
  {
    id: 'newsletter-1',
    name: 'Newsletter Signup',
    elements: [
      {
        id: 'heading-1',
        type: 'text',
        content: 'Stay Updated!',
        style: {
          fontSize: '24px',
          fontWeight: '700',
          color: '#1f2937',
          textAlign: 'center',
          marginBottom: '8px'
        },
        position: { x: 0, y: 0 }
      },
      {
        id: 'subtitle-1',
        type: 'text',
        content: 'Get the latest news and updates delivered to your inbox.',
        style: {
          fontSize: '14px',
          color: '#6b7280',
          textAlign: 'center',
          marginBottom: '20px'
        },
        position: { x: 0, y: 40 }
      },
      {
        id: 'email-input-1',
        type: 'input',
        content: 'Enter your email',
        style: {
          width: '100%',
          padding: '12px',
          borderRadius: '8px',
          border: '1px solid #d1d5db',
          marginBottom: '16px'
        },
        position: { x: 0, y: 100 }
      },
      {
        id: 'cta-button-1',
        type: 'button',
        content: 'Subscribe Now',
        style: {
          width: '100%',
          padding: '12px 24px',
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          borderRadius: '8px',
          fontWeight: '600',
          textAlign: 'center'
        },
        position: { x: 0, y: 160 }
      }
    ],
    style: {
      width: '400px',
      height: '280px',
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      padding: '32px',
      overlay: 'rgba(0, 0, 0, 0.5)'
    },
    targeting: {
      trigger: 'scroll',
      value: 50,
      pages: ['*'],
      devices: ['desktop', 'mobile']
    }
  },
  {
    id: 'discount-1',
    name: 'Discount Offer',
    elements: [
      {
        id: 'badge-1',
        type: 'text',
        content: '🎉 SPECIAL OFFER',
        style: {
          fontSize: '14px',
          fontWeight: '600',
          color: '#f59e0b',
          textAlign: 'center',
          marginBottom: '12px'
        },
        position: { x: 0, y: 0 }
      },
      {
        id: 'discount-heading-1',
        type: 'text',
        content: 'Get 20% Off',
        style: {
          fontSize: '32px',
          fontWeight: '800',
          color: '#1f2937',
          textAlign: 'center',
          marginBottom: '8px'
        },
        position: { x: 0, y: 30 }
      },
      {
        id: 'discount-subtitle-1',
        type: 'text',
        content: 'Use code SAVE20 at checkout',
        style: {
          fontSize: '16px',
          color: '#6b7280',
          textAlign: 'center',
          marginBottom: '24px'
        },
        position: { x: 0, y: 80 }
      },
      {
        id: 'shop-button-1',
        type: 'button',
        content: 'Shop Now',
        style: {
          width: '100%',
          padding: '16px 32px',
          backgroundColor: '#ef4444',
          color: '#ffffff',
          borderRadius: '8px',
          fontWeight: '700',
          textAlign: 'center'
        },
        position: { x: 0, y: 130 }
      }
    ],
    style: {
      width: '350px',
      height: '250px',
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      padding: '32px',
      overlay: 'rgba(0, 0, 0, 0.6)'
    },
    targeting: {
      trigger: 'exit',
      pages: ['/shop', '/products'],
      devices: ['desktop']
    }
  }
];

export const PopupProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPopup, setCurrentPopup] = useState<PopupConfig>(defaultPopup);
  const [selectedElement, setSelectedElement] = useState<PopupElement | null>(null);

  const addElement = (element: PopupElement) => {
    setCurrentPopup(prev => ({
      ...prev,
      elements: [...prev.elements, element]
    }));
  };

  const updateElement = (id: string, updates: Partial<PopupElement>) => {
    setCurrentPopup(prev => ({
      ...prev,
      elements: prev.elements.map(el => 
        el.id === id ? { ...el, ...updates } : el
      )
    }));
  };

  const deleteElement = (id: string) => {
    setCurrentPopup(prev => ({
      ...prev,
      elements: prev.elements.filter(el => el.id !== id)
    }));
    setSelectedElement(null);
  };

  const updatePopupStyle = (style: Partial<PopupConfig['style']>) => {
    setCurrentPopup(prev => ({
      ...prev,
      style: { ...prev.style, ...style }
    }));
  };

  const updateTargeting = (targeting: Partial<PopupConfig['targeting']>) => {
    setCurrentPopup(prev => ({
      ...prev,
      targeting: { ...prev.targeting, ...targeting }
    }));
  };

  const loadTemplate = (template: PopupConfig) => {
    setCurrentPopup({ ...template, id: Date.now().toString() });
    setSelectedElement(null);
  };

  return (
    <PopupContext.Provider value={{
      currentPopup,
      selectedElement,
      templates,
      setCurrentPopup,
      setSelectedElement,
      addElement,
      updateElement,
      deleteElement,
      updatePopupStyle,
      updateTargeting,
      loadTemplate
    }}>
      {children}
    </PopupContext.Provider>
  );
};

export const usePopup = () => {
  const context = useContext(PopupContext);
  if (context === undefined) {
    throw new Error('usePopup must be used within a PopupProvider');
  }
  return context;
};