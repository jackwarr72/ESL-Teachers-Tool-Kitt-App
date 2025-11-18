
import React, { useState } from 'react';
import { getProDevTopic } from '../services/geminiService';
import Loader from './common/Loader';
import ResultDisplay from './common/ResultDisplay';
import PageHeader from './common/PageHeader';
import { Button } from './common/FormElements';

const ProDev: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const [currentTopic, setCurrentTopic] = useState('');

  const topics = [
    "Integrating AI Tools in the ESL Curriculum",
    "Task-Based Learning for Online Classes",
    "Gamification Strategies for Vocabulary Acquisition",
    "Teaching Mixed-Proficiency Level Classes",
    "Using Authentic Materials for Reading Comprehension"
  ];

  const handleClick = async (topic: string) => {
    setIsLoading(true);
    setResult('');
    setCurrentTopic(topic);
    const article = await getProDevTopic(topic);
    setResult(article);
    setIsLoading(false);
  };

  return (
    <div>
      <PageHeader
        title="Professional Development Hub"
        subtitle="Explore AI-generated articles on modern ESL teaching methodologies and best practices."
      />
      
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Choose a topic to explore:</h2>
        <div className="flex flex-wrap gap-3">
          {topics.map(topic => (
            <Button 
                key={topic} 
                variant="secondary"
                onClick={() => handleClick(topic)}
                disabled={isLoading}
            >
              {topic}
            </Button>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="mt-6 text-center">
            <Loader />
            <p className="mt-2 text-lg font-semibold">Generating article on "{currentTopic}"...</p>
        </div>
      )}
      {result && <ResultDisplay content={result} />}
    </div>
  );
};

export default ProDev;
