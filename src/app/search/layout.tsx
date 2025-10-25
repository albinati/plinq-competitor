import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search Results - ProfileCheck',
  description: 'Search results for people profiles with verification and AI insights.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
