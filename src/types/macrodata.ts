export interface NumberCell {
  id: string;
  value: number;
  x: number;
  y: number;
  gridX: number;
  gridY: number;
  offsetX: number;
  offsetY: number;
  targetOffsetX: number;
  targetOffsetY: number;
  pulsePhase: number;
  isMoving: boolean;
  movementLevel?: 'low' | 'normal' | 'high';
  movementIntensity: number;
  personalityInfluence: number;
}

export interface GridGroup {
  centerX: number;
  centerY: number;
  cells: NumberCell[];
  isValid: boolean;
}

export interface RefinedData {
  wrath: number;
  dread: number;
  malice: number;
  envy: number;
}

export interface SurveyData {
  stressLevel: number;
  workSatisfaction: number;
  sleepQuality: number;
  socialPreference: number;
  riskTolerance: number;
  emotionalSensitivity: number;
  focusLevel: number;
  creativityLevel: number;
  anxietyLevel: number;
  optimismLevel: number;
  memoryRetention: number;
  decisionMaking: number;
  adaptability: number;
  teamwork: number;
  timeManagement: number;
  conflictResolution: number;
  innovationDrive: number;
  detailOrientation: number;
  communicationStyle: number;
  workPressure: number;
}

export interface GameState {
  sessionCount: number;
  progress: number;
  dataIntegrity: number;
  selectedGroup: GridGroup | null;
  hoveredGroup: GridGroup | null;
  refinedData: RefinedData;
  surveyCompleted: boolean;
  surveyData: SurveyData | null;
}