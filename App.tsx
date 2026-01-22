
import React, { useState, useEffect } from 'react';
import { Task } from './types';
import Header from './components/Header';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import SummaryView from './components/SummaryView';
import { GoogleGenAI } from "@google/genai";

const STORAGE_KEY = 'smart_planner_tasks';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize: Load tasks from localStorage
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem(STORAGE_KEY);
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
    } catch (err) {
      console.error('Error loading tasks from local storage:', err);
    }
  }, []);

  // Persistence: Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (text: string) => {
    const newTask: Task = {
      id: Math.random().toString(36).substring(7),
      text,
      completed: false,
      createdAt: Date.now(),
    };
    setTasks(prev => [newTask, ...prev]);
    setError(null);
  };

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    ));
  };

  const generateSummary = async () => {
    if (tasks.length === 0) {
      setSummary("You haven't added any tasks yet! Start your day by listing what you want to achieve.");
      return;
    }

    setIsSummarizing(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      const completedTasks = tasks.filter(t => t.completed).map(t => t.text);
      const pendingTasks = tasks.filter(t => !t.completed).map(t => t.text);

      const prompt = `
        As a friendly and encouraging personal coach, summarize the user's daily progress.
        
        Completed tasks: ${completedTasks.join(', ') || 'None'}
        Pending tasks: ${pendingTasks.join(', ') || 'None'}
        
        Requirements:
        - Tone: Concise, positive, motivational.
        - Output: A single short paragraph or 3 bullet points.
        - Focus on encouraging the user based on their ratio of completion.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          temperature: 0.7,
        },
      });

      const summaryText = response.text || "You've had a busy day! Keep up the great work.";
      setSummary(summaryText);
    } catch (err) {
      console.error('Summarization error:', err);
      setError('The AI could not summarize your day at this time. Please ensure your API key is valid.');
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col min-h-[80vh]">
        <Header />
        
        <main className="flex-1 p-6 space-y-8 overflow-y-auto">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-sm animate-pulse rounded">
              <i className="fas fa-exclamation-circle mr-2"></i>
              {error}
            </div>
          )}

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <i className="fas fa-plus-circle text-blue-500 mr-2"></i>
              Add New Task
            </h2>
            <TaskInput onAdd={addTask} />
          </section>

          <section className="flex-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center">
                <i className="fas fa-list-check text-green-500 mr-2"></i>
                Today's Tasks
              </h2>
              <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {tasks.filter(t => t.completed).length} / {tasks.length} Done
              </span>
            </div>
            <TaskList tasks={tasks} onToggle={toggleTask} />
          </section>

          {(summary || isSummarizing) && (
            <section className="mt-8">
              <SummaryView 
                summary={summary} 
                isLoading={isSummarizing} 
                onClose={() => setSummary(null)} 
              />
            </section>
          )}
        </main>

        <footer className="p-6 bg-slate-50 border-t border-slate-100 sticky bottom-0">
          <button
            onClick={generateSummary}
            disabled={isSummarizing}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform active:scale-95 flex items-center justify-center gap-3 shadow-lg ${
              isSummarizing 
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-indigo-200'
            }`}
          >
            {isSummarizing ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                AI is thinking...
              </>
            ) : (
              <>
                <i className="fas fa-sparkles"></i>
                Summarize My Day
              </>
            )}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default App;
