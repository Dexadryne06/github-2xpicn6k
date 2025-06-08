import React from 'react';
import { GameState } from '@/types/macrodata';

interface HeaderProps {
  gameState: GameState;
}

const Header: React.FC<HeaderProps> = ({ gameState }) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-24 bg-black bg-opacity-50 backdrop-blur-md border-b border-white border-opacity-10 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <h1 className="text-lg font-bold text-white">LUMON INDUSTRIES</h1>
              <p className="text-xs lumon-blue">Macrodata Refinement Interface</p>
            </div>
            
            <div className="text-center">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Session</p>
              <p className="text-xl font-mono font-bold text-white">
                {gameState.sessionCount.toString().padStart(3, '0')}
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
              Data Classification Level
            </p>
            <p className="text-xs font-bold lumon-cyan">CONFIDENTIAL</p>
          </div>
        </div>

        <div className="w-full">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-300 font-medium">Refinement Progress</span>
            <span className="text-sm font-mono lumon-cyan">{gameState.progress.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3">
            <div 
              className="progress-bar h-3 rounded-full transition-all duration-300"
              style={{ width: `${gameState.progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;