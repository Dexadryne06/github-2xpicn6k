import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { SurveyData } from '@/types/macrodata';

interface SurveyProps {
  onComplete: (data: SurveyData) => void;
}

const Survey: React.FC<SurveyProps> = ({ onComplete }) => {
  const [surveyData, setSurveyData] = useState<SurveyData>({
    stressLevel: 10,
    workSatisfaction: 10,
    sleepQuality: 10,
    socialPreference: 10,
    riskTolerance: 10,
    emotionalSensitivity: 10,
    focusLevel: 10,
    creativityLevel: 10,
    anxietyLevel: 10,
    optimismLevel: 10,
    memoryRetention: 10,
    decisionMaking: 10,
    adaptability: 10,
    teamwork: 10,
    timeManagement: 10,
    conflictResolution: 10,
    innovationDrive: 10,
    detailOrientation: 10,
    communicationStyle: 10,
    workPressure: 10
  });

  const questions = [
    { key: 'stressLevel', label: 'Current Stress Level', description: 'How stressed do you feel right now?' },
    { key: 'workSatisfaction', label: 'Work Satisfaction Level', description: 'How satisfied are you with your current work?' },
    { key: 'sleepQuality', label: 'Sleep Quality Assessment', description: 'How would you rate your sleep quality?' },
    { key: 'socialPreference', label: 'Social Interaction Preference', description: 'How much do you enjoy social interactions?' },
    { key: 'riskTolerance', label: 'Risk Tolerance Evaluation', description: 'How comfortable are you with taking risks?' },
    { key: 'emotionalSensitivity', label: 'Emotional Sensitivity Rating', description: 'How sensitive are you to emotional stimuli?' },
    { key: 'focusLevel', label: 'Focus and Concentration Level', description: 'How well can you maintain focus?' },
    { key: 'creativityLevel', label: 'Creative Thinking Capacity', description: 'How creative do you consider yourself?' },
    { key: 'anxietyLevel', label: 'Anxiety and Worry Tendency', description: 'How often do you experience anxiety?' },
    { key: 'optimismLevel', label: 'Optimism and Positivity Level', description: 'How optimistic are you about the future?' },
    { key: 'memoryRetention', label: 'Memory Retention Capacity', description: 'How well do you remember information?' },
    { key: 'decisionMaking', label: 'Decision Making Speed', description: 'How quickly do you make decisions?' },
    { key: 'adaptability', label: 'Adaptability to Change', description: 'How well do you adapt to new situations?' },
    { key: 'teamwork', label: 'Teamwork Preference', description: 'How much do you enjoy working in teams?' },
    { key: 'timeManagement', label: 'Time Management Skills', description: 'How well do you manage your time?' },
    { key: 'conflictResolution', label: 'Conflict Resolution Ability', description: 'How well do you handle conflicts?' },
    { key: 'innovationDrive', label: 'Innovation and Change Drive', description: 'How driven are you to innovate?' },
    { key: 'detailOrientation', label: 'Detail Orientation Level', description: 'How much attention do you pay to details?' },
    { key: 'communicationStyle', label: 'Communication Effectiveness', description: 'How effective is your communication?' },
    { key: 'workPressure', label: 'Work Under Pressure Ability', description: 'How well do you work under pressure?' }
  ];

  const handleSliderChange = (key: keyof SurveyData, value: number[]) => {
    setSurveyData(prev => ({
      ...prev,
      [key]: value[0]
    }));
  };

  const handleSubmit = () => {
    onComplete(surveyData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50">
      <div className="bg-black border border-white border-opacity-20 rounded-lg p-8 max-w-4xl w-full mx-4 backdrop-blur-lg max-h-[90vh] overflow-hidden">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">LUMON INDUSTRIES</h1>
          <h2 className="text-lg lumon-blue mb-4">Comprehensive Macrodata Refinement Pre-Assessment</h2>
          <p className="text-sm text-gray-400">
            Please provide honest assessments across all parameters to optimize your work experience and data processing patterns.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-96 overflow-y-auto pr-4">
          {questions.map(({ key, label, description }) => (
            <div key={key} className="space-y-3 p-4 bg-gray-900 bg-opacity-50 rounded-lg border border-purple-500 border-opacity-20">
              <div className="flex justify-between items-center">
                <div>
                  <label className="text-white text-sm font-medium block">{label}</label>
                  <p className="text-xs text-gray-400 mt-1">{description}</p>
                </div>
                <span className="text-lumon-cyan text-sm font-mono ml-4">
                  {surveyData[key as keyof SurveyData]}/20
                </span>
              </div>
              <Slider
                value={[surveyData[key as keyof SurveyData]]}
                onValueChange={(value) => handleSliderChange(key as keyof SurveyData, value)}
                max={20}
                min={0}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button 
            onClick={handleSubmit}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-12 py-3 rounded-md transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
          >
            INITIALIZE REFINEMENT PROCESS
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Survey;