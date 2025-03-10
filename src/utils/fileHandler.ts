import { v4 as uuidv4 } from 'uuid';

export interface FileInfo {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: string;
}

// Temporary file handler that creates object URLs for files
// This will be replaced with actual S3 upload functionality in the future
export const handleFileUpload = async (file: File): Promise<FileInfo> => {
  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    
    resolve({
      id: uuidv4(),
      name: file.name,
      url: objectUrl,
      type: file.type,
      size: file.size,
      uploadedAt: new Date().toISOString()
    });
  });
};

// Clean up object URLs when they're no longer needed
export const revokeFileUrl = (url: string) => {
  URL.revokeObjectURL(url);
};