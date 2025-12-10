import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Loader2, Image as ImageIcon } from 'lucide-react';
import { useDesignLibrary, type DesignItem } from '../hooks/useDesignLibrary';

interface DesignPickerProps {
  part: string;
  onSelect: (design: DesignItem) => void;
  selectedDesignId?: string | null;
}

export function DesignPicker({ part, onSelect, selectedDesignId }: DesignPickerProps) {
  const { designs, loading, error } = useDesignLibrary(part);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">Loading designs...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
        <p className="text-sm font-medium text-destructive mb-2">⚠️ {error}</p>
        <p className="text-xs text-muted-foreground">Unable to load design library at this time.</p>
      </div>
    );
  }

  if (designs.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center">
        <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">No designs available for this part</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Add design images to the designs/{part}/ folder
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium text-muted-foreground">Browse Design Library</p>
      <div className="grid grid-cols-3 gap-2">
        {designs.map((design) => {
          const isSelected = selectedDesignId === design.id;
          return (
            <button
              key={design.id}
              type="button"
              onClick={() => onSelect(design)}
              className={`group relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-primary ring-2 ring-primary/30'
                  : 'border-border hover:border-primary/50'
              }`}
              aria-label={design.name}
            >
              <img
                src={design.url.startsWith('http') ? design.url : design.url}
                alt={design.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.parentElement?.querySelector('.fallback');
                  if (fallback) {
                    (fallback as HTMLElement).style.display = 'flex';
                  }
                }}
              />
              <div className="fallback hidden h-full w-full items-center justify-center bg-muted">
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
              </div>
              {isSelected && (
                <div className="absolute inset-0 bg-primary/10" />
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-1.5 py-0.5">
                <p className="truncate text-[10px] text-white">{design.name}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

