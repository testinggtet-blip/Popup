import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Canvas } from './components/Canvas';
import { PropertiesPanel } from './components/PropertiesPanel';
import { PreviewModal } from './components/PreviewModal';
import { Header } from './components/Header';
import { PopupProvider } from './contexts/PopupContext';

function App() {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <PopupProvider>
      <div className="flex flex-col h-screen bg-gray-50">
        <Header onPreview={() => setShowPreview(true)} />
        
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <Canvas />
          <PropertiesPanel />
        </div>

        {showPreview && (
          <PreviewModal onClose={() => setShowPreview(false)} />
        )}
      </div>
    </PopupProvider>
  );
}

export default App;