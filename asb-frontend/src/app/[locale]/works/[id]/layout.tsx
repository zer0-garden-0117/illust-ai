// app/[locale]/works/[id]/layout.tsx
import { Metadata } from 'next';
import { ReactNode } from 'react';

// app/[locale]/works/[id]/layout.tsx
export async function generateMetadata({
  params,
}: {
  params: { id: string; locale: string };
}): Promise<Metadata> {
  return {
    title: 'ANGEL SANDBOX',
    description: 'ANGEL SANDBOX',
    openGraph: {
      title: 'ANGEL SANDBOX',
      description: 'ANGEL SANDBOX',
      images: [
        {
          url: 'https://d95u4oj4jbbsz.cloudfront.net/' + params.id + '.jpeg',
          width: 1200,
          height: 630,
          alt: 'ANGEL SANDBOX',
        },
      ],
      type: 'website',
      url: 'https://d95u4oj4jbbsz.cloudfront.net/' + params.id + '.jpeg',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'ANGEL SANDBOX',
      description: 'ANGEL SANDBOX',
      images: ['https://d95u4oj4jbbsz.cloudfront.net/' + params.id + '.jpeg'],
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