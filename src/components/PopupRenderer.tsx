import React from 'react';
import { Star } from 'lucide-react';
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
  const [timers, setTimers] = React.useState<{[key: string]: number}>({});
  const [ratings, setRatings] = React.useState<{[key: string]: number}>({});
  const [scales, setScales] = React.useState<{[key: string]: number}>({});

  React.useEffect(() => {
    const intervals: {[key: string]: NodeJS.Timeout} = {};
    
    popup.elements.forEach(element => {
      if (element.type === 'timer' && !isEditMode) {
        const countdown = element.style.countdown || parseInt(element.content) || 300;
        if (!timers[element.id]) {
          setTimers(prev => ({ ...prev, [element.id]: countdown }));
        }
        
        intervals[element.id] = setInterval(() => {
          setTimers(prev => {
            const newTime = Math.max(0, (prev[element.id] || countdown) - 1);
            return { ...prev, [element.id]: newTime };
          });
        }, 1000);
      }
    });

    return () => {
      Object.values(intervals).forEach(interval => clearInterval(interval));
    };
  }, [popup.elements, isEditMode]);

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
      
      case 'star':
        const maxRating = element.style.maxRating || 5;
        const currentRating = ratings[element.id] || element.style.rating || 0;
        
        return (
          <div {...commonProps}>
            <div className="flex items-center gap-1">
              {Array.from({ length: maxRating }, (_, index) => (
                <Star
                  key={index}
                  className={`cursor-pointer transition-colors ${
                    index < currentRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                  style={{
                    fontSize: element.style.fontSize || '24px',
                    color: index < currentRating 
                      ? element.style.activeColor || '#fbbf24'
                      : element.style.starColor || '#d1d5db'
                  }}
                  onClick={!isEditMode ? (e) => {
                    e.stopPropagation();
                    setRatings(prev => ({ ...prev, [element.id]: index + 1 }));
                  } : undefined}
                />
              ))}
              {currentRating > 0 && (
                <span className="ml-2 text-sm text-gray-600">
                  {currentRating}/{maxRating}
                </span>
              )}
            </div>
          </div>
        );
      
      case 'timer':
        const timeLeft = isEditMode 
          ? (element.style.countdown || parseInt(element.content) || 300)
          : (timers[element.id] || parseInt(element.content) || 300);
        
        const formatTime = (seconds: number) => {
          const mins = Math.floor(seconds / 60);
          const secs = seconds % 60;
          return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        };
        
        return (
          <div {...commonProps}>
            <div className="text-center">
              <div 
                className="font-mono"
                style={{
                  fontSize: element.style.fontSize || '24px',
                  fontWeight: element.style.fontWeight || '700',
                  color: timeLeft <= 60 ? '#ef4444' : element.style.color || '#374151'
                }}
              >
                {formatTime(timeLeft)}
              </div>
              {!isEditMode && timeLeft === 0 && (
                <div className="text-sm text-red-600 mt-1 animate-pulse">
                  Time's up!
                </div>
              )}
            </div>
          </div>
        );
      
      case 'scale':
        const scaleMin = element.style.scaleMin || 1;
        const scaleMax = element.style.scaleMax || 10;
        const scaleValue = scales[element.id] || element.style.scaleValue || Math.floor((scaleMin + scaleMax) / 2);
        
        return (
          <div {...commonProps}>
            <div className="text-center">
              <div className="flex items-center justify-between mb-2 text-sm text-gray-600">
                <span>{scaleMin}</span>
                <span className="font-medium">Rate: {scaleValue}</span>
                <span>{scaleMax}</span>
              </div>
              <div className="flex gap-1 justify-center">
                {Array.from({ length: scaleMax - scaleMin + 1 }, (_, index) => {
                  const value = scaleMin + index;
                  return (
                    <button
                      key={value}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        value === scaleValue
                          ? 'bg-blue-500 border-blue-500 text-white'
                          : 'bg-white border-gray-300 text-gray-600 hover:border-blue-300'
                      }`}
                      style={{ fontSize: element.style.fontSize || '14px' }}
                      onClick={!isEditMode ? (e) => {
                        e.stopPropagation();
                        setScales(prev => ({ ...prev, [element.id]: value }));
                      } : undefined}
                      disabled={isEditMode}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
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