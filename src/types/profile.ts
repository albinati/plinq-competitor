export interface ProfileData {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  socialProfiles: SocialProfile[];
  professionalInfo: ProfessionalInfo;
  verificationScore: number;
  verificationLevel: 'verified' | 'trusted' | 'basic' | 'limited';
  dataSources: DataSource[];
  aiSummary?: string;
  lastUpdated: Date;
}

export interface SocialProfile {
  platform: string;
  username: string;
  url: string;
  verified: boolean;
  followers?: number;
  bio?: string;
}

export interface ProfessionalInfo {
  company?: string;
  title?: string;
  industry?: string;
  location?: string;
  experience?: string;
}

export interface DataSource {
  name: string;
  url: string;
  reliability: number;
  lastChecked: Date;
}

export interface SearchResult {
  profiles: ProfileData[];
  totalResults: number;
  searchTime: number;
}

export interface EnrichmentRequest {
  profileId: string;
  rawData: any;
  sources: string[];
}
