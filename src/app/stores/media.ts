import { defineStore } from 'pinia';
import { ref } from 'vue';
import ApiService from '@/app/services/ApiService';

export interface NudityScore {
    sexy: number;
    porn: number;
}
export interface Media {
    id: number;
    media_type: string;
    filename: string;
    fingerprint: string;
    hashtags: string[];
    nudity_score: NudityScore;
    path: string;
    rga_category: string;
    thumbnail: string;
    url: string;
    user_id: number;
    created_at: string;
    updated_at: string;
}

export const useMediaStore = defineStore('media', () => {
    const mediaItems = ref<Media[]>([]);
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

    const analyzeContent = async (id: number) => {
        return ApiService.post('/analyze/video/' + id, { id });
    };

    const analyzeAd = async (id: number) => {
        return ApiService.post('/analyze/ad/' + id, { id });
    };

    const generateSubtitle = async (id: number, language = 'en') => {
        return ApiService.post('/subtitle/generate/' + id, { id, target_language: language });
    };

    const getSubtitleStatus = async (jobId: string) => {
        try {
            const response = await ApiService.query('/subtitle/status', {
                params: { job_id: jobId }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching subtitle status:', error);
            throw error;
        }
    };

    return {
        mediaItems,
        loading,
        error,
        fetchMedia,
        analyzeContent,
        analyzeAd,
        generateSubtitle,
        getSubtitleStatus,
    };
});