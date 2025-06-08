import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import GridArea from '@/components/GridArea';
import RefinedDataPanel from '@/components/RefinedDataPanel';
import Footer from '@/components/Footer';
import Survey from '@/components/Survey';
import { NumberCell, GridGroup, GameState, SurveyData } from '@/types/macrodata';
import { 
  generateNumbers, 
  generateValidGroups, 
  updateRefinedData,
  saveGameState,
  loadGameState,
  saveSurveyData,
  isSurveyCompleted,
  markSurveyCompleted
} from '@/utils/gridUtils';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [numbers, setNumbers] = useState<NumberCell[]>([]);
  const [validGroups, setValidGroups] = useState<GridGroup[]>([]);
  const [gameState, setGameState] = useState<GameState>({
    sessionCount: 1,
    progress: 0,
    dataIntegrity: 100,
    selectedGroup: null,
    hoveredGroup: null,
    refinedData: { wrath: 0, dread: 0, malice: 0, envy: 0 },
    surveyCompleted: isSurveyCompleted(),
    surveyData: null
  });

  // Initialize grid and load saved state
  useEffect(() => {
    const savedState = loadGameState();
    if (savedState) {
      setGameState(prev => ({
        ...prev,
        ...savedState,
        surveyCompleted: isSurveyCompleted()
      }));
      
      // Genera numeri con dati survey se disponibili
      const newNumbers = generateNumbers(savedState.surveyData);
      const newValidGroups = generateValidGroups(newNumbers);
      setNumbers(newNumbers);
      setValidGroups(newValidGroups);
    } else {
      const newNumbers = generateNumbers();
      const newValidGroups = generateValidGroups(newNumbers);
      setNumbers(newNumbers);
      setValidGroups(newValidGroups);
    }
  }, []);

  // Save game state whenever it changes
  useEffect(() => {
    saveGameState(gameState);
  }, [gameState]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && gameState.selectedGroup) {
        refineSelectedGroup();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState.selectedGroup]);

  const handleGroupSelect = useCallback((group: GridGroup) => {
    setGameState(prev => ({
      ...prev,
      selectedGroup: group
    }));
  }, []);

  const handleGroupHover = useCallback((group: GridGroup | null) => {
    setGameState(prev => ({
      ...prev,
      hoveredGroup: group
    }));
  }, []);

  const refineSelectedGroup = useCallback(() => {
    if (!gameState.selectedGroup) return;

    const isValidGroup = gameState.selectedGroup.isValid;
    
    if (isValidGroup) {
      // Valid group refined - increase progress and update data
      const newProgress = Math.min(100, gameState.progress + 4); // Aumentato da 3 a 4
      const newRefinedData = updateRefinedData(gameState.refinedData, gameState.progress);
      
      setGameState(prev => ({
        ...prev,
        progress: newProgress,
        refinedData: newRefinedData,
        selectedGroup: null,
        sessionCount: newProgress >= 100 ? prev.sessionCount + 1 : prev.sessionCount
      }));

      toast({
        title: "Data Refined Successfully",
        description: "Valid group processed. Progress updated.",
        className: "bg-lumon-blue text-white border-lumon-cyan"
      });

      // Reset progress if 100% reached
      if (newProgress >= 100) {
        setTimeout(() => {
          setGameState(prev => ({
            ...prev,
            progress: 0,
            refinedData: { wrath: 0, dread: 0, malice: 0, envy: 0 }
          }));
        }, 1000);
      }
    } else {
      // Invalid group - no penalty, just feedback
      setGameState(prev => ({
        ...prev,
        selectedGroup: null
      }));

      toast({
        title: "Refinement Error",
        description: "Invalid group selected. Please try again.",
        variant: "destructive",
        className: "bg-lumon-wrath text-white border-lumon-dread"
      });
    }
  }, [gameState.selectedGroup, gameState.progress, gameState.refinedData, toast]);

  const handleSurveyComplete = (surveyData: SurveyData) => {
    saveSurveyData(surveyData);
    markSurveyCompleted();
    
    // Rigenera numeri con i nuovi dati survey
    const newNumbers = generateNumbers(surveyData);
    const newValidGroups = generateValidGroups(newNumbers);
    setNumbers(newNumbers);
    setValidGroups(newValidGroups);
    
    setGameState(prev => ({
      ...prev,
      surveyCompleted: true,
      surveyData
    }));

    toast({
      title: "Pre-Assessment Complete",
      description: "Welcome to Macrodata Refinement. Begin your session.",
      className: "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-400"
    });
  };

  if (!gameState.surveyCompleted) {
    return <Survey onComplete={handleSurveyComplete} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white" tabIndex={0}>
      <Header gameState={gameState} />
      
      {/* Main content area with proper spacing for fixed header/footer */}
      <div className="pt-24 pb-32 flex-1">
        <GridArea
          numbers={numbers}
          selectedGroup={gameState.selectedGroup}
          hoveredGroup={gameState.hoveredGroup}
          onGroupSelect={handleGroupSelect}
          onGroupHover={handleGroupHover}
          validGroups={validGroups}
        />
      </div>
      
      <RefinedDataPanel refinedData={gameState.refinedData} />
      
      <Footer />
    </div>
  );
};

export default Index;