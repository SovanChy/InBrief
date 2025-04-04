import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { JSDOM } from 'jsdom'
import { Readability } from '@mozilla/readability'

interface ArticleResult {
  url: string;
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
      url: link,
    };

    // const agent = new https.Agent({ rejectUnauthorized: false });

    // Fetch article HTML
    // const articleResponse = await axios.get(firstResult.url);
    const articleResponse = await axios.get(firstResult.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    });
    // Parse HTML with Readability
    const dom = new JSDOM(articleResponse.data, {
      url: firstResult.url
    });

    const article = new Readability(dom.window.document).parse();

    // Construct response
    const scrapedResult: ArticleResult = {
      url: firstResult.url,
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