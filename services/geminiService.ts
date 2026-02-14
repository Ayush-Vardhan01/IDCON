
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getIndustrialInsight = async (prompt: string, dataSnapshot: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a Senior Industrial Data Scientist at IDCON (Industrial Designing Consultants). 
      Analyze this factory telemetry data: ${JSON.stringify(dataSnapshot)}. 
      User request: ${prompt}. 
      Provide technical, professional, and actionable insights specifically regarding PLC S7-1500 optimization, SCADA WinCC data acquisition, OEE performance, or predictive maintenance. 
      Maintain a tone of high-level engineering consultancy.`,
      config: {
        temperature: 0.7,
        systemInstruction: "You are an expert in industrial automation, data science, and manufacturing consultancy for IDCON Industrial Designing Consultants. Use technical terminology related to TIA Portal, MindSphere, and Edge Computing. Always be professional, optimistic, and genuine."
      }
    });
    return response.text || "Unable to generate insight at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The IDCON analytics gateway is currently undergoing maintenance. Please verify your industrial network connection.";
  }
};
