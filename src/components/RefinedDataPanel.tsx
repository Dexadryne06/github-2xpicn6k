import React from 'react';
import { RefinedData } from '@/types/macrodata';

interface RefinedDataPanelProps {
  refinedData: RefinedData;
}

const RefinedDataPanel: React.FC<RefinedDataPanelProps> = ({ refinedData }) => {
  const dataCategories = [
    { 
      key: 'wrath' as keyof RefinedData, 
      label: 'WRATH', 
      className: 'bg-lumon-wrath lumon-wrath' 
    },
    { 
      key: 'dread' as keyof RefinedData, 
      label: 'DREAD', 
      className: 'bg-lumon-dread lumon-dread' 
    },
    { 
      key: 'malice' as keyof RefinedData, 
      label: 'MALICE', 
      className: 'bg-lumon-malice lumon-malice' 
    },
    { 
      key: 'envy' as keyof RefinedData, 
      label: 'ENVY', 
      className: 'bg-lumon-envy lumon-envy' 
    },
  ];

  return (
    <div className="fixed bottom-16 left-0 right-0 z-50 h-32 bg-black bg-opacity-50 backdrop-blur-md border-t border-white border-opacity-10 p-4">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-sm font-bold text-white mb-3 text-center">
          REFINED DATA OUTPUT
        </h3>
        
        <div className="grid grid-cols-4 gap-4">
          {dataCategories.map(({ key, label, className }) => (
            <div key={key} className={`refined-box p-3 text-center ${className}`}>
              <h4 className="text-xs font-bold text-white mb-1 tracking-wider">
                {label}
              </h4>
              <div className="text-lg font-mono font-bold text-white">
                {refinedData[key].toFixed(1)}%
              </div>
              <div className="text-xs text-white text-opacity-70 mt-1">
                {refinedData[key] > 15 ? 'HIGH' : refinedData[key] > 10 ? 'MEDIUM' : 'LOW'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RefinedDataPanel;