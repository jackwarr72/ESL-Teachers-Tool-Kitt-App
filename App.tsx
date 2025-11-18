
import React, { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import LessonPlanner from './components/LessonPlanner';
import WorksheetGenerator from './components/WorksheetGenerator';
import FeedbackTool from './components/FeedbackTool';
import ProDev from './components/ProDev';
import SpeakingCoach from './components/SpeakingCoach';
import { View } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('lessonPlanner');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const renderView = useCallback(() => {
    switch (currentView) {
      case 'lessonPlanner':
        return <LessonPlanner />;
      case 'worksheetGenerator':
        return <WorksheetGenerator />;
      case 'feedbackTool':
        return <FeedbackTool />;
      case 'speakingCoach':
        return <SpeakingCoach />;
      case 'proDev':
        return <ProDev />;
      default:
        return <LessonPlanner />;
    }
  }, [currentView]);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 md:hidden">
            <h1 className="text-xl font-semibold">ESL AI Toolkit</h1>
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
            </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
