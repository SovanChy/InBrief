import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { JSDOM } from 'jsdom'
import { Readability } from '@mozilla/readability'

interface ArticleResult {
  title: string;
  url: string;
  description: string;
  textContent?: string;
}

export async function GET(request: NextRequest) {
  try {
    // News API request
  // Extract "link" from query parameters
    const { searchParams } = new URL(request.url);
    let link = searchParams.get('link');  
    console.log(request.url) 
    
    if (!link) {
      return NextResponse.json({ error: 'No link provided' }, { status: 400 });
      // link = "https://www.bbc.co.uk/programmes/p0kzm406";
    }

    console.log(`Scraping article from: ${link}`);

    // const newsResponse = await axios.get(link);
    const firstResult = {
      title: "BBC Programmes",
      url: link,
      description: "BBC Programmes page content"
    };

    // Fetch article HTML
    const articleResponse = await axios.get(firstResult.url);

    // Parse HTML with Readability
    const dom = new JSDOM(articleResponse.data, {
      url: firstResult.url
    });

    const article = new Readability(dom.window.document).parse();

    // Construct response
    const scrapedResult: ArticleResult = {
      title: firstResult.title,
      url: firstResult.url,
      description: firstResult.description,
      textContent: article?.textContent || ''
    };

    return NextResponse.json(scrapedResult, { status: 200 });
  } catch (error) {
    console.error('Scraping error:', error);
    return NextResponse.json(
      { error: 'Failed to scrape article' }, 
      { status: 500 }
    );
  }
}