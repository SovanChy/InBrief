// app/api/news/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const API_KEY = process.env.NEWS_API_KEY;
  
  if (!API_KEY) {
    return NextResponse.json({ error: "API key is missing" }, { status: 500 });
  }
  
  const URL = `https://newsapi.org/v2/top-headlines?country=us&category=technology&apiKey=${API_KEY}`;
  
  try {
    const response = await fetch(URL, { cache: 'no-store' });
    
    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch news" }, { status: response.status });
    }
    
    const data = await response.json();
    return NextResponse.json(data.articles || []);
  } catch (error) {
    return NextResponse.json({ error: (error instanceof Error) ? error.message : String(error) }, { status: 500 });
  }
}