
import React from 'react';

interface SummaryViewProps {
  summary: string | null;
  isLoading: boolean;
  onClose: () => void;
}

const SummaryView: React.FC<SummaryViewProps> = ({ summary, isLoading, onClose }) => {
  return (
    <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100 shadow-inner relative animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-indigo-800 font-bold flex items-center gap-2">
          <i className="fas fa-wand-magic-sparkles"></i>
          AI Daily Insight
        </h3>
        {!isLoading && (
          <button 
            onClick={onClose}
            className="text-indigo-400 hover:text-indigo-600 transition-colors"
          >
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <div className="h-4 bg-indigo-200/50 rounded w-3/4 animate-pulse"></div>
          <div className="h-4 bg-indigo-200/50 rounded w-full animate-pulse"></div>
          <div className="h-4 bg-indigo-200/50 rounded w-1/2 animate-pulse"></div>
        </div>
      ) : (
        <div className="text-indigo-900 leading-relaxed prose prose-indigo">
          {summary?.split('\n').map((line, i) => (
            <p key={i} className="mb-2">{line}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default SummaryView;
