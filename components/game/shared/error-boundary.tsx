// components/game/shared/error-boundary.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Error:', error);
  }, [error]);

  return (
    <div className="fixed inset-0 bg-[#1C1C1EFF] flex items-center justify-center">
      <div className="max-w-xl p-8 text-center">
        <h2 className="font-ps2p text-[color:var(--game-text)] text-2xl mb-4">
          Navigation System Error
        </h2>
        <p className="font-ps2p text-[color:var(--game-text)] text-sm mb-6">
          {error.message || 'An unexpected error occurred'}
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={reset}
            className="font-ps2p bg-[#64D2FFFF] text-black px-4 py-2 text-sm hover:bg-[#5BC1EBFF] transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => router.push('/game')}
            className="font-ps2p border border-[#64D2FFFF] text-[#64D2FFFF] px-4 py-2 text-sm hover:bg-[#64D2FF33] transition-colors"
          >
            Return to Base
          </button>
        </div>
      </div>
    </div>
  );
}