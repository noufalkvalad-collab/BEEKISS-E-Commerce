import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Fallback if the user hasn't added the API Key yet
    if (!apiKey) {
      const lowerMessage = message.toLowerCase();
      let responseContent = "Please add your GEMINI_API_KEY to the .env.local file to activate my AI brain! I am currently running on basic simulated logic.";
      let action: 'NAVIGATE_ORDERS' | undefined = undefined;

      if (lowerMessage.includes('delivery') || lowerMessage.includes('order details')) {
        responseContent = "I can certainly help you with your delivery and order details! I am redirecting you to your orders page so we can look at your specific orders together.";
        action = 'NAVIGATE_ORDERS';
      } else if (lowerMessage.includes('product') || lowerMessage.includes('honey')) {
        responseContent = "Bee Kiss offers 100% natural, premium pure honey and healthy authentic food products directly from Wayanad, Kerala. Our honey is available in different sizes and flavors to suit your taste.";
      } else if (lowerMessage.includes('process') || lowerMessage.includes('about')) {
        responseContent = "At Bee Kiss, we partner directly with local farmers in Wayanad. Our pure honey is sustainably harvested from the wild, filtered naturally to preserve its goodness, and packaged with care to bring nature's luxury directly to your home.";
      }

      await new Promise((resolve) => setTimeout(resolve, 800));

      return NextResponse.json({
        role: 'assistant',
        content: responseContent,
        action: action,
      });
    }

    // Initialize Gemini AI
    const ai = new GoogleGenAI({ apiKey });

    const systemPrompt = `You are Bee, the official virtual assistant for Bee Kiss.
Bee Kiss sells 100% natural, premium pure honey and healthy authentic food products directly from Wayanad, Kerala.
Be extremely friendly, concise, and helpful. Always stay in character as a helpful bee, use words like "buzz" or "hive" occasionally but don't overdo it.

CRITICAL INSTRUCTION:
If the customer asks about delivery details, their order status, tracking, or similar topics, you MUST reply with a JSON object containing exactly:
{"action": "NAVIGATE_ORDERS", "message": "<your response text explaining you are taking them to their orders page to check>"}

Otherwise, if it's a normal question about products, honey, or general chat, just reply with a simple text string. DO NOT use JSON if there is no action needed.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.5,
      }
    });

    const aiText = response.text || "";
    
    // Check if Gemini returned a JSON object for navigation
    try {
      const textToParse = aiText.trim();
      // Only try to parse if it looks like JSON
      if (textToParse.startsWith('{') && textToParse.endsWith('}')) {
        const parsed = JSON.parse(textToParse);
        if (parsed.action === 'NAVIGATE_ORDERS' && parsed.message) {
          return NextResponse.json({
            role: 'assistant',
            content: parsed.message,
            action: parsed.action,
          });
        }
      }
    } catch(e) {
      // It's not valid JSON, which is fine and expected for normal chat
    }

    // Return normal text response
    return NextResponse.json({
      role: 'assistant',
      content: aiText,
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
