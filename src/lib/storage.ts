import { env } from './env';

export const STORAGE_CONFIG = {
  bucket: env.VITE_STORAGE_BUCKET || 'vehicle-images',
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxFiles: 10,
  imageTransformations: {
    thumbnail: { width: 300, height: 300, quality: 80 },
    preview: { width: 800, height: 600, quality: 85 },
    full: { width: 1920, height: 1080, quality: 90 },
  },
} as const;

export const STORAGE_PATHS = {
  vehicles: `${STORAGE_CONFIG.bucket}/vehicles`,
  profiles: `${STORAGE_CONFIG.bucket}/profiles`,
  temp: `${STORAGE_CONFIG.bucket}/temp`,
} as const;

export function getStoragePath(category: keyof typeof STORAGE_PATHS, filename: string): string {
  return `${STORAGE_PATHS[category]}/${Date.now()}_${filename}`;
}

export function validateFile(file: File): { valid: boolean; error?: string } {
  if (!STORAGE_CONFIG.allowedMimeTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed. Please use: ${STORAGE_CONFIG.allowedMimeTypes.join(', ')}`
    };
  }
  
  if (file.size > STORAGE_CONFIG.maxFileSize) {
    return {
      valid: false,
      error: `File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds maximum allowed size of ${(STORAGE_CONFIG.maxFileSize / 1024 / 1024).toFixed(2)}MB`
    };
  }
  
  return { valid: true };
}
