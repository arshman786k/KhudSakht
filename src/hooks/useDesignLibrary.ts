import { useState, useEffect } from 'react';

export type DesignItem = {
  id: string;
  name: string;
  url: string;
};

type UseDesignLibraryReturn = {
  designs: DesignItem[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

// Use proxy in development, direct URL in production
const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '' : 'http://localhost:5000');

export function useDesignLibrary(part: string): UseDesignLibraryReturn {
  const [designs, setDesigns] = useState<DesignItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDesigns = async () => {
    if (!part) {
      setDesigns([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/designs/${part}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        if (response.status === 500) {
          throw new Error('Internal Server Error - The design API server may not be running. Please start it with: npm run server');
        }
        throw new Error(`Failed to fetch designs: ${response.statusText}`);
      }
      
      const data = await response.json();
      setDesigns(Array.isArray(data) ? data : []);
    } catch (err) {
      let errorMessage = 'Failed to fetch designs';
      
      if (err instanceof TypeError && err.message.includes('fetch')) {
        errorMessage = 'Cannot connect to design API server. Make sure the server is running on port 5000. Start it with: npm run server';
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      console.error('Error fetching designs:', err);
      setDesigns([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesigns();
  }, [part]);

  return {
    designs,
    loading,
    error,
    refetch: fetchDesigns,
  };
}

