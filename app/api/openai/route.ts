import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Store API key securely in .env
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini", // Use a val name
      messages: [
        {
          role: "user",
          content: `Summarize this article in exactly 5 concise bullet points, focusing on key facts and main ideas. Keep each point brief and to the point. No markdown format: ${prompt}`,
        },
      ],
    });

    return NextResponse.json({
      message: completion.choices[0].message.content,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch AI response" },
      { status: 500 }
    );
  }
}



