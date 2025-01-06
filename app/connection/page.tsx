// app/connection/page.tsx
'use client';

import { useEffect, useState } from 'react';

type ConnectionStatus = {
  success: boolean;
  message: string;
  error?: string;
};

export default function ConnectionPage() {
  const [status, setStatus] = useState<ConnectionStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch('/api/connection');
        const data: ConnectionStatus = await response.json();
        setStatus(data);
      } catch (error) {
        setStatus({
          success: false,
          message: 'Failed to fetch connection status',
          error: (error as Error).message,
        });
      } finally {
        setLoading(false);
      }
    };

    checkConnection();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <main className='flex flex-col gap-8 row-start-2 items-center sm:items-start'>
        <h1>MongoDB Connection Status</h1>
        {loading && <p>Loading...</p>}
        {!loading && status && (
          <div>
            <p>
              <strong>Status:</strong>{' '}
              {status.success ? 'Connected' : 'Not Connected'}
            </p>
            <p>
              <strong>Message:</strong> {status.message}
            </p>
            {status.error && (
              <p style={{ color: 'red' }}>
                <strong>Error:</strong> {status.error}
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
