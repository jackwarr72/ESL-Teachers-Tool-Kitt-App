
import React from 'react';
import { View } from '../types';
import { BookOpenIcon, DocumentTextIcon, LightBulbIcon, PencilSquareIcon, MicrophoneIcon } from './Icons';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
}

const NavItem: React.FC<{
  viewName: View;
  label: string;
  icon: React.ReactNode;
  currentView: View;
  onClick: (view: View) => void;
}> = ({ viewName, label, icon, currentView, onClick }) => (
  <li>
    <button
      onClick={() => onClick(viewName)}
      className={`flex items-center p-3 my-1 w-full text-sm rounded-lg transition-colors duration-200 ${
        currentView === viewName
          ? 'bg-indigo-600 text-white shadow-md'
          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
      }`}
    >
      {icon}
      <span className="ml-3 font-medium">{label}</span>
    </button>
  </li>
);

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, isSidebarOpen, setSidebarOpen }) => {
  
  const handleViewChange = (view: View) => {
    setCurrentView(view);
    setSidebarOpen(false);
  }

  return (
    <>
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden ${isSidebarOpen ? 'block' : 'hidden'}`} onClick={() => setSidebarOpen(false)}></div>
      <aside className={`absolute md:relative flex-shrink-0 w-64 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-transform duration-300 ease-in-out z-40 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">ESL AI Toolkit</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-md md:hidden focus:outline-none focus:ring-2 focus:ring-indigo-500">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <nav className="flex-1 p-4">
          <ul>
            <NavItem
              viewName="lessonPlanner"
              label="Lesson Planner"
              icon={<BookOpenIcon />}
              currentView={currentView}
              onClick={handleViewChange}
            />
            <NavItem
              viewName="worksheetGenerator"
              label="Worksheet Generator"
              icon={<DocumentTextIcon />}
              currentView={currentView}
              onClick={handleViewChange}
            />
            <NavItem
              viewName="feedbackTool"
              label="Writing Feedback"
              icon={<PencilSquareIcon />}
              currentView={currentView}
              onClick={handleViewChange}
            />
            <NavItem
              viewName="speakingCoach"
              label="Speaking Coach"
              icon={<MicrophoneIcon />}
              currentView={currentView}
              onClick={handleViewChange}
            />
            <NavItem
              viewName="proDev"
              label="Professional Dev"
              icon={<LightBulbIcon />}
              currentView={currentView}
              onClick={handleViewChange}
            />
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-center text-gray-500">Powered by Gemini</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
