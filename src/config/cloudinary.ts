// Cloudinary configuration
export const cloudinaryConfig = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY,
  apiSecret: import.meta.env.VITE_CLOUDINARY_API_SECRET,
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
  folder: 'khudsakht',
};

// Base Cloudinary URL for images
export const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${cloudinaryConfig.cloudName}`;

// Helper function to get Cloudinary image URL
export const getCloudinaryUrl = (publicId: string, transformations?: string) => {
  const transform = transformations || 'f_auto,q_auto';
  return `${CLOUDINARY_BASE_URL}/image/upload/${transform}/${publicId}`;
};

// Upload image to Cloudinary (for screenshots)
export const uploadToCloudinary = async (base64Image: string, folder: string = 'customizations') => {
  const formData = new FormData();
  formData.append('file', base64Image);
  formData.append('upload_preset', 'khudsakht_preset'); // You'll need to create this in Cloudinary
  formData.append('folder', folder);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};
