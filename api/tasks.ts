
/**
 * NOTE: This is for reference and deployment on Vercel. 
 * In the current static preview environment, logic is handled in App.tsx.
 */
import { Task } from '../types';

let inMemoryTasks: Task[] = [];

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'GET') {
      return res.status(200).json({ tasks: inMemoryTasks });
    }

    if (req.method === 'POST') {
      const { text, taskId, toggle } = req.body;

      if (toggle && taskId) {
        inMemoryTasks = inMemoryTasks.map(t => 
          t.id === taskId ? { ...t, completed: !t.completed } : t
        );
      } else if (text) {
        const newTask: Task = {
          id: Math.random().toString(36).substring(7),
          text,
          completed: false,
          createdAt: Date.now(),
        };
        inMemoryTasks.push(newTask);
      }

      return res.status(200).json({ tasks: inMemoryTasks });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
