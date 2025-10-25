import axios from 'axios';
import { ProfileData, SocialProfile, ProfessionalInfo, DataSource } from '@/types/profile';

// Hunter.io API for email finding
export async function findEmails(domain: string, firstName?: string, lastName?: string): Promise<string[]> {
  try {
    const response = await axios.get('https://api.hunter.io/v2/domain-search', {
      params: {
        domain,
        api_key: process.env.HUNTER_API_KEY,
        first_name: firstName,
        last_name: lastName,
        limit: 10
      }
    });
    
    return response.data.data?.emails?.map((email: any) => email.value) || [];
  } catch (error) {
    console.error('Hunter.io API error:', error);
    return [];
  }
}

// Google Custom Search for web results
export async function searchWeb(query: string): Promise<any[]> {
  try {
    const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
      params: {
        key: process.env.GOOGLE_API_KEY,
        cx: process.env.GOOGLE_CSE_ID,
        q: query,
        num: 10
      }
    });
    
    return response.data.items || [];
  } catch (error) {
    console.error('Google Search API error:', error);
    return [];
  }
}

// SerpAPI for enhanced search results
export async function searchWithSerpAPI(query: string): Promise<any> {
  try {
    const response = await axios.get('https://serpapi.com/search', {
      params: {
        api_key: process.env.SERPAPI_KEY,
        q: query,
        engine: 'google',
        num: 10
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('SerpAPI error:', error);
    return null;
  }
}

// Extract social profiles from search results
export function extractSocialProfiles(searchResults: any[]): SocialProfile[] {
  const profiles: SocialProfile[] = [];
  const platforms = ['linkedin', 'twitter', 'instagram', 'facebook', 'github'];
  
  searchResults.forEach(result => {
    platforms.forEach(platform => {
      if (result.link?.includes(platform)) {
        profiles.push({
          platform: platform.charAt(0).toUpperCase() + platform.slice(1),
          username: extractUsername(result.link, platform),
          url: result.link,
          verified: false, // Would need platform-specific verification
          bio: result.snippet
        });
      }
    });
  });
  
  return profiles;
}

function extractUsername(url: string, platform: string): string {
  const patterns = {
    linkedin: /linkedin\.com\/in\/([^\/\?]+)/,
    twitter: /twitter\.com\/([^\/\?]+)/,
    instagram: /instagram\.com\/([^\/\?]+)/,
    facebook: /facebook\.com\/([^\/\?]+)/,
    github: /github\.com\/([^\/\?]+)/
  };
  
  const match = url.match(patterns[platform as keyof typeof patterns]);
  return match ? match[1] : 'unknown';
}

// Extract professional information from search results
export function extractProfessionalInfo(searchResults: any[]): ProfessionalInfo {
  const snippets = searchResults.map(r => r.snippet).join(' ');
  
  // Simple extraction - in production, use more sophisticated NLP
  const companyMatch = snippets.match(/(?:at|@|works at|employed by)\s+([A-Z][a-zA-Z\s&]+)/i);
  const titleMatch = snippets.match(/(?:is|as|title:)\s+([A-Z][a-zA-Z\s]+(?:Manager|Director|Engineer|Developer|Analyst|Consultant))/i);
  const locationMatch = snippets.match(/(?:in|from|based in)\s+([A-Z][a-zA-Z\s,]+)/i);
  
  return {
    company: companyMatch ? companyMatch[1].trim() : undefined,
    title: titleMatch ? titleMatch[1].trim() : undefined,
    location: locationMatch ? locationMatch[1].trim() : undefined,
    industry: undefined, // Would need more sophisticated extraction
    experience: undefined
  };
}

// Calculate verification score
export function calculateVerificationScore(profileData: Partial<ProfileData>): number {
  let score = 0;
  
  // Multiple source confirmation
  if (profileData.dataSources && profileData.dataSources.length > 1) {
    score += 20;
  }
  
  // Social media verification badges
  if (profileData.socialProfiles?.some(p => p.verified)) {
    score += 30;
  }
  
  // Consistent data across sources
  if (profileData.email && profileData.socialProfiles?.length) {
    score += 25;
  }
  
  // Professional domain email
  if (profileData.email?.includes('@') && !profileData.email.includes('gmail.com') && !profileData.email.includes('yahoo.com')) {
    score += 10;
  }
  
  // Recent activity/updates (simplified)
  if (profileData.lastUpdated) {
    const daysSinceUpdate = (Date.now() - profileData.lastUpdated.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceUpdate < 30) {
      score += 15;
    }
  }
  
  return Math.min(score, 100);
}

// Get verification level based on score
export function getVerificationLevel(score: number): 'verified' | 'trusted' | 'basic' | 'limited' {
  if (score >= 80) return 'verified';
  if (score >= 60) return 'trusted';
  if (score >= 40) return 'basic';
  return 'limited';
}
