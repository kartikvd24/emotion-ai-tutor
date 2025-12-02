import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { ChatMessage, Emotion, SystemMetrics } from "../types";

// We will use a singleton pattern or simple export for the client
let aiClient: GoogleGenAI | null = null;
let chatSession: Chat | null = null;

export const initializeGemini = (apiKey: string) => {
  aiClient = new GoogleGenAI({ apiKey });
  
  // Initialize a chat session with specific system instructions for the tutor
  chatSession = aiClient.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `You are an expert AI Tutor in an advanced "Emotion Aware" learning system.
      
      Your Goal: Help the student learn while actively adapting to their emotional state and engagement level.
      
      Inputs you will receive:
      1. The student's question or response.
      2. Context tags regarding their current emotion (e.g., [EMOTION: Frustrated], [ENGAGEMENT: Low]).
      
      Guidelines:
      - If EMOTION is Happy/Neutral and ENGAGEMENT is High: Challenge the student, go deeper, keep the momentum.
      - If EMOTION is Frustrated/Angry or ENGAGEMENT is Low: Slow down, simplify the explanation, offer encouragement, maybe suggest a break or a different angle.
      - If CONFUSION is High: Re-explain the previous concept using an analogy.
      - Keep responses concise, helpful, and encouraging.
      - Do not mention the internal metrics (like "I see your blink rate is high") directly unless necessary for empathy (e.g., "You seem a bit stuck...").
      `,
    }
  });
};

export const sendMessageToTutor = async (
  text: string, 
  metrics: SystemMetrics
): Promise<string> => {
  if (!chatSession) {
    throw new Error("Gemini client not initialized. Please set API Key.");
  }

  // Inject context about the user's state into the prompt invisibly to the user
  const contextHeader = `
  [SYSTEM CONTEXT]
  Current Emotion: ${metrics.faceEmotion.emotion} (${(metrics.faceEmotion.score * 100).toFixed(0)}%)
  Engagement Score: ${metrics.engagementScore.toFixed(0)}/100
  Confusion Level: ${metrics.confusionLevel.toFixed(0)}/100
  [END CONTEXT]
  
  Student says: "${text}"
  `;

  try {
    const result: GenerateContentResponse = await chatSession.sendMessage({
      message: contextHeader
    });
    return result.text || "I'm having trouble thinking right now. Let's try that again.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I lost connection to my brain for a moment. Please check your API key or internet.";
  }
};