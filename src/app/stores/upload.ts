import { defineStore } from 'pinia';
import { ref } from 'vue';
import ApiService from '@/app/services/ApiService';
import { type Media } from '@/app/stores/media';

export const useUploadStore = defineStore('upload', () => {
  const progress = ref(0);
  const uploading = ref(false);
  const message = ref('');

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    uploading.value = true;
    message.value = '';
    progress.value = 0;

    try {
      const response = await ApiService.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (e) => {
          progress.value = Math.round((e.loaded * 100) / (e.total || 1));
        },
      });

      message.value = 'Upload successful!';
      return response.data['media'] as Media;
    } catch (error) {
      console.error('Upload error:', error);
      message.value = 'Upload failed!';
      return null;
    } finally {
      uploading.value = false;
    }
  };

  const reset = () => {
    progress.value = 0;
    uploading.value = false;
    message.value = '';
  };

  return {
    progress,
    uploading,
    message,
    uploadFile,
    reset,
  };
});
