import { ProfileData, DataSource } from '@/types/profile';

interface DataSourceListProps {
  sources: DataSource[];
  className?: string;
}

export default function DataSourceList({ sources, className = '' }: DataSourceListProps) {
  if (!sources || sources.length === 0) {
    return (
      <div className={`text-gray-500 text-sm ${className}`}>
        No data sources available
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <h4 className="text-sm font-medium text-gray-900">Data Sources</h4>
      <div className="space-y-1">
        {sources.map((source, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-2 ${
                source.reliability >= 0.8 ? 'bg-green-500' :
                source.reliability >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
              <span className="text-gray-700">{source.name}</span>
            </div>
            <div className="flex items-center text-gray-500">
              <span className="text-xs mr-2">
                {Math.round(source.reliability * 100)}%
              </span>
              <span className="text-xs">
                {new Date(source.lastChecked).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface ProfileCardProps {
  profile: ProfileData;
  showDetails?: boolean;
  className?: string;
}

export function ProfileCard({ profile, showDetails = false, className = '' }: ProfileCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{profile.name}</h3>
          {profile.email && (
            <p className="text-sm text-gray-600">{profile.email}</p>
          )}
          {profile.phone && (
            <p className="text-sm text-gray-600">{profile.phone}</p>
          )}
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500 mb-1">
            Updated {new Date(profile.lastUpdated).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Professional Info */}
      {profile.professionalInfo && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Professional Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
            {profile.professionalInfo.company && (
              <div>
                <span className="font-medium">Company:</span> {profile.professionalInfo.company}
              </div>
            )}
            {profile.professionalInfo.title && (
              <div>
                <span className="font-medium">Title:</span> {profile.professionalInfo.title}
              </div>
            )}
            {profile.professionalInfo.location && (
              <div>
                <span className="font-medium">Location:</span> {profile.professionalInfo.location}
              </div>
            )}
            {profile.professionalInfo.industry && (
              <div>
                <span className="font-medium">Industry:</span> {profile.professionalInfo.industry}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Social Profiles */}
      {profile.socialProfiles && profile.socialProfiles.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Social Profiles</h4>
          <div className="flex flex-wrap gap-2">
            {profile.socialProfiles.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                <span className="mr-1">{social.platform}</span>
                {social.verified && (
                  <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* AI Summary */}
      {profile.aiSummary && showDetails && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">AI Analysis</h4>
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
            {profile.aiSummary}
          </div>
        </div>
      )}

      {/* Data Sources */}
      {showDetails && (
        <DataSourceList sources={profile.dataSources} />
      )}
    </div>
  );
}
