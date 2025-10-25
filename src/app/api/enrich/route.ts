import { NextRequest, NextResponse } from 'next/server';
import { enrichProfileWithAI, generateVerificationInsights } from '@/lib/openai';
import { EnrichmentRequest } from '@/types/profile';

export async function POST(request: NextRequest) {
  try {
    const body: EnrichmentRequest = await request.json();
    const { profileId, rawData, sources } = body;

    if (!profileId || !rawData) {
      return NextResponse.json(
        { error: 'Profile ID and raw data are required' },
        { status: 400 }
      );
    }

    // Generate AI summary
    const aiSummary = await enrichProfileWithAI(rawData, sources);
    
    // Generate verification insights
    const verificationInsights = await generateVerificationInsights(rawData);

    const enrichedData = {
      profileId,
      aiSummary,
      verificationInsights,
      enrichedAt: new Date().toISOString(),
      sources
    };

    return NextResponse.json(enrichedData);
  } catch (error) {
    console.error('Enrichment API error:', error);
    return NextResponse.json(
      { error: 'Failed to enrich profile data' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const profileId = searchParams.get('profileId');

  if (!profileId) {
    return NextResponse.json(
      { error: 'Profile ID is required' },
      { status: 400 }
    );
  }

  try {
    // This would typically fetch from a database
    // For now, return a mock response
    const mockEnrichment = {
      profileId,
      aiSummary: 'AI analysis temporarily unavailable. Please try again later.',
      verificationInsights: 'Verification analysis temporarily unavailable.',
      enrichedAt: new Date().toISOString(),
      sources: ['Google Search', 'Hunter.io']
    };

    return NextResponse.json(mockEnrichment);
  } catch (error) {
    console.error('Enrichment fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch enrichment data' },
      { status: 500 }
    );
  }
}
