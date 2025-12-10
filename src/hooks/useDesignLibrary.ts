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

// Mock designs data - no backend required
const mockDesigns: Record<string, DesignItem[]> = {
  'front': [
    { id: 'front-1', name: 'Floral Pattern', url: 'https://res.cloudinary.com/dmqcpclos/image/upload/c_limit,w_400,f_auto,q_auto/floral-pattern' },
    { id: 'front-2', name: 'Geometric Design', url: 'https://res.cloudinary.com/dmqcpclos/image/upload/c_limit,w_400,f_auto,q_auto/geometric-design' },
    { id: 'front-3', name: 'Traditional Motif', url: 'https://res.cloudinary.com/dmqcpclos/image/upload/c_limit,w_400,f_auto,q_auto/traditional-motif' },
  ],
  'back': [
    { id: 'back-1', name: 'Simple Border', url: 'https://res.cloudinary.com/dmqcpclos/image/upload/c_limit,w_400,f_auto,q_auto/simple-border' },
    { id: 'back-2', name: 'Elegant Pattern', url: 'https://res.cloudinary.com/dmqcpclos/image/upload/c_limit,w_400,f_auto,q_auto/elegant-pattern' },
  ],
  'gala': [
    { id: 'gala-1', name: 'Classic Gala', url: 'https://res.cloudinary.com/dmqcpclos/image/upload/c_limit,w_400,f_auto,q_auto/classic-gala' },
    { id: 'gala-2', name: 'Modern Gala', url: 'https://res.cloudinary.com/dmqcpclos/image/upload/c_limit,w_400,f_auto,q_auto/modern-gala' },
  ],
  'shalwar': [
    { id: 'shalwar-1', name: 'Traditional Print', url: 'https://res.cloudinary.com/dmqcpclos/image/upload/c_limit,w_400,f_auto,q_auto/traditional-print' },
  ],
  'bazo': [
    { id: 'bazo-1', name: 'Sleeve Design', url: 'https://res.cloudinary.com/dmqcpclos/image/upload/c_limit,w_400,f_auto,q_auto/sleeve-design' },
  ],
};

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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Get mock designs for the part
      const partDesigns = mockDesigns[part] || [];
      setDesigns(partDesigns);
    } catch (err) {
      console.error('Error loading designs:', err);
      setError('Failed to load designs');
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

