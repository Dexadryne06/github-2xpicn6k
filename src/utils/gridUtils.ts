import { NumberCell, GridGroup, RefinedData, SurveyData, GameState } from '@/types/macrodata';

export const GRID_WIDTH = 1800;
export const GRID_HEIGHT = 1200;
export const CELL_WIDTH = 22;
export const CELL_HEIGHT = 25;
export const COLS = Math.floor(GRID_WIDTH / CELL_WIDTH);
export const ROWS = Math.floor(GRID_HEIGHT / CELL_HEIGHT);

export const generateNumbers = (surveyData?: SurveyData | null): NumberCell[] => {
  const numbers: NumberCell[] = [];
  
  // Calcola pattern di movimento complessi basati sui dati survey estesi
  const getMovementCharacteristics = (x: number, y: number): { intensity: number, personality: number, level: 'low' | 'normal' | 'high' } => {
    if (!surveyData) {
      const baseIntensity = Math.random();
      return {
        intensity: baseIntensity,
        personality: Math.random(),
        level: baseIntensity > 0.7 ? 'high' : baseIntensity < 0.3 ? 'low' : 'normal'
      };
    }
    
    // Fattori emotivi e cognitivi
    const emotionalFactor = (surveyData.stressLevel + surveyData.anxietyLevel + surveyData.emotionalSensitivity) / 60;
    const cognitiveFactor = (surveyData.focusLevel + surveyData.memoryRetention + surveyData.detailOrientation) / 60;
    const creativeFactor = (surveyData.creativityLevel + surveyData.innovationDrive + surveyData.adaptability) / 60;
    const socialFactor = (surveyData.socialPreference + surveyData.teamwork + surveyData.communicationStyle) / 60;
    const pressureFactor = (surveyData.workPressure + surveyData.decisionMaking + surveyData.timeManagement) / 60;
    
    // Pattern spaziali basati sulla posizione
    const spatialX = Math.sin(x * 0.05) * 0.5 + 0.5;
    const spatialY = Math.cos(y * 0.05) * 0.5 + 0.5;
    const radialDistance = Math.sqrt(Math.pow(x - COLS/2, 2) + Math.pow(y - ROWS/2, 2)) / Math.sqrt(Math.pow(COLS/2, 2) + Math.pow(ROWS/2, 2));
    
    // Combinazione complessa dei fattori
    let baseIntensity = 0;
    
    // Zone emotive (angoli e bordi)
    if (x < COLS * 0.2 || x > COLS * 0.8 || y < ROWS * 0.2 || y > ROWS * 0.8) {
      baseIntensity += emotionalFactor * 0.4;
    }
    
    // Zone cognitive (centro)
    if (radialDistance < 0.3) {
      baseIntensity += cognitiveFactor * 0.3;
    }
    
    // Zone creative (pattern diagonali)
    if ((x + y) % 7 === 0 || Math.abs(x - y) % 5 === 0) {
      baseIntensity += creativeFactor * 0.3;
    }
    
    // Zone sociali (cluster)
    if ((x % 3 === 0 && y % 3 === 0) || (x % 4 === 1 && y % 4 === 1)) {
      baseIntensity += socialFactor * 0.25;
    }
    
    // Zone di pressione (pattern irregolari)
    if ((x * y) % 11 === 0 || (x + y * 2) % 13 === 0) {
      baseIntensity += pressureFactor * 0.35;
    }
    
    // Influenza spaziale
    baseIntensity += (spatialX + spatialY) * 0.2;
    
    // Normalizza e aggiungi variazione
    baseIntensity = Math.max(0.1, Math.min(1, baseIntensity + (Math.random() - 0.5) * 0.3));
    
    // Calcola personalità (stabilità del movimento)
    const personalityScore = (surveyData.optimismLevel + surveyData.workSatisfaction + surveyData.sleepQuality) / 60;
    
    // Determina livello di movimento
    let movementLevel: 'low' | 'normal' | 'high';
    if (baseIntensity > 0.75) {
      movementLevel = 'high';
    } else if (baseIntensity < 0.35) {
      movementLevel = 'low';
    } else {
      movementLevel = 'normal';
    }
    
    return {
      intensity: baseIntensity,
      personality: personalityScore,
      level: movementLevel
    };
  };
  
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const id = `${row}-${col}`;
      const x = col * CELL_WIDTH;
      const y = row * CELL_HEIGHT;
      
      const movement = getMovementCharacteristics(col, row);
      
      numbers.push({
        id,
        value: Math.floor(Math.random() * 10),
        x,
        y,
        gridX: col,
        gridY: row,
        offsetX: 0,
        offsetY: 0,
        targetOffsetX: 0,
        targetOffsetY: 0,
        pulsePhase: Math.random() * Math.PI * 2,
        isMoving: Math.random() < (0.2 + movement.intensity * 0.3), // 20-50% chance based on intensity
        movementLevel: movement.level,
        movementIntensity: movement.intensity,
        personalityInfluence: movement.personality
      });
    }
  }
  
  return numbers;
};

export const generateValidGroups = (numbers: NumberCell[]): GridGroup[] => {
  const validGroups: GridGroup[] = [];
  const totalPossibleGroups = (COLS - 2) * (ROWS - 2);
  const targetValidGroups = Math.floor(totalPossibleGroups * 0.3);
  
  const usedPositions = new Set<string>();
  
  while (validGroups.length < targetValidGroups) {
    const centerX = Math.floor(Math.random() * (COLS - 2)) + 1;
    const centerY = Math.floor(Math.random() * (ROWS - 2)) + 1;
    const posKey = `${centerX}-${centerY}`;
    
    if (usedPositions.has(posKey)) continue;
    
    const cells: NumberCell[] = [];
    let validGroup = true;
    
    for (let dy = -1; dy <= 1 && validGroup; dy++) {
      for (let dx = -1; dx <= 1 && validGroup; dx++) {
        const cell = numbers.find(n => n.gridX === centerX + dx && n.gridY === centerY + dy);
        if (cell) {
          cells.push(cell);
        } else {
          validGroup = false;
        }
      }
    }
    
    if (validGroup && cells.length === 9) {
      validGroups.push({
        centerX,
        centerY,
        cells,
        isValid: true
      });
      usedPositions.add(posKey);
    }
  }
  
  return validGroups;
};

export const updateRefinedData = (current: RefinedData, progress: number): RefinedData => {
  // I contenitori si riempiono in modo non uniforme ma proporzionale al progresso
  const progressFactor = progress / 100;
  const randomVariation = () => Math.random() * 0.3 + 0.85; // 85-115% variation
  
  return {
    wrath: Math.min(100, current.wrath + (Math.random() * 15 + 8) * randomVariation()),
    dread: Math.min(100, current.dread + (Math.random() * 15 + 8) * randomVariation()),
    malice: Math.min(100, current.malice + (Math.random() * 15 + 8) * randomVariation()),
    envy: Math.min(100, current.envy + (Math.random() * 15 + 8) * randomVariation()),
  };
};

// localStorage utilities
export const saveGameState = (gameState: GameState) => {
  localStorage.setItem('lumon-macrodata-state', JSON.stringify(gameState));
};

export const loadGameState = (): GameState | null => {
  try {
    const saved = localStorage.getItem('lumon-macrodata-state');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

export const saveSurveyData = (surveyData: SurveyData) => {
  localStorage.setItem('lumon-survey-data', JSON.stringify(surveyData));
};

export const loadSurveyData = (): SurveyData | null => {
  try {
    const saved = localStorage.getItem('lumon-survey-data');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

export const isSurveyCompleted = (): boolean => {
  return localStorage.getItem('lumon-survey-completed') === 'true';
};

export const markSurveyCompleted = () => {
  localStorage.setItem('lumon-survey-completed', 'true');
};