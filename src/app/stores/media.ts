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
            error.value = 'error in get files';
            console.error(err);
        } finally {
            loading.value = false;
        }
    };

    return {
        mediaItems,
        loading,
        error,
        fetchMedia,
    };
});
