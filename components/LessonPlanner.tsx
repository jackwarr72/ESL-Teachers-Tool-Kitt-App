
import React, { useState } from 'react';
import { generateLessonPlan } from '../services/geminiService';
import { ProficiencyLevel, LanguageDomain, AgeGroup } from '../types';
import { Label, Input, Select, Button } from './common/FormElements';
import Loader from './common/Loader';
import ResultDisplay from './common/ResultDisplay';
import PageHeader from './common/PageHeader';

const LessonPlanner: React.FC = () => {
  const [level, setLevel] = useState<ProficiencyLevel>(ProficiencyLevel.B1);
  const [domain, setDomain] = useState<LanguageDomain>(LanguageDomain.Speaking);
  const [age, setAge] = useState<AgeGroup>(AgeGroup.Adults);
  const [topic, setTopic] = useState('');
  const [objectives, setObjectives] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !objectives) {
        alert('Please fill in all fields.');
        return;
    }
    setIsLoading(true);
    setResult('');
    const lessonPlan = await generateLessonPlan(level, domain, age, topic, objectives);
    setResult(lessonPlan);
    setIsLoading(false);
  };

  return (
    <div>
      <PageHeader
        title="AI Lesson Planner"
        subtitle="Generate comprehensive, ready-to-use lesson plans for any ESL class."
      />

      <form onSubmit={handleSubmit} className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <Label htmlFor="age">Age Group</Label>
            <Select id="age" value={age} onChange={(e) => setAge(e.target.value as AgeGroup)}>
              {Object.values(AgeGroup).map(a => <option key={a} value={a}>{a}</option>)}
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="topic">Topic</Label>
          <Input id="topic" type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., Ordering Food at a Restaurant" />
        </div>

        <div>
          <Label htmlFor="objectives">Learning Objectives</Label>
          <Input id="objectives" type="text" value={objectives} onChange={(e) => setObjectives(e.target.value)} placeholder="e.g., Students will be able to use modal verbs to make polite requests." />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate Lesson Plan'}
          </Button>
        </div>
      </form>

      {isLoading && <div className="mt-6"><Loader /></div>}
      {result && <ResultDisplay content={result} />}
    </div>
  );
};

export default LessonPlanner;
