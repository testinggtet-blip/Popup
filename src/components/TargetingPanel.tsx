import React from 'react';
import { usePopup } from '../contexts/PopupContext';

export const TargetingPanel: React.FC = () => {
  const { currentPopup, updateTargeting } = usePopup();

  return (
    <div className="p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Targeting Rules</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trigger
          </label>
          <select
            value={currentPopup.targeting.trigger}
            onChange={(e) => updateTargeting({ trigger: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="immediate">Immediately</option>
            <option value="scroll">On Scroll</option>
            <option value="exit">Exit Intent</option>
            <option value="time">After Time</option>
          </select>
        </div>

        {(currentPopup.targeting.trigger === 'scroll' || currentPopup.targeting.trigger === 'time') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {currentPopup.targeting.trigger === 'scroll' ? 'Scroll Percentage' : 'Delay (seconds)'}
            </label>
            <input
              type="number"
              value={currentPopup.targeting.value || 0}
              onChange={(e) => updateTargeting({ value: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="0"
              max={currentPopup.targeting.trigger === 'scroll' ? '100' : '60'}
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Pages
          </label>
          <textarea
            value={currentPopup.targeting.pages?.join('\n') || ''}
            onChange={(e) => updateTargeting({ pages: e.target.value.split('\n').filter(p => p.trim()) })}
            placeholder="Enter page URLs (one per line)&#10;Use * for all pages"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Device Targeting
          </label>
          <div className="space-y-2">
            {['desktop', 'mobile', 'tablet'].map(device => (
              <label key={device} className="flex items-center">
                <input
                  type="checkbox"
                  checked={currentPopup.targeting.devices?.includes(device) || false}
                  onChange={(e) => {
                    const devices = currentPopup.targeting.devices || [];
                    const newDevices = e.target.checked
                      ? [...devices, device]
                      : devices.filter(d => d !== device);
                    updateTargeting({ devices: newDevices });
                  }}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 capitalize">{device}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};