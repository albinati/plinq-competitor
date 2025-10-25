import { ProfileData, DataSource } from '@/types/profile';
import { findEmails, searchWeb, searchWithSerpAPI, extractSocialProfiles, extractProfessionalInfo, calculateVerificationScore, getVerificationLevel } from './social';

export async function aggregateProfileData(query: string): Promise<ProfileData[]> {
  const profiles: ProfileData[] = [];
  const dataSources: DataSource[] = [];
  
  try {
    // Search web for general information
    const webResults = await searchWeb(query);
    const serpResults = await searchWithSerpAPI(query);
    
    // Extract social profiles
    const socialProfiles = extractSocialProfiles(webResults);
    const professionalInfo = extractProfessionalInfo(webResults);
    
    // Try to find emails if we have domain information
    let emails: string[] = [];
    if (professionalInfo.company) {
      emails = await findEmails(professionalInfo.company.toLowerCase().replace(/\s+/g, ''));
    }
    
    // Create profile data
    const profileData: Partial<ProfileData> = {
      id: generateProfileId(query),
      name: extractNameFromQuery(query),
      email: emails[0],
      socialProfiles,
      professionalInfo,
      lastUpdated: new Date(),
      dataSources: [
        {
          name: 'Google Search',
          url: 'https://google.com',
          reliability: 0.8,
          lastChecked: new Date()
        },
        {
          name: 'Hunter.io',
          url: 'https://hunter.io',
          reliability: 0.9,
          lastChecked: new Date()
        }
      ]
    };
    
    // Calculate verification score
    const verificationScore = calculateVerificationScore(profileData);
    const verificationLevel = getVerificationLevel(verificationScore);
    
    const completeProfile: ProfileData = {
      ...profileData,
      verificationScore,
      verificationLevel,
      dataSources: profileData.dataSources || []
    } as ProfileData;
    
    profiles.push(completeProfile);
    
  } catch (error) {
    console.error('Error aggregating profile data:', error);
  }
  
  return profiles;
}

function generateProfileId(query: string): string {
  return Buffer.from(query.toLowerCase().replace(/\s+/g, '-')).toString('base64').slice(0, 12);
}

function extractNameFromQuery(query: string): string {
  // Simple name extraction - in production, use more sophisticated parsing
  const nameParts = query.split(' ').filter(part => part.length > 1);
  return nameParts.join(' ');
}

export async function enrichProfileWithMultipleSources(profileId: string, initialData: any): Promise<ProfileData> {
  // This would be called after initial profile creation to add more data sources
  // For now, return the initial data with enhanced verification
  const verificationScore = calculateVerificationScore(initialData);
  const verificationLevel = getVerificationLevel(verificationScore);
  
  return {
    ...initialData,
    verificationScore,
    verificationLevel,
    lastUpdated: new Date()
  };
}
