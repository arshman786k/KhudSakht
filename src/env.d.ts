/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  readonly VITE_CLOUDINARY_CLOUD_NAME: string;
  readonly VITE_CLOUDINARY_API_KEY: string;
  readonly VITE_CLOUDINARY_API_SECRET: string;
  readonly VITE_CLOUDINARY_UPLOAD_PRESET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module 'three/examples/jsm/loaders/GLTFLoader.js' {
  import { Loader, LoadingManager } from 'three';
  export class GLTFLoader extends Loader<any> {
    constructor(manager?: LoadingManager);
  }
}

declare module 'three/examples/jsm/controls/OrbitControls.js' {
  import { Camera, EventDispatcher, Vector3 } from 'three';
  export class OrbitControls extends EventDispatcher {
    constructor(object: Camera, domElement?: HTMLElement);
    dispose(): void;
    update(): void;
    enableDamping: boolean;
    minDistance: number;
    maxDistance: number;
    target: Vector3;
  }
}

declare module 'three/examples/jsm/geometries/DecalGeometry.js' {
  import { BufferGeometry, Euler, Mesh, Vector3 } from 'three';
  export class DecalGeometry extends BufferGeometry {
    constructor(mesh: Mesh, position: Vector3, orientation: Euler, size: Vector3);
  }
}

