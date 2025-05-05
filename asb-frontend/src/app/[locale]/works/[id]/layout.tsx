// app/[locale]/works/[id]/layout.tsx
import { Metadata } from 'next';
import { ReactNode } from 'react';

// app/[locale]/works/[id]/layout.tsx
export async function generateMetadata({
  params,
}: {
  params: { id: string; locale: string };
}): Promise<Metadata> {
  const ogpTitle = "ANGEL SANDBOX"
  const ogpUrl = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL + '/' + params.id + '_ogpImage.jpeg'

  return {
    title: ogpTitle,
    description: ogpTitle,
    openGraph: {
      title: ogpTitle,
      description: ogpTitle,
      images: [
        {
          url: ogpUrl,
          width: 1200,
          height: 630,
          alt: ogpTitle,
        },
      ],
      type: 'website',
      url: ogpUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title: ogpTitle,
      description: ogpTitle,
      images: [ogpUrl],
    },
  };
}

// レイアウトコンポーネント
export default async function WorkLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { id: string; locale: string };
}) {
  return (
    <>
      {children}
    </>
  )
}