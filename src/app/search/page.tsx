'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProfileData } from '@/types/profile';
import { ProfileCard } from '@/components/ProfileCard';
import VerificationBadge, { VerificationScoreBar } from '@/components/VerificationBadge';
import DataSourceList from '@/components/ProfileCard';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  
  const [profiles, setProfiles] = useState<ProfileData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTime, setSearchTime] = useState<number>(0);

  useEffect(() => {
    if (query) {
      searchProfiles(query);
    }
  }, [query]);

  const searchProfiles = async (searchQuery: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Search failed');
      }
      
      setProfiles(data.profiles);
      setSearchTime(data.searchTime);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const enrichProfile = async (profileId: string) => {
    try {
      const response = await fetch('/api/enrich', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profileId,
          rawData: profiles.find(p => p.id === profileId),
          sources: ['Google Search', 'Hunter.io']
        }),
      });
      
      const enrichedData = await response.json();
      
      // Update the profile with enriched data
      setProfiles(prev => prev.map(p => 
        p.id === profileId 
          ? { ...p, aiSummary: enrichedData.aiSummary }
          : p
      ));
    } catch (error) {
      console.error('Enrichment error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Searching...</h2>
            <p className="text-gray-600">Finding profiles for "{query}"</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h3 className="text-lg font-semibold text-red-800 mb-2">Search Error</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => searchProfiles(query || '')}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Search Results for "{query}"
          </h1>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{profiles.length} profile{profiles.length !== 1 ? 's' : ''} found</span>
            <span>Search completed in {searchTime}ms</span>
          </div>
        </div>

        {/* Results */}
        {profiles.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No profiles found</h3>
            <p className="text-gray-600">Try adjusting your search terms or check the spelling.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {profiles.map((profile) => (
              <div key={profile.id} className="bg-white rounded-lg shadow-sm border">
                <div className="p-6">
                  {/* Profile Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-900 mb-1">
                        {profile.name}
                      </h2>
                      {profile.email && (
                        <p className="text-gray-600 mb-1">{profile.email}</p>
                      )}
                      {profile.phone && (
                        <p className="text-gray-600">{profile.phone}</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <VerificationBadge 
                        verificationLevel={profile.verificationLevel}
                        verificationScore={profile.verificationScore}
                      />
                      <button
                        onClick={() => enrichProfile(profile.id)}
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                      >
                        Enhance with AI
                      </button>
                    </div>
                  </div>

                  {/* Verification Score */}
                  <div className="mb-4">
                    <VerificationScoreBar score={profile.verificationScore} />
                  </div>

                  {/* Profile Details */}
                  <ProfileCard profile={profile} showDetails={true} className="shadow-none border-none p-0" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back to Search */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            New Search
          </a>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading...</h2>
          </div>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
