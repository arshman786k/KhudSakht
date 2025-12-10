import { cloudinaryConfig } from '../config/cloudinary';

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
}

/**
 * Upload an image to Cloudinary
 * @param file - File to upload
 * @param folder - Subfolder within khudsakht folder (e.g., 'designs/bazo', 'custom')
 * @returns Upload result with image URL
 */
export async function uploadToCloudinary(
  file: File,
  folder: string = 'uploads'
): Promise<CloudinaryUploadResult> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', cloudinaryConfig.uploadPreset);
  formData.append('folder', `${cloudinaryConfig.folder}/${folder}`);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
}

/**
 * Get optimized Cloudinary URL with transformations
 * @param publicId - Cloudinary public ID
 * @param transformations - Transformation options
 * @returns Optimized image URL
 */
export function getCloudinaryUrl(
  publicId: string,
  transformations: {
    width?: number;
    height?: number;
    crop?: 'fill' | 'fit' | 'scale' | 'limit';
    quality?: 'auto' | number;
    format?: 'auto' | 'jpg' | 'png' | 'webp';
  } = {}
): string {
  const {
    width,
    height,
    crop = 'fill',
    quality = 'auto',
    format = 'auto',
  } = transformations;

  const transformParts: string[] = [];
  
  if (width || height) {
    const dimensions: string[] = [];
    if (width) dimensions.push(`w_${width}`);
    if (height) dimensions.push(`h_${height}`);
    dimensions.push(`c_${crop}`);
    transformParts.push(dimensions.join(','));
  }
  
  transformParts.push(`q_${quality}`);
  transformParts.push(`f_${format}`);

  const transformation = transformParts.join('/');
  
  return `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/${transformation}/${publicId}`;
}

/**
 * Get thumbnail URL for design library
 */
export function getDesignThumbnail(publicId: string): string {
  return getCloudinaryUrl(publicId, {
    width: 200,
    height: 200,
    crop: 'fill',
    quality: 'auto',
    format: 'auto',
  });
}

/**
 * Get full-size optimized URL for product images
 */
export function getProductImage(publicId: string): string {
  return getCloudinaryUrl(publicId, {
    width: 800,
    crop: 'limit',
    quality: 'auto',
    format: 'auto',
  });
}
