import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
// Using Gemini 2.0 Flash as requested
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json();

    if (!input) {
      return NextResponse.json(
        { success: false, error: "No input provided" },
        { status: 400 }
      );
    }

    const today = new Date().toISOString().split('T')[0];

    const prompt = `Parse this expense and return ONLY valid JSON with no markdown formatting:
Input: ${input}

Return exactly this structure:
{
  "amount": <number>,
  "currency": "INR",
  "category": "<exactly one of: food, transport, shopping, entertainment, bills, health, education, work, other>",
  "description": "<clean short description>",
  "date": "<YYYY-MM-DD format, use ${today} if not specified>"
}

Rules:
- If amount is not clear, make your best guess
- Always pick the most specific category
- Keep description under 6 words
- If date is mentioned as yesterday/last week etc, calculate the actual date relative to ${today}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Strip any markdown code fences if they exist
    const cleanJson = text.replace(/```json|```/g, "").trim();
    
    try {
      const parsedResult = JSON.parse(cleanJson);
      return NextResponse.json({ success: true, data: parsedResult });
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError, "Raw Text:", text);
      return NextResponse.json(
        { success: false, error: "Failed to parse AI response as JSON" },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
