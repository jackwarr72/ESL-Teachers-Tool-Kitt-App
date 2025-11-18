import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  // When running locally without the env var, respond with an error.
  // The deploy will set the env var in Vercel project settings.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  console.warn('GEMINI_API_KEY not set in environment');
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
const textModel = 'gemini-2.5-pro';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { prompt } = req.body || {};
    if (!prompt || typeof prompt !== 'string') {
      res.status(400).json({ error: 'Missing prompt in request body' });
      return;
    }

    const response = await ai.models.generateContent({ model: textModel, contents: prompt });
    return res.status(200).json({ text: response.text });
  } catch (error: any) {
    console.error('Error in /api/genai:', error);
    const message = error?.message || String(error) || 'Unknown error';
    return res.status(500).json({ error: message });
  }
}
