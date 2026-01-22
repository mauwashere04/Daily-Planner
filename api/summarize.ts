
import { GoogleGenAI } from "@google/genai";
import { Task } from '../types';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { tasks } = req.body as { tasks: Task[] };

  if (!tasks || tasks.length === 0) {
    return res.status(200).json({ summary: "No tasks to summarize! Add some activities to see your AI summary." });
  }

  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error('API key not configured');
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const completedTasks = tasks.filter(t => t.completed).map(t => t.text);
    const pendingTasks = tasks.filter(t => !t.completed).map(t => t.text);

    const prompt = `
      As a friendly and encouraging personal coach, summarize the user's daily progress.
      
      Completed tasks: ${completedTasks.join(', ') || 'None'}
      Pending tasks: ${pendingTasks.join(', ') || 'None'}
      
      Requirements:
      - Tone: Concise, positive, motivational.
      - Output: A single short paragraph or 3 bullet points.
      - Handle empty lists gracefully.
      - Focus on encouraging the user based on their ratio of completion.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.9,
      },
    });

    const summary = response.text || "You've had a busy day! Keep up the great work.";

    return res.status(200).json({ summary });
  } catch (error) {
    console.error('AI Summary Error:', error);
    return res.status(500).json({ error: 'Failed to generate summary' });
  }
}
