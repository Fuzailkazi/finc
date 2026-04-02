import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  const isKeyAvailable = !!process.env.GEMINI_API_KEY;
  console.log(`[API] GEMINI_API_KEY available: ${isKeyAvailable}`);

  if (!isKeyAvailable) {
    return NextResponse.json(
      { success: false, error: "GEMINI_API_KEY is not configured in environment variables." },
      { status: 500 }
    );
  }

  try {
    const { input } = await req.json();
    const trimmedInput = input?.trim();
    
    console.log(`[API] Incoming input: "${trimmedInput}"`);

    if (!trimmedInput) {
      return NextResponse.json(
        { success: false, error: "No input text provided." },
        { status: 400 }
      );
    }

    const today = new Date().toISOString().split('T')[0];
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    const prompt = `Parse this expense and return ONLY valid JSON with no markdown formatting:
Input: ${trimmedInput}

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

    // Sequential fallback: 2.0-flash -> 1.5-flash
    const modelsToTry = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-flash-latest"];
    let result = null;
    let successfulModel = "";

    for (const modelName of modelsToTry) {
      try {
        console.log(`[API] Attempting model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        result = await model.generateContent(prompt);
        successfulModel = modelName;
        break; // Success!
      } catch (modelError: any) {
        console.warn(`[API] Model ${modelName} failed: ${modelError.message}`);
      }
    }

    if (!result) {
      console.error("[API] All models failed. Returning success: false for manual fallback.");
      return NextResponse.json({ success: false });
    }

    console.log(`[API] Successfully parsed using: ${successfulModel}`);
    const response = await result.response;
    const text = response.text();
    
    // Robust JSON extraction
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const cleanJson = jsonMatch ? jsonMatch[0] : text.replace(/```json|```/g, "").trim();
    
    try {
      const parsedResult = JSON.parse(cleanJson);
      return NextResponse.json({ success: true, data: parsedResult });
    } catch (parseError: any) {
      console.error(`[API] JSON Parse Error: ${parseError.message}`, { rawText: text });
      return NextResponse.json({ success: false }); // Silently fail to manual mode
    }
  } catch (error: any) {
    console.error(`[API] Fatal Error: ${error.message}`, { stack: error.stack });
    return NextResponse.json({ success: false }); // Silently fail to manual mode
  }
}
