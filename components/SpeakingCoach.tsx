import React, { useState } from 'react';
import { generateSpeakingPractice, getPronunciationFeedback } from '../services/geminiService';
import { ProficiencyLevel } from '../types';
import { Label, Input, Select, TextArea, Button } from './common/FormElements';
import Loader from './common/Loader';
import ResultDisplay from './common/ResultDisplay';
import PageHeader from './common/PageHeader';
import GamificationPanel from './GamificationPanel';
import AudioRecorder from './common/AudioRecorder';

const SpeakingCoach: React.FC = () => {
  const [level, setLevel] = useState<ProficiencyLevel>(ProficiencyLevel.B1);
  const [topic, setTopic] = useState('');
  const [scenario, setScenario] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [exerciseContent, setExerciseContent] = useState('');
  const [gamificationContent, setGamificationContent] = useState('');
  
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [isAnalyzingAudio, setIsAnalyzingAudio] = useState(false);
  const [pronunciationFeedback, setPronunciationFeedback] = useState('');
  
  const GAMIFICATION_SEPARATOR = '---GAMIFICATION---';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !scenario) {
        alert('Please fill in all fields.');
        return;
    }
    setIsLoading(true);
    setExerciseContent('');
    setGamificationContent('');
    setRecordedAudio(null);
    setPronunciationFeedback('');

    const fullResult = await generateSpeakingPractice(level, topic, scenario);
    
    if (fullResult.includes(GAMIFICATION_SEPARATOR)) {
      const parts = fullResult.split(GAMIFICATION_SEPARATOR);
      setExerciseContent(parts[0]);
      setGamificationContent(parts[1]);
    } else {
      setExerciseContent(fullResult);
      setGamificationContent('');
    }

    setIsLoading(false);
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64data = reader.result as string;
          resolve(base64data.split(',')[1]);
        };
        reader.onerror = (error) => reject(error);
      });
  };

  const handleGetPronunciationFeedback = async () => {
    if (!recordedAudio || !exerciseContent) {
        alert('Please record your audio first.');
        return;
    }
    setIsAnalyzingAudio(true);
    setPronunciationFeedback('');
    try {
        const audioBase64 = await blobToBase64(recordedAudio);
        const feedback = await getPronunciationFeedback(level, exerciseContent, audioBase64, recordedAudio.type);
        setPronunciationFeedback(feedback);
    } catch (error) {
        console.error("Error getting pronunciation feedback:", error);
        setPronunciationFeedback("Sorry, we couldn't analyze your audio at this time.");
    } finally {
        setIsAnalyzingAudio(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="AI Speaking Coach"
        subtitle="Generate tailored speaking exercises with dialogues, key vocabulary, and feedback rubrics."
      />

      <form onSubmit={handleSubmit} className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="level">Proficiency Level</Label>
            <Select id="level" value={level} onChange={(e) => setLevel(e.target.value as ProficiencyLevel)}>
              {Object.values(ProficiencyLevel).map(l => <option key={l} value={l}>{l}</option>)}
            </Select>
          </div>
          <div>
            <Label htmlFor="topic">Topic</Label>
            <Input id="topic" type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., At the Doctor's, Job Interviews" />
          </div>
        </div>

        <div>
          <Label htmlFor="scenario">Scenario</Label>
          <TextArea 
            id="scenario" 
            value={scenario} 
            onChange={(e) => setScenario(e.target.value)} 
            rows={4}
            placeholder="Describe the specific situation. e.g., A patient describing symptoms of a cold to a doctor." 
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate Exercise'}
          </Button>
        </div>
      </form>

      {isLoading && <div className="mt-6"><Loader /></div>}
      
      {exerciseContent && <ResultDisplay content={exerciseContent} />}
      {gamificationContent && <GamificationPanel content={gamificationContent} />}

      {exerciseContent && (
        <div className="mt-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Practice Your Pronunciation</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Record yourself reading the sample dialogue or key phrases, then get AI-powered feedback.</p>
            <AudioRecorder onRecordingComplete={setRecordedAudio} disabled={isAnalyzingAudio} />
            
            {recordedAudio && (
                <div className="mt-4">
                     <audio src={URL.createObjectURL(recordedAudio)} controls className="w-full" />
                     <div className="mt-4 flex justify-end">
                        <Button onClick={handleGetPronunciationFeedback} disabled={isAnalyzingAudio || !recordedAudio}>
                            {isAnalyzingAudio ? 'Analyzing...' : 'Get Pronunciation Feedback'}
                        </Button>
                     </div>
                </div>
            )}
            {isAnalyzingAudio && <div className="mt-4"><Loader /></div>}
            {pronunciationFeedback && (
                <div className="mt-4">
                    <h4 className="text-lg font-semibold mb-2">Feedback Report</h4>
                    <ResultDisplay content={pronunciationFeedback} />
                </div>
            )}
        </div>
      )}

    </div>
  );
};

export default SpeakingCoach;