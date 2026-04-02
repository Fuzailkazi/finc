import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req: NextRequest) {
  try {
    const { text, image } = await req.json();

    if (!text && !image) {
      return NextResponse.json(
        { error: "No text or image provided" },
        { status: 400 }
      );
    }

    const prompt = `
      Parse the following expense information into a JSON object with:
      - amount (number)
      - currency (string)
      - vendor (string)
      - category (string)
      - date (string, ISO)
      - description (string)
      
      Input: ${text || "Image provided"}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonText = response.text();
    
    // Simple JSON cleanup if needed
    const cleanJson = jsonText.replace(/```json|```/g, "").trim();
    
    return NextResponse.json(JSON.parse(cleanJson));
  } catch (error: any) {
    console.error("Gemini Parsing Error:", error);
    return NextResponse.json(
      { error: "Failed to parse expense with AI", message: error.message },
      { status: 500 }
    );
  }
}
