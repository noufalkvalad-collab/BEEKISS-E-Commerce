import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import dbConnect from '@/lib/db/mongodb';
import Product from '@/lib/models/Product';

export async function POST(request: Request) {
  try {
    const { message, context } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Connect to Database
    await dbConnect();

    // Fetch live product data
    const products = await Product.find({ isActive: true }).lean();
    
    // Format product data for the AI context
    const productsList = products.map(p => {
      const variants = p.variants.map((v: any) => `  - ${v.weight}: ₹${v.price}`).join('\n');
      return `\n${p.name}\n${p.description || ''}\nVariants:\n${variants}`;
    }).join('\n');

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
        const productNames = products.slice(0, 3).map(p => p.name).join(', ');
        responseContent = `Bee Kiss offers 100% natural, premium pure honey and healthy authentic food products directly from Wayanad, Kerala. Some of our live products include: ${productNames}.`;
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

    const systemPrompt = `You are the official AI assistant for the Bee Kiss Honey website.
Bee Kiss is a premium honey brand from Wayanad, Kerala, India.

You should speak in a mix of Malayalam and simple English so customers from Kerala can easily understand.

Always be friendly and helpful. Your job is to explain Bee Kiss products, give the correct prices and help customers place orders.

Current Page Context:
The user is currently on: ${context?.path || 'unknown page'}

Bee Kiss - LIVE Product Catalog (Use these prices and details):
${productsList}

Rules:
• Always give prices exactly as listed in the catalog above.
• Reply in Malayalam + English mix.
• Keep answers short and clear.
• Encourage customers to order through WhatsApp.

WhatsApp Order Number: 9778761661

Example reply style:

🍯 Bee Kiss Lemon Honey

10g stick – ₹20
100g – ₹200
250g – ₹400
500g – ₹800
1kg – ₹1600

ഇത് വളരെ നല്ല immunity booster ആണ്.

Order ചെയ്യാൻ WhatsApp message അയക്കാം 👉 9778761661               . Hi 👋 Bee Kiss website-ിലേക്ക് സ്വാഗതം.

🍯 Wayanad forest-ൽ നിന്നും ലഭിക്കുന്ന pure honey products ഇവിടെ ലഭ്യമാണ്.

എന്ത് സഹായം വേണം?

1️⃣ Product details
2️⃣ Price list
3️⃣ Honey health benefits
4️⃣ WhatsApp order

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

  } catch (error: any) {
    console.error('Chat API Error:', error);

    // Provide a friendly message to the user if the Gemini API rate limit is exceeded
    if (error.status === 429) {
      return NextResponse.json({
        role: 'assistant',
        content: "I'm currently receiving too many requests and have reached my daily speed limit! 🐝 Please try again in a few seconds or contact us directly on WhatsApp at 9778761661.",
      });
    }

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
