import { S3Client } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';

const s3Client = new S3Client({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY
  }
});

export const getPresignedUrl = async (fileName: string, fileType: string) => {
  try {
    const key = `tickets/${Date.now()}-${fileName}`;
    
    const { url, fields } = await createPresignedPost(s3Client, {
      Bucket: import.meta.env.VITE_AWS_BUCKET_NAME,
      Key: key,
      Conditions: [
        ['content-length-range', 0, 10485760], // Max file size: 10MB
        ['starts-with', '$Content-Type', fileType]
      ],
      Expires: 600 // URL expires in 10 minutes
    });

    return { url, fields, key };
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    throw error;
  }
};

export const uploadFile = async (file: File) => {
  try {
    const { url, fields, key } = await getPresignedUrl(file.name, file.type);

    const formData = new FormData();
    Object.entries(fields).forEach(([field, value]) => {
      formData.append(field, value);
    });
    formData.append('file', file);

    const response = await fetch(url, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return {
      id: key,
      name: file.name,
      url: `${url}/${key}`,
      type: file.type,
      size: file.size,
      uploadedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};