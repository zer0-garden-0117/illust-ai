// app/[locale]/works/[id]/layout.tsx
import { Metadata } from 'next';
import { ReactNode } from 'react';

// app/[locale]/works/[id]/layout.tsx
export async function generateMetadata({
  params,
}: {
  params: { id: string; locale: string };
}): Promise<Metadata> {
  // APIから作品データを取

  return {
    title: 'デフォルトタイトル',
    description: 'デフォルト説明文',
    openGraph: {
      title: 'デフォルトOGタイトル',
      description: 'デフォルトOG説明文',
      images: [
        {
          url: 'https://d95u4oj4jbbsz.cloudfront.net/titleImage_20250503_160040.jpeg',
          width: 1200,
          height: 630,
          alt: 'デフォルトALT',
        },
      ],
      type: 'website',
      url: `https://d95u4oj4jbbsz.cloudfront.net/titleImage_20250503_160040.jpeg`,
    },
    twitter: {
      card: 'summary_large_image',
      title: 'デフォルトTwitterタイトル',
      description: 'デフォルトTwitter説明文',
      images: ['https://d95u4oj4jbbsz.cloudfront.net/titleImage_20250503_160040.jpeg'],
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