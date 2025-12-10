import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DecalGeometry } from 'three/examples/jsm/geometries/DecalGeometry.js';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Slider } from '../components/ui/slider';
import { Sparkles, ShoppingCart, Download } from 'lucide-react';
import { DesignPicker } from '../components/DesignPicker';
import type { DesignItem } from '../hooks/useDesignLibrary';
import type { CartItem } from '../App';

interface CustomizationCanvasProps {
  onNavigate?: (page: string) => void;
  onAddToCart?: (item: Omit<CartItem, 'id' | 'quantity'>) => void;
}

type GarmentPart = {
  id: string;
  label: string;
  description: string;
  matchers: string[];
};

type DecalTransform = {
  offset: [number, number, number];
  rotation: [number, number, number];
  scale: number;
};

type DecalItem = {
  id: string;
  image: string;
  transform: DecalTransform;
  designId?: string | null;
  name?: string;
};

type PartDecalState = {
  decals: DecalItem[];
};

type PreviewDragState = {
  pointerId: number;
  startX: number;
  startY: number;
  initialOffsetX: number;
  initialOffsetY: number;
  width: number;
  height: number;
};

const fabrics = [
  { id: 'cotton-silk', name: 'Cotton Silk', price: 500, pattern: 'diagonal' },
  { id: 'lawn', name: 'Lawn', price: 400, pattern: 'grid' },
  { id: 'chiffon', name: 'Chiffon', price: 600, pattern: 'dots' },
  { id: 'velvet', name: 'Velvet', price: 800, pattern: 'gradient' },
];

const defaultDecalTransform: DecalTransform = {
  offset: [0, 0.25, 0.05],
  rotation: [0, 0, 0],
  scale: 0.45,
};

// Part-specific transforms for better coverage
const partSpecificTransforms: Record<string, DecalTransform> = {
  gala: {
    offset: [0, 0.35, 0.1],
    rotation: [0, 0, 0],
    scale: 1.2,
  },
  front: {
    offset: [0, 0.1, 0.05],
    rotation: [0, 0, 0],
    scale: 0.65,
  },
  back: {
    offset: [0, 0.1, 0.05],
    rotation: [0, 0, 0],
    scale: 0.65,
  },
  bazo: {
    offset: [0, 0.15, 0.05],
    rotation: [0, 0, 0],
    scale: 0.5,
  },
  shalwar: {
    offset: [0, -0.2, 0.05],
    rotation: [0, 0, 0],
    scale: 0.6,
  },
};

const decalPositionBounds = {
  x: [-0.7, 0.7] as [number, number],
  y: [-0.8, 0.8] as [number, number],
  z: [-0.25, 0.25] as [number, number],
};

const decalScaleBounds: [number, number] = [0.15, 1.5];

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const degToRad = (degrees: number) => (degrees * Math.PI) / 180;
const radToDeg = (radians: number) => (radians * 180) / Math.PI;

const colors = [
  { name: 'Cream', value: '#FAF7F0' },
  { name: 'Rose Pink', value: '#D4A5A5' },
  { name: 'Light Brown', value: '#B8956A' },
  { name: 'Ivory', value: '#F5EFE6' },
  { name: 'Beige', value: '#E8D5C4' },
  { name: 'Dusty Rose', value: '#C8A5A5' },
];

const embroideryPatterns = [
  { id: 'floral', name: 'Floral', preview: '🌸' },
  { id: 'geometric', name: 'Geometric', preview: '◇' },
  { id: 'traditional', name: 'Traditional', preview: '✿' },
  { id: 'minimal', name: 'Minimal', preview: '●' },
];

const garmentParts: GarmentPart[] = [
  {
    id: 'front',
    label: 'Front',
    description: 'Kurta front panel',
    matchers: ['front'],
  },
  {
    id: 'back',
    label: 'Back',
    description: 'Kurta back panel',
    matchers: ['back'],
  },
  {
    id: 'gala',
    label: 'Gala',
    description: 'Neckline & collar',
    matchers: ['gala', 'neck', 'collar'],
  },
  {
    id: 'bazo',
    label: 'Bazo',
    description: 'Sleeves',
    matchers: ['bazo', 'sleeve'],
  },
  {
    id: 'shalwar',
    label: 'Shalwar',
    description: 'Bottom fabric',
    matchers: ['shalwar', 'bottom', 'trouser'],
  },
];

const customizationSections = [
  { key: 'fabric', label: 'Fabric' },
  { key: 'gala', label: 'Gala' },
  { key: 'front', label: 'Front' },
  { key: 'back', label: 'Back' },
  { key: 'bazo', label: 'Bazo/Sleeves' },
  { key: 'shalwar', label: 'Shalwar' },
];

export function CustomizationCanvas({ onNavigate, onAddToCart }: CustomizationCanvasProps) {
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const partMeshLookupRef = useRef<Record<string, THREE.Mesh[]>>({});
  const partColorsRef = useRef<Record<string, string>>({});
  const partDecalTexturesRef = useRef<Record<string, Record<string, THREE.Texture>>>({});
  const partDecalMeshesRef = useRef<Record<string, Record<string, THREE.Mesh>>>({});
  const previewDragRef = useRef<PreviewDragState | null>(null);
  const previewContainerRef = useRef<HTMLDivElement | null>(null);
  const customDesignInputRef = useRef<HTMLInputElement | null>(null);
  const uploadTargetPartRef = useRef<string | null>(null);
  const fabricTexturesRef = useRef<Record<string, THREE.Texture>>({});
  const frameRef = useRef<number>();
  const decalUpdateTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [selectedFabric, setSelectedFabric] = useState(fabrics[0].id);
  const [selectedPart, setSelectedPart] = useState(garmentParts[0].id);
  const [activeSection, setActiveSection] = useState('fabric');
  const [partColors, setPartColors] = useState<Record<string, string>>(() =>
    garmentParts.reduce((acc, part) => {
      acc[part.id] = colors[0].value;
      return acc;
    }, {} as Record<string, string>)
  );
  partColorsRef.current = partColors;
  const [partDecals, setPartDecals] = useState<Record<string, PartDecalState>>(() =>
    garmentParts.reduce((acc, part) => {
      acc[part.id] = { decals: [] };
      return acc;
    }, {} as Record<string, PartDecalState>)
  );
  const partDecalsRef = useRef(partDecals);
  partDecalsRef.current = partDecals;
  const [selectedDecalId, setSelectedDecalId] = useState<string | null>(null);
  const [selectedPattern, setSelectedPattern] = useState(embroideryPatterns[0].id);
  const [fitAdjustment, setFitAdjustment] = useState<number[]>([100]);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const activePartColor = partColors[selectedPart];
  const activePart = garmentParts.find((part) => part.id === selectedPart);
  const activePartDecals = partDecals[selectedPart]?.decals || [];
  const activeDecal = selectedDecalId ? activePartDecals.find(d => d.id === selectedDecalId) : null;
  const activeDecalImage = activeDecal?.image;
  const activeDecalTransform = activeDecal?.transform;

  const applyColorToPart = (partId: string, hex: string) => {
    const meshes = partMeshLookupRef.current[partId];
    if (!meshes?.length) return;
    const color = new THREE.Color(hex);

    meshes.forEach((mesh) => {
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      materials.forEach((material) => {
        const meshMaterial = material as THREE.MeshStandardMaterial;
        if (meshMaterial?.color) {
          meshMaterial.color.set(color);
          meshMaterial.needsUpdate = true;
        }
      });
    });
  };

  const disposeDecal = (partId: string, decalId: string) => {
    const meshes = partDecalMeshesRef.current[partId];
    const mesh = meshes?.[decalId];
    if (mesh && sceneRef.current) {
      sceneRef.current.remove(mesh);
      mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
      delete partDecalMeshesRef.current[partId]?.[decalId];
      if (Object.keys(partDecalMeshesRef.current[partId] || {}).length === 0) {
        delete partDecalMeshesRef.current[partId];
      }
    }
    const textures = partDecalTexturesRef.current[partId];
    const texture = textures?.[decalId];
    if (texture) {
      texture.dispose();
      delete partDecalTexturesRef.current[partId]?.[decalId];
      if (Object.keys(partDecalTexturesRef.current[partId] || {}).length === 0) {
        delete partDecalTexturesRef.current[partId];
      }
    }
  };

  const computeDecalAnchor = (partId: string) => {
    const targetMesh = partMeshLookupRef.current[partId]?.[0];
    if (!targetMesh) return null;
    const bbox = new THREE.Box3().setFromObject(targetMesh);
    return bbox.getCenter(new THREE.Vector3());
  };

  const createDecalGeometry = (partId: string, transform: DecalTransform) => {
    const targetMesh = partMeshLookupRef.current[partId]?.[0];
    if (!targetMesh) return null;
    targetMesh.updateMatrixWorld(true);
    const anchor = computeDecalAnchor(partId) ?? new THREE.Vector3();
    const position = anchor.clone().add(new THREE.Vector3(...transform.offset));
    const orientation = new THREE.Euler(...transform.rotation);
    const size = new THREE.Vector3(transform.scale, transform.scale, transform.scale);
    try {
      return new DecalGeometry(targetMesh, position, orientation, size);
    } catch (error) {
      console.error('Failed to create decal geometry', error);
      return null;
    }
  };

  const applyDecalToPart = (partId: string, decalItem: DecalItem) => {
    if (!sceneRef.current || !decalItem.image) return;
    
    const texture = partDecalTexturesRef.current[partId]?.[decalItem.id];
    if (!texture) return;
    
    const geometry = createDecalGeometry(partId, decalItem.transform);
    if (!geometry) return;

    if (!partDecalMeshesRef.current[partId]) {
      partDecalMeshesRef.current[partId] = {};
    }

    let decalMesh = partDecalMeshesRef.current[partId][decalItem.id];
    if (decalMesh) {
      decalMesh.geometry.dispose();
      decalMesh.geometry = geometry;
      const material = decalMesh.material as THREE.MeshBasicMaterial;
      material.map = texture;
      material.needsUpdate = true;
    } else {
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        depthTest: true,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -0.1,
        side: THREE.DoubleSide,
      });
      decalMesh = new THREE.Mesh(geometry, material);
      decalMesh.renderOrder = 10;
      sceneRef.current.add(decalMesh);
      partDecalMeshesRef.current[partId][decalItem.id] = decalMesh;
    }
  };

  const applyAllDecalsForPart = (partId: string) => {
    const state = partDecalsRef.current[partId];
    if (!state?.decals) return;
    
    state.decals.forEach((decal) => {
      applyDecalToPart(partId, decal);
    });
  };

  const partHasDecal = (partId: string) => Boolean(partDecalsRef.current[partId]?.decals?.length);

  const updateDecalState = (partId: string, updater: (current: PartDecalState) => PartDecalState) => {
    setPartDecals((prev) => {
      const current = prev[partId] ?? { decals: [] };
      const updated = updater(current);
      return {
        ...prev,
        [partId]: updated,
      };
    });
  };

  const addDecalToPart = (partId: string, imageUrl: string, designId?: string | null, name?: string) => {
    const decalId = `decal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const initialTransform = partSpecificTransforms[partId] || defaultDecalTransform;
    const newDecal: DecalItem = {
      id: decalId,
      image: imageUrl,
      transform: { ...initialTransform },
      designId: designId ?? null,
      name: name,
    };

    updateDecalState(partId, (current) => ({
      decals: [...(current.decals || []), newDecal],
    }));

    const loader = new THREE.TextureLoader();
    loader.load(
      imageUrl,
      (texture) => {
        texture.anisotropy = 8;
        (texture as THREE.Texture).colorSpace = THREE.SRGBColorSpace;
        texture.needsUpdate = true;

        if (!partDecalTexturesRef.current[partId]) {
          partDecalTexturesRef.current[partId] = {};
        }
        partDecalTexturesRef.current[partId][decalId] = texture;
        
        // Apply the decal after texture is loaded
        setPartDecals((prev) => {
          const current = prev[partId];
          if (!current) return prev;
          const decal = current.decals.find(d => d.id === decalId);
          if (decal) {
            // Use setTimeout to ensure state is updated
            setTimeout(() => {
              applyDecalToPart(partId, decal);
            }, 0);
          }
          return prev;
        });
      },
      undefined,
      (error) => {
        console.error('Failed to load decal texture', error);
      }
    );

    setSelectedDecalId(decalId);
  };

  const removeDecalFromPart = (partId: string, decalId: string) => {
    disposeDecal(partId, decalId);
    updateDecalState(partId, (current) => ({
      decals: (current.decals || []).filter(d => d.id !== decalId),
    }));
    if (selectedDecalId === decalId) {
      setSelectedDecalId(null);
    }
  };

  const updateDecalTransform = (partId: string, decalId: string, transformer: (transform: DecalTransform) => DecalTransform, immediate: boolean = false) => {
    updateDecalState(partId, (state) => ({
      decals: (state.decals || []).map(decal => 
        decal.id === decalId 
          ? { ...decal, transform: transformer(decal.transform) }
          : decal
      ),
    }));
    
    // Debounce the decal re-application for better performance
    if (decalUpdateTimerRef.current) {
      clearTimeout(decalUpdateTimerRef.current);
    }
    
    const applyUpdate = () => {
      setPartDecals((prev) => {
        const current = prev[partId];
        if (!current) return prev;
        const decal = current.decals.find(d => d.id === decalId);
        if (decal) {
          applyDecalToPart(partId, decal);
        }
        return prev;
      });
    };
    
    if (immediate) {
      applyUpdate();
    } else {
      decalUpdateTimerRef.current = setTimeout(applyUpdate, 16); // ~60fps
    }
  };

  const handleDecalOffsetChange = (partId: string, decalId: string, axis: 0 | 1 | 2, value: number) => {
    updateDecalTransform(partId, decalId, (transform) => {
      const nextOffset = [...transform.offset] as [number, number, number];
      nextOffset[axis] = value;
      return {
        ...transform,
        offset: nextOffset,
      };
    }, false);
  };

  const handleDecalRotationChange = (partId: string, decalId: string, axis: 0 | 1 | 2, degrees: number) => {
    updateDecalTransform(partId, decalId, (transform) => {
      const nextRotation = [...transform.rotation] as [number, number, number];
      nextRotation[axis] = degToRad(degrees);
      return {
        ...transform,
        rotation: nextRotation,
      };
    }, false);
  };

  const handleDecalScaleChange = (partId: string, decalId: string, value: number) => {
    updateDecalTransform(partId, decalId, (transform) => ({
      ...transform,
      scale: value,
    }), false);
  };

  const handlePreviewPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!activeDecalImage || !activeDecalTransform) return;
    event.preventDefault();
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    previewDragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      initialOffsetX: activeDecalTransform.offset[0],
      initialOffsetY: activeDecalTransform.offset[1],
      width: rect.width,
      height: rect.height,
    };
    target.setPointerCapture(event.pointerId);
  };

  const handlePreviewPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = previewDragRef.current;
    if (!state || state.pointerId !== event.pointerId || !selectedDecalId) return;
    const rangeX = decalPositionBounds.x[1] - decalPositionBounds.x[0];
    const rangeY = decalPositionBounds.y[1] - decalPositionBounds.y[0];
    const deltaXNormalized = (event.clientX - state.startX) / state.width;
    const deltaYNormalized = (event.clientY - state.startY) / state.height;
    const nextOffsetX = clamp(state.initialOffsetX + deltaXNormalized * rangeX, decalPositionBounds.x[0], decalPositionBounds.x[1]);
    const nextOffsetY = clamp(state.initialOffsetY - deltaYNormalized * rangeY, decalPositionBounds.y[0], decalPositionBounds.y[1]);
    handleDecalOffsetChange(selectedPart, selectedDecalId, 0, nextOffsetX);
    handleDecalOffsetChange(selectedPart, selectedDecalId, 1, nextOffsetY);
  };

  const releasePreviewPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (previewDragRef.current?.pointerId === event.pointerId) {
      previewDragRef.current = null;
    }
  };


  const applyFitAdjustment = (percentage: number) => {
    if (!modelRef.current) return;
    const scale = 1.1 * (percentage / 100);
    modelRef.current.scale.set(scale, scale, scale);
  };

  const handleColorSelection = (hex: string) => {
    setPartColors((prev) => {
      const updated = { ...prev, [selectedPart]: hex };
      applyColorToPart(selectedPart, hex);
      return updated;
    });
  };

  const createFabricTexture = (fabricId: string) => {
    const fabric = fabrics.find((f) => f.id === fabricId);
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    switch (fabric?.pattern) {
      case 'grid': {
        ctx.strokeStyle = 'rgba(0,0,0,0.05)';
        ctx.lineWidth = 2;
        const step = 32;
        for (let i = 0; i < canvas.width; i += step) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, canvas.height);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(0, i);
          ctx.lineTo(canvas.width, i);
          ctx.stroke();
        }
        break;
      }
      case 'diagonal': {
        ctx.strokeStyle = 'rgba(0,0,0,0.06)';
        ctx.lineWidth = 3;
        for (let i = -canvas.height; i < canvas.width * 2; i += 24) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i - canvas.height, canvas.height);
          ctx.stroke();
        }
        break;
      }
      case 'dots': {
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        for (let x = 12; x < canvas.width; x += 32) {
          for (let y = 12; y < canvas.height; y += 32) {
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        break;
      }
      case 'gradient':
      default: {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, 'rgba(255,255,255,0.15)');
        gradient.addColorStop(1, 'rgba(0,0,0,0.15)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        break;
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(fabric?.pattern === 'gradient' ? 1.5 : 4, fabric?.pattern === 'gradient' ? 1.5 : 4);
    texture.anisotropy = 8;
    texture.needsUpdate = true;
    return texture;
  };

  const applyFabricTexture = (fabricId: string, targetParts?: string[]) => {
    if (!Object.keys(partMeshLookupRef.current).length) return;
    if (!fabricTexturesRef.current[fabricId]) {
      const generated = createFabricTexture(fabricId);
      if (generated) {
        fabricTexturesRef.current[fabricId] = generated;
      }
    }

    const texture = fabricTexturesRef.current[fabricId];
    if (!texture) return;

    const partsToUpdate = targetParts ?? Object.keys(partMeshLookupRef.current);
    partsToUpdate.forEach((partId) => {
      if (partHasDecal(partId)) return;
      const meshes = partMeshLookupRef.current[partId];
      if (!meshes) return;
      meshes.forEach((mesh) => {
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        materials.forEach((material) => {
          const meshMaterial = material as THREE.MeshStandardMaterial;
          meshMaterial.map = texture;
          meshMaterial.roughness = fabricId === 'velvet' ? 0.7 : 0.4;
          meshMaterial.metalness = fabricId === 'cotton-silk' ? 0.3 : 0.1;
          meshMaterial.needsUpdate = true;
        });
      });
    });
  };

  const handleCustomDesignUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Use the ref to get the target part that was set when upload button was clicked
    const targetPart = uploadTargetPartRef.current || selectedPart;
    if (!targetPart) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      addDecalToPart(targetPart, dataUrl, null, file.name);
      // Clear the ref after use
      uploadTargetPartRef.current = null;
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const handleDesignLibrarySelect = (design: DesignItem) => {
    const targetPart = selectedPart;
    // Use proxy in dev, direct URL in production
    const isDev = typeof window !== 'undefined' && window.location.hostname === 'localhost';
    const baseUrl = isDev ? '' : 'http://localhost:5000';
    const imageUrl = design.url.startsWith('http') ? design.url : `${baseUrl}${design.url}`;
    addDecalToPart(targetPart, imageUrl, design.id, design.name);
  };

  const handleClearAllDecals = (partId: string) => {
    const state = partDecalsRef.current[partId];
    if (state?.decals) {
      state.decals.forEach(decal => {
        disposeDecal(partId, decal.id);
      });
    }
    updateDecalState(partId, () => ({ decals: [] }));
    setSelectedDecalId(null);
    applyFabricTexture(selectedFabric, [partId]);
  };

  const handleExportSnapshot = () => {
    const renderer = rendererRef.current;
    if (!renderer) return;

    const snapshot = renderer.domElement.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = snapshot;
    link.download = 'khudsakht-design.png';
    link.click();
  };

  const captureDesignSnapshot = (): string => {
    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    
    if (!renderer || !scene) {
      console.warn('Renderer or scene not ready for snapshot');
      // Fallback image
      return 'https://res.cloudinary.com/dmqcpclos/image/upload/c_limit,w_400,f_auto,q_auto/traditional-embroidered-suit';
    }
    
    try {
      // Capture the current canvas as PNG
      const imageData = renderer.domElement.toDataURL('image/png', 0.95);
      console.log('✅ Captured design snapshot successfully');
      return imageData;
    } catch (error) {
      console.error('Error capturing snapshot:', error);
      // Fallback image
      return 'https://res.cloudinary.com/dmqcpclos/image/upload/c_limit,w_400,f_auto,q_auto/traditional-embroidered-suit';
    }
  };

  const calculateCustomizationPrice = (): number => {
    let basePrice = 3500; // Base kurta price
    
    // Add fabric price
    const fabric = fabrics.find(f => f.id === selectedFabric);
    basePrice += fabric?.price || 0;
    
    // Add price for each design/decal applied
    const totalDecals = Object.values(partDecals).reduce((sum, part) => sum + (part.decals?.length || 0), 0);
    basePrice += totalDecals * 300; // 300 PKR per design
    
    return basePrice;
  };

  const getCustomizationSummary = (): string => {
    const fabric = fabrics.find(f => f.id === selectedFabric);
    const totalDecals = Object.values(partDecals).reduce((sum, part) => sum + (part.decals?.length || 0), 0);
    
    const parts: string[] = [];
    if (fabric) parts.push(fabric.name);
    if (totalDecals > 0) parts.push(`${totalDecals} custom design${totalDecals > 1 ? 's' : ''}`);
    
    return parts.length > 0 ? parts.join(', ') : 'Custom colors';
  };

  useEffect(() => {
    const container = viewerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#f8f4ed');
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.7, 3.2);

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      preserveDrawingBuffer: true  // Required for toDataURL to capture canvas
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1.3, 0);
    controls.enableDamping = true;
    controls.minDistance = 1.5;
    controls.maxDistance = 4;
    controlsRef.current = controls;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1);
    keyLight.position.set(3, 5, 4);
    scene.add(keyLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
    backLight.position.set(-2, 4, -3);
    scene.add(backLight);

    const platform = new THREE.Mesh(
      new THREE.CylinderGeometry(1.3, 1.3, 0.1, 64),
      new THREE.MeshStandardMaterial({ color: '#ffffff', metalness: 0.1, roughness: 0.8 })
    );
    platform.position.y = -1;
    scene.add(platform);

    const loader = new GLTFLoader();
    loader.load(
      '/ladies_qurta.glb',
      (gltf) => {
        modelRef.current = gltf.scene;
        gltf.scene.position.y = 1;
        const partLookup: Record<string, THREE.Mesh[]> = {};
        gltf.scene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            const clonedMaterials = materials.map((material) => {
              const meshMaterial = material as THREE.MeshStandardMaterial;
              return meshMaterial?.clone ? meshMaterial.clone() : meshMaterial;
            });
            mesh.material = Array.isArray(mesh.material) ? clonedMaterials : clonedMaterials[0] ?? mesh.material;
            const meshName = mesh.name?.toLowerCase() ?? '';
            garmentParts.forEach((part) => {
              if (part.matchers.some((matcher) => meshName.includes(matcher))) {
                if (!partLookup[part.id]) {
                  partLookup[part.id] = [];
                }
                partLookup[part.id].push(mesh);
              }
            });
          }
        });
        partMeshLookupRef.current = partLookup;
        scene.add(gltf.scene);

        setIsModelLoaded(true);
        garmentParts.forEach((part) => {
          const initialColor = partColorsRef.current[part.id] ?? colors[0].value;
          applyColorToPart(part.id, initialColor);
        });
        applyFabricTexture(selectedFabric);
        applyFitAdjustment(fitAdjustment[0]);
      },
      undefined,
      (error) => {
        console.error('Failed to load GLB model', error);
        setLoadError('Unable to load model. Please refresh to try again.');
      }
    );

    const handleResize = () => {
      if (!viewerRef.current) return;
      const newWidth = viewerRef.current.clientWidth;
      const newHeight = viewerRef.current.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    const animate = () => {
      controls.update();
      renderer.render(scene, camera);
      frameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      if (decalUpdateTimerRef.current) clearTimeout(decalUpdateTimerRef.current);
      controls.dispose();
      renderer.dispose();
      Object.values(fabricTexturesRef.current).forEach((texture) => texture.dispose());
      fabricTexturesRef.current = {};
      Object.keys(partDecalMeshesRef.current).forEach((partId) => {
        const meshes = partDecalMeshesRef.current[partId];
        if (meshes) {
          Object.keys(meshes).forEach((decalId) => {
            disposeDecal(partId, decalId);
          });
        }
      });
      sceneRef.current = null;
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  useEffect(() => {
    applyFitAdjustment(fitAdjustment[0]);
  }, [fitAdjustment]);

  useEffect(() => {
    if (isModelLoaded) {
      applyFabricTexture(selectedFabric);
    }
  }, [selectedFabric, isModelLoaded]);

  useEffect(() => {
    if (!isModelLoaded || !sceneRef.current) return;
    garmentParts.forEach((part) => {
      const state = partDecals[part.id];
      if (!state?.decals || state.decals.length === 0) {
        // Clean up any orphaned meshes
        const meshes = partDecalMeshesRef.current[part.id];
        if (meshes) {
          Object.keys(meshes).forEach((decalId) => {
            disposeDecal(part.id, decalId);
          });
        }
        return;
      }
      // Apply all decals for this part
      applyAllDecalsForPart(part.id);
    });
  }, [partDecals, isModelLoaded]);

  useEffect(() => {
    const element = previewContainerRef.current;
    if (!element || !activeDecalImage || !activeDecalTransform) return;

    const handleWheel = (event: WheelEvent) => {
      if (!selectedDecalId) return;
      event.preventDefault();
      const scaleDelta = -event.deltaY * 0.0015;
      const nextScale = clamp(
        activeDecalTransform.scale * (1 + scaleDelta),
        decalScaleBounds[0],
        decalScaleBounds[1]
      );
      handleDecalScaleChange(selectedPart, selectedDecalId, nextScale);
    };

    element.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      element.removeEventListener('wheel', handleWheel);
    };
  }, [activeDecalImage, activeDecalTransform, selectedPart, selectedDecalId]);

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="container mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <Badge className="mb-4 bg-primary/10 text-primary">3D Studio</Badge>
          <h1 className="text-3xl md:text-4xl mb-4">Design Your Ladies Kurta</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Preview the high-fidelity GLB model directly in your browser. Adjust fabrics, colors, and fit before
            adding to cart or exporting a snapshot for reference.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-[600px] lg:h-[calc(100vh-240px)]">
            <Card className="overflow-hidden h-full">
              <CardContent className="p-0 h-full">
                <div ref={viewerRef} className="relative h-full">
                  {!isModelLoaded && !loadError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      <Sparkles className="w-5 h-5 animate-pulse" />
                      <p>Loading ladies_qurta.glb...</p>
                    </div>
                  )}

                  {loadError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-destructive text-center px-6">
                      <p>{loadError}</p>
                      <Button variant="outline" onClick={() => window.location.reload()}>
                        Refresh Page
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="h-[600px] lg:h-[calc(100vh-240px)] overflow-y-auto pr-2">
            <div className="space-y-6 pb-10">
              <Card>
                <CardContent className="p-6 space-y-4">
                {/* Tab Buttons */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {customizationSections.map((section) => (
                    <Button
                      key={section.key}
                      onClick={() => {
                        setActiveSection(section.key);
                        // Auto-select the corresponding garment part if it's a part section
                        if (section.key !== 'fabric') {
                          const part = garmentParts.find(p => p.id === section.key);
                          if (part) {
                            setSelectedPart(part.id);
                          }
                        }
                      }}
                      variant={activeSection === section.key ? 'default' : 'outline'}
                      className="rounded-full"
                    >
                      {section.label}
                    </Button>
                  ))}
                </div>

                {/* Fabric Section */}
                {activeSection === 'fabric' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Select Fabric</h3>
                    <div className="flex flex-wrap gap-2">
                      {fabrics.map((fabric) => (
                        <Button
                          key={fabric.id}
                          variant={selectedFabric === fabric.id ? 'default' : 'outline'}
                          className="rounded-full"
                          onClick={() => setSelectedFabric(fabric.id)}
                        >
                          {fabric.name}
                        </Button>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Selected fabric adds PKR {fabrics.find((f) => f.id === selectedFabric)?.price ?? 0} to the base cost.
                    </p>
                  </div>
                )}

                {/* Gala Section */}
                {activeSection === 'gala' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Customize Gala</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-sm text-muted-foreground">Primary Color</p>
                          <span className="text-xs text-muted-foreground">
                            Editing: Gala
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {colors.map((color) => (
                            <button
                              key={color.value}
                              type="button"
                              className={`h-10 w-10 rounded-full border-2 transition-all ${
                                partColors['gala'] === color.value ? 'border-primary ring-2 ring-primary/30' : 'border-border'
                              }`}
                              style={{ backgroundColor: color.value }}
                              onClick={() => {
                                setSelectedPart('gala');
                                handleColorSelection(color.value);
                              }}
                              aria-label={color.name}
                            />
                          ))}
                          {/* Custom Color Picker */}
                          <label
                            className="h-10 w-10 rounded-full border-2 border-border hover:border-primary cursor-pointer transition-all flex items-center justify-center relative overflow-hidden"
                            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)' }}
                            title="Choose any custom color"
                          >
                            <input
                              type="color"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              value={partColors['gala']}
                              onChange={(e) => {
                                setSelectedPart('gala');
                                handleColorSelection(e.target.value);
                              }}
                            />
                            <span className="text-xs text-white font-bold pointer-events-none drop-shadow-md">🎨</span>
                          </label>
                        </div>
                      </div>

                      {/* Custom Designs for Gala */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm text-muted-foreground">Custom Designs</p>
                          <span className="text-xs text-muted-foreground">
                            {partDecals['gala']?.decals?.length || 0} {partDecals['gala']?.decals?.length === 1 ? 'patch' : 'patches'}
                          </span>
                        </div>
                        <div className="flex flex-col gap-2 sm:flex-row">
                          <Button
                            className="rounded-full"
                            variant="secondary"
                            type="button"
                            onClick={() => {
                              setSelectedPart('gala');
                              uploadTargetPartRef.current = 'gala';
                              customDesignInputRef.current?.click();
                            }}
                          >
                            Upload Design
                          </Button>
                          <Button
                            className="rounded-full"
                            variant="outline"
                            type="button"
                            disabled={(partDecals['gala']?.decals?.length || 0) === 0}
                            onClick={() => {
                              setSelectedPart('gala');
                              handleClearAllDecals('gala');
                            }}
                          >
                            Clear All
                          </Button>
                        </div>
                        <div className="mt-4">
                          <DesignPicker
                            part="gala"
                            onSelect={(design) => {
                              setSelectedPart('gala');
                              handleDesignLibrarySelect(design);
                            }}
                            selectedDesignId={null}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Front Section */}
                {activeSection === 'front' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Customize Front</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-sm text-muted-foreground">Primary Color</p>
                          <span className="text-xs text-muted-foreground">
                            Editing: Front
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {colors.map((color) => (
                            <button
                              key={color.value}
                              type="button"
                              className={`h-10 w-10 rounded-full border-2 transition-all ${
                                partColors['front'] === color.value ? 'border-primary ring-2 ring-primary/30' : 'border-border'
                              }`}
                              style={{ backgroundColor: color.value }}
                              onClick={() => {
                                setSelectedPart('front');
                                handleColorSelection(color.value);
                              }}
                              aria-label={color.name}
                            />
                          ))}
                          {/* Custom Color Picker */}
                          <label
                            className="h-10 w-10 rounded-full border-2 border-border hover:border-primary cursor-pointer transition-all flex items-center justify-center relative overflow-hidden"
                            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)' }}
                            title="Choose any custom color"
                          >
                            <input
                              type="color"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              value={partColors['front']}
                              onChange={(e) => {
                                setSelectedPart('front');
                                handleColorSelection(e.target.value);
                              }}
                            />
                            <span className="text-xs text-white font-bold pointer-events-none drop-shadow-md">🎨</span>
                          </label>
                        </div>
                      </div>
                      {/* Custom Designs for Front */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm text-muted-foreground">Custom Designs</p>
                          <span className="text-xs text-muted-foreground">
                            {partDecals['front']?.decals?.length || 0} {partDecals['front']?.decals?.length === 1 ? 'patch' : 'patches'}
                          </span>
                        </div>
                        <div className="flex flex-col gap-2 sm:flex-row">
                          <Button
                            className="rounded-full"
                            variant="secondary"
                            type="button"
                            onClick={() => {
                              setSelectedPart('front');
                              uploadTargetPartRef.current = 'front';
                              customDesignInputRef.current?.click();
                            }}
                          >
                            Upload Design
                          </Button>
                          <Button
                            className="rounded-full"
                            variant="outline"
                            type="button"
                            disabled={(partDecals['front']?.decals?.length || 0) === 0}
                            onClick={() => {
                              setSelectedPart('front');
                              handleClearAllDecals('front');
                            }}
                          >
                            Clear All
                          </Button>
                        </div>
                        <div className="mt-4">
                          <DesignPicker
                            part="front"
                            onSelect={(design) => {
                              setSelectedPart('front');
                              handleDesignLibrarySelect(design);
                            }}
                            selectedDesignId={null}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Back Section */}
                {activeSection === 'back' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Customize Back</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-sm text-muted-foreground">Primary Color</p>
                          <span className="text-xs text-muted-foreground">
                            Editing: Back
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {colors.map((color) => (
                            <button
                              key={color.value}
                              type="button"
                              className={`h-10 w-10 rounded-full border-2 transition-all ${
                                partColors['back'] === color.value ? 'border-primary ring-2 ring-primary/30' : 'border-border'
                              }`}
                              style={{ backgroundColor: color.value }}
                              onClick={() => {
                                setSelectedPart('back');
                                handleColorSelection(color.value);
                              }}
                              aria-label={color.name}
                            />
                          ))}
                          {/* Custom Color Picker */}
                          <label
                            className="h-10 w-10 rounded-full border-2 border-border hover:border-primary cursor-pointer transition-all flex items-center justify-center relative overflow-hidden"
                            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)' }}
                            title="Choose any custom color"
                          >
                            <input
                              type="color"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              value={partColors['back']}
                              onChange={(e) => {
                                setSelectedPart('back');
                                handleColorSelection(e.target.value);
                              }}
                            />
                            <span className="text-xs text-white font-bold pointer-events-none drop-shadow-md">🎨</span>
                          </label>
                        </div>
                      </div>
                      {/* Custom Designs for Back */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm text-muted-foreground">Custom Designs</p>
                          <span className="text-xs text-muted-foreground">
                            {partDecals['back']?.decals?.length || 0} {partDecals['back']?.decals?.length === 1 ? 'patch' : 'patches'}
                          </span>
                        </div>
                        <div className="flex flex-col gap-2 sm:flex-row">
                          <Button
                            className="rounded-full"
                            variant="secondary"
                            type="button"
                            onClick={() => {
                              setSelectedPart('back');
                              uploadTargetPartRef.current = 'back';
                              customDesignInputRef.current?.click();
                            }}
                          >
                            Upload Design
                          </Button>
                          <Button
                            className="rounded-full"
                            variant="outline"
                            type="button"
                            disabled={(partDecals['back']?.decals?.length || 0) === 0}
                            onClick={() => {
                              setSelectedPart('back');
                              handleClearAllDecals('back');
                            }}
                          >
                            Clear All
                          </Button>
                        </div>
                        <div className="mt-4">
                          <DesignPicker
                            part="back"
                            onSelect={(design) => {
                              setSelectedPart('back');
                              handleDesignLibrarySelect(design);
                            }}
                            selectedDesignId={null}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bazo Section */}
                {activeSection === 'bazo' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Customize Bazo/Sleeves</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-sm text-muted-foreground">Primary Color</p>
                          <span className="text-xs text-muted-foreground">
                            Editing: Bazo
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {colors.map((color) => (
                            <button
                              key={color.value}
                              type="button"
                              className={`h-10 w-10 rounded-full border-2 transition-all ${
                                partColors['bazo'] === color.value ? 'border-primary ring-2 ring-primary/30' : 'border-border'
                              }`}
                              style={{ backgroundColor: color.value }}
                              onClick={() => {
                                setSelectedPart('bazo');
                                handleColorSelection(color.value);
                              }}
                              aria-label={color.name}
                            />
                          ))}
                          {/* Custom Color Picker */}
                          <label
                            className="h-10 w-10 rounded-full border-2 border-border hover:border-primary cursor-pointer transition-all flex items-center justify-center relative overflow-hidden"
                            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)' }}
                            title="Choose any custom color"
                          >
                            <input
                              type="color"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              value={partColors['bazo']}
                              onChange={(e) => {
                                setSelectedPart('bazo');
                                handleColorSelection(e.target.value);
                              }}
                            />
                            <span className="text-xs text-white font-bold pointer-events-none drop-shadow-md">🎨</span>
                          </label>
                        </div>
                      </div>
                      {/* Custom Designs for Bazo */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm text-muted-foreground">Custom Designs</p>
                          <span className="text-xs text-muted-foreground">
                            {partDecals['bazo']?.decals?.length || 0} {partDecals['bazo']?.decals?.length === 1 ? 'patch' : 'patches'}
                          </span>
                        </div>
                        <div className="flex flex-col gap-2 sm:flex-row">
                          <Button
                            className="rounded-full"
                            variant="secondary"
                            type="button"
                            onClick={() => {
                              setSelectedPart('bazo');
                              uploadTargetPartRef.current = 'bazo';
                              customDesignInputRef.current?.click();
                            }}
                          >
                            Upload Design
                          </Button>
                          <Button
                            className="rounded-full"
                            variant="outline"
                            type="button"
                            disabled={(partDecals['bazo']?.decals?.length || 0) === 0}
                            onClick={() => {
                              setSelectedPart('bazo');
                              handleClearAllDecals('bazo');
                            }}
                          >
                            Clear All
                          </Button>
                        </div>
                        <div className="mt-4">
                          <DesignPicker
                            part="bazo"
                            onSelect={(design) => {
                              setSelectedPart('bazo');
                              handleDesignLibrarySelect(design);
                            }}
                            selectedDesignId={null}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Shalwar Section */}
                {activeSection === 'shalwar' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Customize Shalwar</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-sm text-muted-foreground">Primary Color</p>
                          <span className="text-xs text-muted-foreground">
                            Editing: Shalwar
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {colors.map((color) => (
                            <button
                              key={color.value}
                              type="button"
                              className={`h-10 w-10 rounded-full border-2 transition-all ${
                                partColors['shalwar'] === color.value ? 'border-primary ring-2 ring-primary/30' : 'border-border'
                              }`}
                              style={{ backgroundColor: color.value }}
                              onClick={() => {
                                setSelectedPart('shalwar');
                                handleColorSelection(color.value);
                              }}
                              aria-label={color.name}
                            />
                          ))}
                          {/* Custom Color Picker */}
                          <label
                            className="h-10 w-10 rounded-full border-2 border-border hover:border-primary cursor-pointer transition-all flex items-center justify-center relative overflow-hidden"
                            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)' }}
                            title="Choose any custom color"
                          >
                            <input
                              type="color"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              value={partColors['shalwar']}
                              onChange={(e) => {
                                setSelectedPart('shalwar');
                                handleColorSelection(e.target.value);
                              }}
                            />
                            <span className="text-xs text-white font-bold pointer-events-none drop-shadow-md">🎨</span>
                          </label>
                        </div>
                      </div>
                      {/* Custom Designs for Shalwar */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm text-muted-foreground">Custom Designs</p>
                          <span className="text-xs text-muted-foreground">
                            {partDecals['shalwar']?.decals?.length || 0} {partDecals['shalwar']?.decals?.length === 1 ? 'patch' : 'patches'}
                          </span>
                        </div>
                        <div className="flex flex-col gap-2 sm:flex-row">
                          <Button
                            className="rounded-full"
                            variant="secondary"
                            type="button"
                            onClick={() => {
                              setSelectedPart('shalwar');
                              uploadTargetPartRef.current = 'shalwar';
                              customDesignInputRef.current?.click();
                            }}
                          >
                            Upload Design
                          </Button>
                          <Button
                            className="rounded-full"
                            variant="outline"
                            type="button"
                            disabled={(partDecals['shalwar']?.decals?.length || 0) === 0}
                            onClick={() => {
                              setSelectedPart('shalwar');
                              handleClearAllDecals('shalwar');
                            }}
                          >
                            Clear All
                          </Button>
                        </div>
                        <div className="mt-4">
                          <DesignPicker
                            part="shalwar"
                            onSelect={(design) => {
                              setSelectedPart('shalwar');
                              handleDesignLibrarySelect(design);
                            }}
                            selectedDesignId={null}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Common: Decal Editing (shows when a decal exists for the active section) */}
                {activeSection !== 'fabric' && partDecals[activeSection]?.decals && partDecals[activeSection].decals.length > 0 && (
                  <div className="mt-4 space-y-3 border-t pt-4">
                    <p className="text-xs font-medium text-muted-foreground">Applied Patches</p>
                    <div className="space-y-2">
                      {partDecals[activeSection].decals.map((decal) => (
                        <div
                          key={decal.id}
                          className={`rounded-lg border p-3 transition-all ${
                            selectedDecalId === decal.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <img
                                src={decal.image}
                                alt={decal.name || 'Decal'}
                                className="h-10 w-10 rounded object-cover"
                              />
                              <div>
                                <p className="text-xs font-medium">{decal.name || 'Custom Design'}</p>
                                <p className="text-[10px] text-muted-foreground">Click to edit</p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => {
                                setSelectedPart(activeSection);
                                removeDecalFromPart(activeSection, decal.id);
                              }}
                            >
                              ×
                            </Button>
                          </div>
                          <Button
                            variant={selectedDecalId === decal.id ? 'default' : 'outline'}
                            size="sm"
                            className="w-full text-xs"
                            onClick={() => {
                              setSelectedPart(activeSection);
                              setSelectedDecalId(selectedDecalId === decal.id ? null : decal.id);
                            }}
                          >
                            {selectedDecalId === decal.id ? 'Done Editing' : 'Edit This Patch'}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Decal Adjustment Controls (shows when editing a selected patch) */}
                {activeDecalImage && activeDecalTransform && selectedDecalId && activeSection !== 'fabric' && activeSection === selectedPart && (
                  <div className="mt-4 space-y-4 border-t pt-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Patch Adjustment</h3>
                      <p className="text-xs text-muted-foreground mb-4">
                        Adjust position, rotation, and size of the selected patch
                      </p>
                    </div>

                  

                    {/* Position Controls */}
                    <div className="space-y-4 rounded-xl border p-4">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-3">Position (X / Y / Z)</p>
                        {([
                          { label: 'Horizontal (X)', helper: 'Left ↔ Right', axis: 0 as 0, bounds: decalPositionBounds.x },
                          { label: 'Vertical (Y)', helper: 'Up ↔ Down', axis: 1 as 1, bounds: decalPositionBounds.y },
                          { label: 'Depth (Z)', helper: 'Closer ↔ Farther', axis: 2 as 2, bounds: decalPositionBounds.z },
                        ] as const).map((control) => (
                          <div key={control.axis} className="mb-4 last:mb-0">
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                              <span>{control.label}</span>
                              <span className="font-medium">
                                {activeDecalTransform.offset[control.axis].toFixed(2)} 
                                <span className="text-[10px] ml-1">
                                  (Min: {control.bounds[0].toFixed(2)}, Max: {control.bounds[1].toFixed(2)})
                                </span>
                              </span>
                            </div>
                            <Slider
                              min={control.bounds[0]}
                              max={control.bounds[1]}
                              step={0.01}
                              value={[activeDecalTransform.offset[control.axis]]}
                              onValueChange={([value]) =>
                                handleDecalOffsetChange(
                                  selectedPart,
                                  selectedDecalId,
                                  control.axis,
                                  value ?? activeDecalTransform.offset[control.axis]
                                )
                              }
                            />
                            <p className="text-[10px] text-muted-foreground mt-1">{control.helper}</p>
                          </div>
                        ))}
                      </div>

                      {/* Rotation Controls */}
                      <div className="border-t pt-4">
                        <p className="text-xs font-medium text-muted-foreground mb-3">Rotation</p>
                        {([
                          { label: 'Tilt X', axis: 0 as 0 },
                          { label: 'Tilt Y', axis: 1 as 1 },
                          { label: 'Twist Z', axis: 2 as 2 },
                        ] as const).map((control) => (
                          <div key={control.axis} className="mb-4 last:mb-0">
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                              <span>{control.label}</span>
                              <span className="font-medium">
                                {radToDeg(activeDecalTransform.rotation[control.axis]).toFixed(0)}°
                                <span className="text-[10px] ml-1">(Min: -180°, Max: 180°)</span>
                              </span>
                            </div>
                            <Slider
                              min={-180}
                              max={180}
                              step={1}
                              value={[radToDeg(activeDecalTransform.rotation[control.axis])]}
                              onValueChange={([value]) =>
                                handleDecalRotationChange(
                                  selectedPart,
                                  selectedDecalId,
                                  control.axis,
                                  value ?? radToDeg(activeDecalTransform.rotation[control.axis])
                                )
                              }
                            />
                          </div>
                        ))}
                      </div>

                      {/* Size/Scale Control */}
                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                          <span className="font-medium">Size</span>
                          <span className="font-medium">
                            {activeDecalTransform.scale.toFixed(2)}m
                            <span className="text-[10px] ml-1">
                              (Min: {decalScaleBounds[0].toFixed(2)}m, Max: {decalScaleBounds[1].toFixed(2)}m)
                            </span>
                          </span>
                        </div>
                        <Slider
                          min={decalScaleBounds[0]}
                          max={decalScaleBounds[1]}
                          step={0.01}
                          value={[activeDecalTransform.scale]}
                          onValueChange={([value]) => handleDecalScaleChange(selectedPart, selectedDecalId, value ?? activeDecalTransform.scale)}
                        />
                        <p className="text-[10px] text-muted-foreground mt-1">Adjust the size of the patch</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Hidden file input */}
                <input
                  ref={customDesignInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCustomDesignUpload}
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-3">
                <Button
                  className="w-full bg-primary hover:bg-primary/90 rounded-full"
                  size="lg"
                  onClick={() => {
                    const designSnapshot = captureDesignSnapshot();
                    const customPrice = calculateCustomizationPrice();
                    const fabric = fabrics.find(f => f.id === selectedFabric);
                    const totalDecals = Object.values(partDecals).reduce((sum, part) => sum + (part.decals?.length || 0), 0);
                    
                    // Build detailed customization info
                    const customizationParts = [];
                    if (fabric) customizationParts.push(`Fabric: ${fabric.name}`);
                    if (totalDecals > 0) customizationParts.push(`${totalDecals} custom design${totalDecals > 1 ? 's' : ''}`);
                    
                    // Add color info for each part that has custom colors
                    Object.keys(partColors).forEach(partId => {
                      const part = garmentParts.find(p => p.id === partId);
                      if (part) {
                        customizationParts.push(`${part.label} color`);
                      }
                    });
                    
                    onAddToCart?.({
                      name: 'Custom Design - Ladies Kurta',
                      price: customPrice,
                      size: 'Custom Fit',
                      fabric: fabric?.name || 'Cotton Silk',
                      customDetails: customizationParts.join(' • '),
                      image: designSnapshot,
                      customized: true,
                    });
                    onNavigate?.('cart');
                  }}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add Custom Design to Cart
                </Button>
                <Button
                  variant="outline"
                  className="w-full rounded-full"
                  size="lg"
                  onClick={handleExportSnapshot}
                  disabled={!isModelLoaded}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Preview
                </Button>
                <Button
                  variant="ghost"
                  className="w-full rounded-full"
                  size="lg"
                  onClick={() => onNavigate?.('checkout')}
                >
                  Proceed to Checkout
                </Button>
              </CardContent>
            </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

