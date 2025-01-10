// app/game/page.tsx
'use client';

import GameCanvas from '@/components/game/canvas/game-canvas';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IPlanetDocument } from '@/types/models/planet';

export default function GamePage() {
  const router = useRouter();
  const [planets, setPlanets] = useState<IPlanetDocument[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPlanets() {
      try {
        const response = await fetch('/api/planets');
        const data = await response.json();
        
        if (data.success) {
          setPlanets(data.planets);
        } else {
          console.error('Failed to fetch planets:', data.error);
        }
      } catch (error) {
        console.error('Error fetching planets:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPlanets();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <span className="text-[#888] text-sm">Loading planets...</span>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      {planets && <GameCanvas planets={planets} />}
      <button
        className="fixed bottom-3 right-6 text-xs border border-solid border-black rounded text-blue-400 z-50"
        onClick={async () => {
          sessionStorage.clear();
          await signOut({ redirect: false });
          router.replace('/login');
        }}
      >
        Sign Out
      </button>
    </main>
  );
}