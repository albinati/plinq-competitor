import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile Details - ProfileCheck',
  description: 'Detailed profile information with verification badges and AI insights.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
