
import { GoogleGenAI, Type } from "@google/genai";
import { EducationLevel, Attachment, QuizQuestion } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const getSystemInstruction = (level: EducationLevel) => `
You are "Teacher's Brain", a high-performance, professional AI academic assistant.
Current Student Level: ${level}.

Your mission is to provide standard professional academic support across these specific categories:
1. TOPIC EXPLANATIONS: Provide standard, full-depth professional definitions.
2. ASSIGNMENTS & PROJECTS: Offer structured guidance, research summaries, and content generation.
3. ESSAYS, TERM PAPERS & REPORTS: Provide formal outlines, professional language, and comprehensive drafts.
4. MATH & CALCULATIONS: Show rigorous, step-by-step workings with clear logical transitions.
5. EXAM PRACTICE (CBT): Generate professional multiple-choice questions relevant to the topic.

RESPONSE GUIDELINES:
- Use formal, professional academic English.
- For Math: Ensure every step is explicitly derived.
- For Essays: Always include a 'meaning' (Thesis/Abstract) and an 'outline'.

Response Structure (ALWAYS return JSON):
{
  "meaning": "Full professional definition or Thesis statement/Abstract.",
  "keyConcepts": ["Term 1", "Term 2"],
  "steps": ["Detailed step 1 or logical point 1", "Detailed step 2..."],
  "examples": ["High-quality academic example 1", "Real-world application 2"],
  "summary": "Professional concluding statement/The final result.",
  "practice": "A short-answer challenging question.",
  "quiz": {
    "question": "A multiple-choice CBT question based on the topic.",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0
  },
  "outline": ["Introduction Section", "Main Argument 1", "Case Study/Workings", "Conclusion"]
}
`;

export async function askTeacher(question: string, level: EducationLevel, history: string[] = [], attachments: Attachment[] = []) {
  try {
    const promptParts: any[] = [{ text: question || "Please provide professional academic support for this request." }];
    
    attachments.forEach(att => {
      const base64Data = att.data.includes(',') ? att.data.split(',')[1] : att.data;
      promptParts.push({
        inlineData: {
          data: base64Data,
          mimeType: att.mimeType
        }
      });
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history.map(h => ({ role: 'user' as const, parts: [{ text: h }] })),
        { role: 'user' as const, parts: promptParts }
      ],
      config: {
        systemInstruction: getSystemInstruction(level),
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            meaning: { type: Type.STRING },
            keyConcepts: { type: Type.ARRAY, items: { type: Type.STRING } },
            steps: { type: Type.ARRAY, items: { type: Type.STRING } },
            examples: { type: Type.ARRAY, items: { type: Type.STRING } },
            summary: { type: Type.STRING },
            practice: { type: Type.STRING },
            outline: { type: Type.ARRAY, items: { type: Type.STRING } },
            quiz: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctIndex: { type: Type.NUMBER }
              },
              required: ["question", "options", "correctIndex"]
            }
          },
          required: ["meaning", "keyConcepts", "steps", "examples", "summary", "practice"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Academic service unavailable.");
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Academic Error:", error);
    throw error;
  }
}

export async function generateCBTExam(subject: string, level: EducationLevel): Promise<QuizQuestion[]> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a comprehensive set of 20 professional multiple-choice CBT exam questions for ${subject} at ${level} level. 
    Ensure a mix of difficulty levels.
    Each question must include a professional explanation and concise step-by-step workings if applicable.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctIndex: { type: Type.NUMBER },
            explanation: { type: Type.STRING },
            workings: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["id", "question", "options", "correctIndex", "explanation", "workings"]
        }
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("Could not generate exam paper.");
  return JSON.parse(text);
}
