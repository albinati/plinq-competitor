'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ProfileData } from '@/types/profile';
import { ProfileCard } from '@/components/ProfileCard';
import VerificationBadge, { VerificationScoreBar } from '@/components/VerificationBadge';
import DataSourceList from '@/components/ProfileCard';

export default function ProfilePage() {
  const params = useParams();
  const profileId = params.id as string;
  
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enriching, setEnriching] = useState(false);

  useEffect(() => {
    if (profileId) {
      loadProfile(profileId);
    }
  }, [profileId]);

  const loadProfile = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would fetch from a database
      // For now, we'll simulate loading a profile
      const mockProfile: ProfileData = {
        id: id,
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        socialProfiles: [
          {
            platform: 'LinkedIn',
            username: 'johndoe',
            url: 'https://linkedin.com/in/johndoe',
            verified: true,
            bio: 'Software Engineer at Tech Corp'
          },
          {
            platform: 'Twitter',
            username: '@johndoe',
            url: 'https://twitter.com/johndoe',
            verified: false,
            followers: 1500
          }
        ],
        professionalInfo: {
          company: 'Tech Corp',
          title: 'Senior Software Engineer',
          location: 'San Francisco, CA',
          industry: 'Technology'
        },
        verificationScore: 85,
        verificationLevel: 'verified',
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
        ],
        lastUpdated: new Date()
      };
      
      setProfile(mockProfile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const enrichProfile = async () => {
    if (!profile) return;
    
    setEnriching(true);
    
    try {
      const response = await fetch('/api/enrich', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profileId: profile.id,
          rawData: profile,
          sources: profile.dataSources.map(s => s.name)
        }),
      });
      
      const enrichedData = await response.json();
      
      setProfile(prev => prev ? {
        ...prev,
        aiSummary: enrichedData.aiSummary
      } : null);
    } catch (error) {
      console.error('Enrichment error:', error);
    } finally {
      setEnriching(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h3 className="text-lg font-semibold text-red-800 mb-2">Profile Not Found</h3>
              <p className="text-red-600 mb-4">{error || 'The requested profile could not be found.'}</p>
              <a
                href="/"
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Back to Search
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {profile.name}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>Profile ID: {profile.id}</span>
                <span>•</span>
                <span>Updated {profile.lastUpdated.toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <VerificationBadge 
                verificationLevel={profile.verificationLevel}
                verificationScore={profile.verificationScore}
              />
              <button
                onClick={enrichProfile}
                disabled={enriching}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {enriching ? 'Enhancing...' : 'Enhance with AI'}
              </button>
            </div>
          </div>
        </div>

        {/* Verification Score */}
        <div className="mb-8">
          <VerificationScoreBar score={profile.verificationScore} />
        </div>

        {/* Profile Details */}
        <div className="space-y-6">
          <ProfileCard profile={profile} showDetails={true} />
          
          {/* AI Summary Section */}
          {profile.aiSummary && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Analysis</h3>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {profile.aiSummary}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-between">
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Search
          </a>
          
          <div className="flex space-x-3">
            <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              Export Profile
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Share Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
