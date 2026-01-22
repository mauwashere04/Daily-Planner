
import React from 'react';
import { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onToggle }) => {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-400">
        <div className="bg-slate-50 p-6 rounded-full mb-4">
          <i className="fas fa-clipboard-list text-4xl"></i>
        </div>
        <p className="text-center font-medium">No tasks yet. Add one to get started!</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {tasks.sort((a, b) => b.createdAt - a.createdAt).map((task) => (
        <li 
          key={task.id}
          onClick={() => onToggle(task.id)}
          className={`group flex items-center p-4 rounded-xl border transition-all cursor-pointer ${
            task.completed 
              ? 'bg-slate-50 border-slate-100 opacity-75' 
              : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm'
          }`}
        >
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 transition-colors ${
            task.completed 
              ? 'bg-green-500 border-green-500 text-white' 
              : 'border-slate-300 group-hover:border-blue-500'
          }`}>
            {task.completed && <i className="fas fa-check text-[10px]"></i>}
          </div>
          <span className={`flex-1 font-medium transition-all ${
            task.completed ? 'text-slate-400 line-through' : 'text-slate-700'
          }`}>
            {task.text}
          </span>
          <div className={`text-xs px-2 py-1 rounded font-bold uppercase tracking-wider ${
            task.completed ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
          }`}>
            {task.completed ? 'Done' : 'Active'}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
