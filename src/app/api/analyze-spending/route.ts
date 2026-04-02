import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ success: false, error: "API Key missing" }, { status: 500 });
  }

  try {
    const { expenses } = await req.json();
    
    if (!expenses || !Array.isArray(expenses) || expenses.length === 0) {
      return NextResponse.json({ success: false, error: "No data to analyze" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Sequential fallback: gemini-pro -> gemini-1.5-flash-latest -> gemini-1.5-flash
    const modelsToTry = ["gemini-pro", "gemini-1.5-flash-latest", "gemini-1.5-flash"];

    const prompt = `Here are my expenses for this month: ${JSON.stringify(expenses)}. 
Give me exactly 3 short insights about my spending patterns and one suggestion to save money. 
Return ONLY valid JSON with this structure:
{
  "insights": ["insight 1", "insight 2", "insight 3"],
  "tip": "one saving suggestion"
}
Rules:
- Keep each insight to one sentence.
- Be specific based on the data provided (e.g. "You spent most on food").
- No markdown formatting.`;

    let result = null;
    let successfulModel = "";

    for (const modelName of modelsToTry) {
      try {
        console.log(`[API Analyze] Trying model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        result = await model.generateContent(prompt);
        successfulModel = modelName;
        break; // Success!
      } catch (modelError: any) {
        console.warn(`[API Analyze] Model ${modelName} failed: ${modelError.message}`);
      }
    }

    if (!result) {
      throw new Error("All Gemini models failed for analysis.");
    }

    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const cleanJson = jsonMatch ? jsonMatch[0] : text.replace(/```json|```/g, "").trim();
    
    const parsedData = JSON.parse(cleanJson);
    return NextResponse.json({ success: true, data: parsedData });

  } catch (error: any) {
    console.error("[API Analyze] Error:", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
