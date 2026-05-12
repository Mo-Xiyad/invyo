import type { Metadata } from 'next';
import ArabicMoorishTemplate from '@/templates/arabic-moorish';

export const metadata: Metadata = {
  title: 'Arabic Moorish — Template Preview',
  robots: { index: false },
};

export default function ArabicMoorishPreviewPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center sm:py-12">
      <div
        className="w-full sm:w-[390px] sm:min-h-[844px] sm:shadow-2xl sm:overflow-hidden"
      >
        <ArabicMoorishTemplate />
      </div>
    </div>
  );
}
