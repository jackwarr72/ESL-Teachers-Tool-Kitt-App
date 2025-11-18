
import React, { useState } from 'react';
import { generateWorksheet } from '../services/geminiService';
import { ProficiencyLevel, LanguageDomain } from '../types';
import { Label, Input, Select, Button } from './common/FormElements';
import Loader from './common/Loader';
import ResultDisplay from './common/ResultDisplay';
import PageHeader from './common/PageHeader';

const WorksheetGenerator: React.FC = () => {
  const [level, setLevel] = useState<ProficiencyLevel>(ProficiencyLevel.A2);
  const [domain, setDomain] = useState<LanguageDomain>(LanguageDomain.Vocabulary);
  const [topic, setTopic] = useState('');
  const [activityType, setActivityType] = useState('Matching');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  
  const activityTypes = ['Matching', 'Fill-in-the-blanks', 'Multiple Choice', 'Sentence Scramble', 'Short Answer Questions'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
     if (!topic) {
        alert('Please fill in the topic.');
        return;
    }
    setIsLoading(true);
    setResult('');
    const worksheet = await generateWorksheet(level, domain, topic, activityType);
    setResult(worksheet);
    setIsLoading(false);
  };

  return (
    <div>
      <PageHeader
        title="AI Worksheet Generator"
        subtitle="Instantly create customized worksheets for vocabulary, grammar, reading, and more."
      />

      <form onSubmit={handleSubmit} className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <Label htmlFor="level">Proficiency Level</Label>
            <Select id="level" value={level} onChange={(e) => setLevel(e.target.value as ProficiencyLevel)}>
              {Object.values(ProficiencyLevel).map(l => <option key={l} value={l}>{l}</option>)}
            </Select>
          </div>
          <div>
            <Label htmlFor="domain">Language Domain</Label>
            <Select id="domain" value={domain} onChange={(e) => setDomain(e.target.value as LanguageDomain)}>
              {Object.values(LanguageDomain).map(d => <option key={d} value={d}>{d}</option>)}
            </Select>
          </div>
          <div>
            <Label htmlFor="activityType">Activity Type</Label>
            <Select id="activityType" value={activityType} onChange={(e) => setActivityType(e.target.value)}>
              {activityTypes.map(type => <option key={type} value={type}>{type}</option>)}
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="topic">Topic</Label>
          <Input id="topic" type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., Daily Routines, Travel Vocabulary" />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate Worksheet'}
          </Button>
        </div>
      </form>

      {isLoading && <div className="mt-6"><Loader /></div>}
      {result && <ResultDisplay content={result} />}
    </div>
  );
};

export default WorksheetGenerator;
