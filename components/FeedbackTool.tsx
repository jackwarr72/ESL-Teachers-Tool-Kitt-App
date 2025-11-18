
import React, { useState } from 'react';
import { provideWritingFeedback } from '../services/geminiService';
import { ProficiencyLevel } from '../types';
import { Label, Select, TextArea, Button } from './common/FormElements';
import Loader from './common/Loader';
import ResultDisplay from './common/ResultDisplay';
import PageHeader from './common/PageHeader';

const FeedbackTool: React.FC = () => {
  const [level, setLevel] = useState<ProficiencyLevel>(ProficiencyLevel.B1);
  const [studentText, setStudentText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentText) {
        alert('Please paste the student\'s text.');
        return;
    }
    setIsLoading(true);
    setResult('');
    const feedback = await provideWritingFeedback(level, studentText);
    setResult(feedback);
    setIsLoading(false);
  };

  return (
    <div>
      <PageHeader
        title="AI Writing Feedback Tool"
        subtitle="Get instant, constructive feedback on student writing with specific corrections and suggestions."
      />

      <form onSubmit={handleSubmit} className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md space-y-6">
        <div>
          <Label htmlFor="level">Student's Proficiency Level</Label>
          <Select id="level" value={level} onChange={(e) => setLevel(e.target.value as ProficiencyLevel)} className="max-w-xs">
            {Object.values(ProficiencyLevel).map(l => <option key={l} value={l}>{l}</option>)}
          </Select>
        </div>

        <div>
          <Label htmlFor="studentText">Student's Writing</Label>
          <TextArea
            id="studentText"
            value={studentText}
            onChange={(e) => setStudentText(e.target.value)}
            rows={10}
            placeholder="Paste the student's text here..."
          />
        </div>
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Analyzing...' : 'Get Feedback'}
          </Button>
        </div>
      </form>

      {isLoading && <div className="mt-6"><Loader /></div>}
      {result && <ResultDisplay content={result} />}
    </div>
  );
};

export default FeedbackTool;
