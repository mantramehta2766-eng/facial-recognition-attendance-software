
import { GoogleGenAI, Type } from "@google/genai";
import { Student, RecognitionResult } from "../types";

const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const identifyStudent = async (
  capturedImageBase64: string,
  students: Student[]
): Promise<RecognitionResult> => {
  if (students.length === 0) {
    return { studentId: null, confidence: 0, reason: "No students registered in the system." };
  }

  // Prepare the prompt with student data
  // We send the captured image and the reference images to the model
  const studentReferences = students.map(s => ({
    id: s.id,
    name: s.name,
    photo: s.photoUrl.split(',')[1] // Get base64 part
  }));

  const parts = [
    { text: "Task: Identify the person in the first image (the 'Target') by comparing it to the provided reference images. Each reference image is associated with a Student ID and Name." },
    { text: `Reference Students: ${JSON.stringify(students.map(s => ({ id: s.id, name: s.name, roll: s.rollNumber })))}` },
    {
      inlineData: {
        mimeType: "image/jpeg",
        data: capturedImageBase64.split(',')[1]
      }
    }
  ];

  // Add reference photos as parts
  students.forEach((student) => {
    parts.push({ text: `Reference for Student ID: ${student.id} (${student.name})` });
    parts.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: student.photoUrl.split(',')[1]
      }
    });
  });

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            studentId: {
              type: Type.STRING,
              description: "The ID of the matched student from the reference list, or null if no match is found.",
            },
            confidence: {
              type: Type.NUMBER,
              description: "Confidence score from 0 to 1.",
            },
            reason: {
              type: Type.STRING,
              description: "Brief explanation of the identification logic.",
            }
          },
          required: ["studentId", "confidence", "reason"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}") as RecognitionResult;
    return result;
  } catch (error) {
    console.error("Gemini Recognition Error:", error);
    return { studentId: null, confidence: 0, reason: "Error communicating with AI service." };
  }
};
