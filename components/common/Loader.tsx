
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-10 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-sm font-medium text-gray-600 dark:text-gray-300">Generating content, please wait...</p>
    </div>
  );
};

export default Loader;
