import type { Metadata } from 'next';
import ArabicMoorishTemplate from '@/templates/arabic-moorish';

export const metadata: Metadata = {
  title: 'Arabic Moorish — Template Preview',
  robots: { index: false },
};

export default function ArabicMoorishPreviewPage() {
  return <ArabicMoorishTemplate />;
}
