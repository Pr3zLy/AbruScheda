
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `You are a professional fitness coach and hypertrophy expert. 
Your goal is to provide short (max 2 sentences), motivating, and technically sound advice for specific exercises. 
Focus on form, tempo, or mind-muscle connection. Be direct and encouraging. 
Language: Italian (or English if the input is English).`;

export const getWorkoutTip = async (exerciseName: string, notes: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Dammi un consiglio rapido ed efficace per l'esercizio: ${exerciseName}. Note aggiuntive: ${notes}`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    return response.text?.trim() || "Mantieni la forma corretta e spingi al massimo!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Focus sulla connessione mente-muscolo. Ogni ripetizione conta!";
  }
};
