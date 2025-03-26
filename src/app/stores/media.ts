import { defineStore } from 'pinia';
import { ref } from 'vue';
import ApiService from '@/app/services/ApiService';

export const useMediaStore = defineStore('media', () => {
    const mediaItems = ref([]);
    const loading = ref(false);
    const error = ref('');

    const fetchMedia = async (mediaType: string = '') => {
        loading.value = true;
        error.value = '';
        try {
            const response = await ApiService.query('/media', {
                params: mediaType ? { media_type: mediaType } : {},
            });
            mediaItems.value = response.data;
        } catch (err) {
            error.value = 'Error fetching media files';
            console.error(err);
        } finally {
            loading.value = false;
        }
    };

    const analyzeContent = async (filename: string) => {
        return ApiService.post('/analyze/content', { filename });
    };

    const analyzeAd = async (filename: string) => {
        return ApiService.post('/analyze/ad', { filename });
    };

    const generateSubtitle = async (filename: string, language = 'en') => {
        return ApiService.post('/subtitle/generate-full', { filename, target_language: language });
    };

    return {
        mediaItems,
        loading,
        error,
        fetchMedia,
        analyzeContent,
        analyzeAd,
        generateSubtitle,
    };
});