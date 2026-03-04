import * as React from 'react';

import apiClient from '@/lib/axios';
import { toast } from 'sonner';

export interface UploadedFile {
  key: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

interface UseUploadFileProps {
  onUploadComplete?: (file: UploadedFile) => void;
  onUploadError?: (error: unknown) => void;
}

export function useUploadFile({
  onUploadComplete,
  onUploadError,
}: UseUploadFileProps = {}) {
  const [uploadedFile, setUploadedFile] = React.useState<UploadedFile>();
  const [uploadingFile, setUploadingFile] = React.useState<File>();
  const [progress, setProgress] = React.useState<number>(0);
  const [isUploading, setIsUploading] = React.useState(false);

  async function uploadFile(file: File) {
    setIsUploading(true);
    setUploadingFile(file);

    try {
      const s3Key = crypto.randomUUID();
      const formData = new FormData();
      formData.append('s3Key', s3Key);
      formData.append('file', file);

      await apiClient.post('attachments/createFile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const pct = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(Math.min(pct, 100));
          }
        },
      });

      const result: UploadedFile = {
        key: s3Key,
        name: file.name,
        size: file.size,
        type: file.type,
        url: `${process.env.NEXT_PUBLIC_API_URL}attachments/getFile/${s3Key}`,
      };

      setUploadedFile(result);
      onUploadComplete?.(result);

      return result;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Something went wrong, please try again later.';
      toast.error(message);
      onUploadError?.(error);
    } finally {
      setProgress(0);
      setIsUploading(false);
      setUploadingFile(undefined);
    }
  }

  return {
    isUploading,
    progress,
    uploadedFile,
    uploadFile,
    uploadingFile,
  };
}
