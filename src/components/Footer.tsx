import React from 'react';

const Footer: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-black bg-opacity-70 backdrop-blur-sm border-t border-white border-opacity-10 p-4">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-sm text-gray-400">
          <span className="lumon-cyan font-mono">CLICK</span> any number to select 3×3 group • 
          <span className="lumon-cyan font-mono ml-2">ENTER</span> to refine selection • 
          <span className="lumon-cyan font-mono ml-2">HOVER</span> to preview group
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Lumon Industries © 2024 • Macrodata Refinement Department • Classification: CONFIDENTIAL
        </p>
      </div>
    </div>
  );
};

export default Footer;