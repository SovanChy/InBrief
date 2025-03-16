// app/news/page.tsx
import React from 'react';
import NewsFeed from '@/components/news-feed';
import { headers } from 'next/headers';

export default async function Page() {
  try {
    // Get the host from headers to construct absolute URL
    const headersList = await headers();
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    
    // Use absolute URL with proper origin
    const res = await fetch(`${protocol}://${host}/api/news`, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      throw new Error(`API returned ${res.status}`);
    }
    
    const articles = await res.json();
    return (
      <div>
        <NewsFeed articles={articles} />
      </div>
    );
  } catch (error) {
    return <div>Error loading news: {error instanceof Error ? error.message : String(error)}</div>;
  }
}