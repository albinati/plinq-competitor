import { NextRequest, NextResponse } from 'next/server';
import { aggregateProfileData } from '@/lib/apis/aggregator';
import { SearchResult } from '@/types/profile';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter is required' },
      { status: 400 }
    );
  }

  try {
    const startTime = Date.now();
    
    // Aggregate data from multiple sources
    const profiles = await aggregateProfileData(query);
    
    const searchTime = Date.now() - startTime;
    
    const result: SearchResult = {
      profiles,
      totalResults: profiles.length,
      searchTime
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, filters } = body;

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    const startTime = Date.now();
    
    // Enhanced search with filters
    const profiles = await aggregateProfileData(query);
    
    // Apply filters if provided
    let filteredProfiles = profiles;
    if (filters) {
      if (filters.verificationLevel) {
        filteredProfiles = profiles.filter(
          p => p.verificationLevel === filters.verificationLevel
        );
      }
      if (filters.hasEmail) {
        filteredProfiles = filteredProfiles.filter(p => p.email);
      }
      if (filters.hasSocialProfiles) {
        filteredProfiles = filteredProfiles.filter(
          p => p.socialProfiles && p.socialProfiles.length > 0
        );
      }
    }
    
    const searchTime = Date.now() - startTime;
    
    const result: SearchResult = {
      profiles: filteredProfiles,
      totalResults: filteredProfiles.length,
      searchTime
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
