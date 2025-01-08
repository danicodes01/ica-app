'use client';

import GameCanvas from '@/components/game/canvas/game-canvas';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function GamePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen">
      <GameCanvas />
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