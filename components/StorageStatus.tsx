'use client';

import { useEffect, useState } from 'react';

type StorageType = 'vercel_kv' | 'memory' | 'unknown';
type StorageStatusType = 'kv_connected' | 'memory_fallback' | 'error' | 'loading';

export function StorageStatus() {
  const [status, setStatus] = useState<StorageStatusType>('loading');
  const [storageType, setStorageType] = useState<StorageType>('unknown');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkHealth() {
      try {
        const res = await fetch('/api/health');
        const data = await res.json();
        setStorageType(data.storage?.type || 'unknown');
        setStatus(data.storage?.status || 'error');
        setError(data.storage?.error || null);
      } catch {
        setStatus('error');
        setError('Failed to check health');
      }
    }

    checkHealth();
  }, []);

  const getIndicator = () => {
    switch (status) {
      case 'loading':
        return { color: 'bg-gray-500', label: 'Checking...' };
      case 'kv_connected':
        return { color: 'bg-green-500', label: 'KV Connected' };
      case 'memory_fallback':
        return { color: 'bg-yellow-500', label: 'Memory (dev)' };
      case 'error':
        return { color: 'bg-red-500', label: 'Storage Error' };
      default:
        return { color: 'bg-gray-500', label: 'Unknown' };
    }
  };

  const { color, label } = getIndicator();

  return (
    <div className="flex items-center gap-2 text-xs text-gray-500" title={error || `Storage: ${storageType}`}>
      <span className={`w-2 h-2 rounded-full ${color}`} />
      <span>{label}</span>
    </div>
  );
}
