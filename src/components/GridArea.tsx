import React, { useEffect, useRef, useCallback, useState } from 'react';
import { NumberCell, GridGroup } from '@/types/macrodata';

interface GridAreaProps {
  numbers: NumberCell[];
  selectedGroup: GridGroup | null;
  hoveredGroup: GridGroup | null;
  onGroupSelect: (group: GridGroup) => void;
  onGroupHover: (group: GridGroup | null) => void;
  validGroups: GridGroup[];
}

const GridArea: React.FC<GridAreaProps> = ({
  numbers,
  selectedGroup,
  hoveredGroup,
  onGroupSelect,
  onGroupHover,
  validGroups
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const [zoom, setZoom] = useState(1);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const updatePositions = useCallback((currentTime: number) => {
    if (!containerRef.current) return;

    numbers.forEach(number => {
      if (number.isMoving) {
        // Movimento più intenso e variabile basato sui dati survey
        const timeFactorX = Math.sin(currentTime * 0.0015 + number.pulsePhase);
        const timeFactorY = Math.cos(currentTime * 0.0012 + number.pulsePhase + 1.5);
        const timeFactorZ = Math.sin(currentTime * 0.0018 + number.pulsePhase + 3);
        
        // Ampiezza variabile basata su intensità del movimento
        let baseAmplitude = 3; // Aumentato significativamente
        
        // Applica modificatori basati sui dati survey
        if (number.movementLevel === 'high') {
          baseAmplitude *= 1.4; // +40% come richiesto
        } else if (number.movementLevel === 'low') {
          baseAmplitude *= 0.8; // -20% come richiesto
        }
        
        // Movimento più complesso e visibile
        const personalityFactor = number.personalityInfluence * 0.6 + 0.4;
        const intensityFactor = number.movementIntensity * 1.2;
        
        const targetX = (timeFactorX + timeFactorZ * 0.4) * baseAmplitude * intensityFactor;
        const targetY = (timeFactorY + timeFactorX * 0.3) * baseAmplitude * personalityFactor;

        // Smoothing per movimento più fluido
        const smoothing = 0.12; // Aumentato per movimento più responsivo
        number.targetOffsetX = number.targetOffsetX * (1 - smoothing) + targetX * smoothing;
        number.targetOffsetY = number.targetOffsetY * (1 - smoothing) + targetY * smoothing;

        const element = containerRef.current?.querySelector(`[data-cell-id="${number.id}"]`) as HTMLElement;
        if (element) {
          element.style.transform = `translate3d(${number.targetOffsetX}px, ${number.targetOffsetY}px, 0) scale(${element.dataset.dockScale || 1})`;
        }
      }
    });

    animationFrameRef.current = requestAnimationFrame(updatePositions);
  }, [numbers]);

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(updatePositions);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [updatePositions]);

  // Gestione zoom con rotella del mouse
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoom(prev => Math.max(0.5, Math.min(2, prev + delta)));
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, []);

  // Track mouse position for dock effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left) / zoom,
          y: (e.clientY - rect.top) / zoom
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, [zoom]);

  const getGroupFromPosition = (x: number, y: number): GridGroup | null => {
    const group: NumberCell[] = [];
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const targetX = x + dx;
        const targetY = y + dy;
        const cell = numbers.find(n => n.gridX === targetX && n.gridY === targetY);
        if (cell) {
          group.push(cell);
        }
      }
    }
    
    if (group.length === 9) {
      const isValid = validGroups.some(vg => 
        vg.centerX === x && vg.centerY === y
      );
      return {
        centerX: x,
        centerY: y,
        cells: group,
        isValid
      };
    }
    
    return null;
  };

  const handleCellClick = (number: NumberCell) => {
    const group = getGroupFromPosition(number.gridX, number.gridY);
    if (group) {
      onGroupSelect(group);
    }
  };

  const handleCellHover = (number: NumberCell | null) => {
    if (!number) {
      onGroupHover(null);
      return;
    }
    
    const group = getGroupFromPosition(number.gridX, number.gridY);
    onGroupHover(group);
  };

  const isCellSelected = (cell: NumberCell): boolean => {
    return selectedGroup?.cells.some(c => c.id === cell.id) || false;
  };

  const isCellHovered = (cell: NumberCell): boolean => {
    return hoveredGroup?.cells.some(c => c.id === cell.id) || false;
  };

  // Calculate dock-style scaling for each cell
  const getDockScale = (cell: NumberCell): number => {
    const cellCenterX = cell.x + 11; // Half of cell width
    const cellCenterY = cell.y + 12.5; // Half of cell height
    
    const distance = Math.sqrt(
      Math.pow(mousePosition.x - cellCenterX, 2) + 
      Math.pow(mousePosition.y - cellCenterY, 2)
    );
    
    // Dock effect parameters
    const maxDistance = 80; // Maximum distance for effect
    const maxScale = 2.2; // Maximum scale factor
    const minScale = 1.0; // Minimum scale factor
    
    if (distance > maxDistance) return minScale;
    
    // Smooth scaling curve (similar to macOS dock)
    const normalizedDistance = distance / maxDistance;
    const scaleFactor = 1 - Math.pow(normalizedDistance, 2);
    
    return minScale + (maxScale - minScale) * scaleFactor;
  };

  return (
    <div className="flex-1 overflow-auto p-4 cyber-grid-background">
      <div className="flex justify-center">
        <div 
          ref={containerRef}
          className="relative will-change-transform transition-transform duration-200 ease-out"
          style={{ 
            width: '1800px', 
            height: '1200px',
            minWidth: '1800px',
            minHeight: '1200px',
            transform: `scale(${zoom})`,
            transformOrigin: 'center center'
          }}
        >
          {numbers.map(number => {
            const dockScale = getDockScale(number);
            const isSelected = isCellSelected(number);
            const isHovered = isCellHovered(number);
            
            return (
              <div
                key={number.id}
                data-cell-id={number.id}
                data-dock-scale={dockScale}
                className={`number-cell absolute will-change-transform transition-all duration-150 ease-out ${
                  isSelected ? 'selected' : ''
                } ${
                  isHovered && !isSelected ? 'hovered' : ''
                }`}
                style={{
                  left: `${number.x}px`,
                  top: `${number.y}px`,
                  transform: `scale(${dockScale})`,
                  zIndex: Math.floor(dockScale * 10),
                }}
                onClick={() => handleCellClick(number)}
                onMouseEnter={() => handleCellHover(number)}
                onMouseLeave={() => handleCellHover(null)}
              >
                {number.value}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Controlli zoom */}
      <div className="fixed bottom-20 right-4 flex flex-col gap-2">
        <button 
          onClick={() => setZoom(prev => Math.min(2, prev + 0.2))}
          className="cyber-button w-10 h-10 flex items-center justify-center"
        >
          +
        </button>
        <div className="text-xs text-cyber-purple text-center">
          {Math.round(zoom * 100)}%
        </div>
        <button 
          onClick={() => setZoom(prev => Math.max(0.5, prev - 0.2))}
          className="cyber-button w-10 h-10 flex items-center justify-center"
        >
          -
        </button>
      </div>
    </div>
  );
};

export default GridArea;