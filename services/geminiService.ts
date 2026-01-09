import { GoogleGenAI, Content, Part } from "@google/genai";
import { Character, Message, MessageRole } from '../types';

// Helper to convert internal message format to Gemini content format
const convertHistoryToContents = (messages: Message[]): Content[] => {
  return messages.map((m) => ({
    role: m.role,
    parts: [{ text: m.text } as Part],
  }));
};

export const generateTextResponse = async (
  character: Character,
  fullHistoryWithUserMessage: Message[], // This contains previous history + current user message
  userMessageText: string
): Promise<string> => {
  try {
    // Initialize AI client with the current API key from environment
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // We use gemini-3-pro-preview for the best "human-like" reasoning and massive context window (memory).
    // The context window is large enough to hold the entire conversation history effectively.
    const model = 'gemini-3-pro-preview';
    
    // Logic Fix: 'ai.chats.create' expects 'history' to be the PAST messages.
    // The userMessageText is sent via 'sendMessage'.
    // So we must remove the last message (which is the current user message) from the history array passed to create()
    // to avoid duplicating it in the context.
    const pastHistory = fullHistoryWithUserMessage.slice(0, -1);

    const chat = ai.chats.create({
      model: model,
      history: convertHistoryToContents(pastHistory),
      config: {
        systemInstruction: character.systemInstruction,
        temperature: 1.1, // Higher temperature for more creative, human-like variability
        topP: 0.95,
        candidateCount: 1,
        // We do not add strict safety filters here to allow for romantic/dating context
        // Relying on system instruction to keep it within safe-but-flirty bounds
      }
    });

    const result = await chat.sendMessage({ message: userMessageText });
    return result.text || "...";
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Desculpe, deu um erro aqui na minha internet. O que vc disse?";
  }
};

export const generateSelfie = async (character: Character, context: string): Promise<string | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-3-pro-image-preview'; // Upgrading to Pro image model for better quality
    
    const prompt = `A realistic smartphone selfie of a man named ${character.name}, ${character.age} years old, ${character.job}. 
    He is gay. Personality: ${character.personality}.
    Context of the photo: ${context}. 
    The photo should look candid, amateur, maybe slightly imperfect lighting to look like a real dating app nude/selfie (but keep it PG-13/Safe for Work, just suggestive/sexy).
    He is holding the phone. Looking at camera.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        // responseMimeType not supported for nano banana series models
      }
    });

    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
        for (const part of candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
    }
    return null;
  } catch (error) {
    console.error("Error generating selfie:", error);
    return null;
  }
};