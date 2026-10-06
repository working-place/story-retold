import imageCompression from 'browser-image-compression';

export const COMPRESSION_TARGET_MB = 1;

export const COMPRESSION_MAX_DIMENSION = 1920;

export async function compressImage(file: File): Promise<File> {
  try {
    return await imageCompression(file, {
      maxSizeMB: COMPRESSION_TARGET_MB,
      maxWidthOrHeight: COMPRESSION_MAX_DIMENSION,
      useWebWorker: true,
      initialQuality: 0.8,
    });
  } catch {
    return file;
  }
}
