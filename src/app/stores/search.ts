import { defineStore } from 'pinia';
import { ref } from 'vue';
import ApiService from '@/app/services/ApiService';
import {type Media} from "@/app/stores/media";

export interface ImageSearchItem extends Media{
    similarity: number;
}

export const useSearchStore = defineStore('search', () => {
    // State
    const loading = ref(false);
    const error = ref('');

    // Results from text search
    const textResults = ref<Media[]>([]);
    // Results from image search
    const imageResults = ref<ImageSearchItem[]>([]);

    /**
     * Performs a text-based search by calling GET /search with a `query` param.
     */
    const searchByText = async (query: string) => {
        loading.value = true;
        error.value = '';
        textResults.value = [];

        try {
            // Note: Using ApiService.query with { params: { query } } => GET /search?query=xyz
            const response = await ApiService.query('/search', {
                params: { query }
            });
            // The backend returns: { query, count, results: [...] }
            if (response.data.results) {
                textResults.value = response.data.results;
            } else {
                error.value = response.data.message || 'No results found';
            }
        } catch (err) {
            console.error(err);
            error.value = 'Error performing text search';
        } finally {
            loading.value = false;
        }
        return textResults.value;
    };

    /**
     * Performs an image-based search by POST /search/image with a file.
     */
    const searchByImage = async (file: File) => {
        loading.value = true;
        error.value = '';
        imageResults.value = [];

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await ApiService.post('/search/image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            // The backend returns: { query_type: "image", results: [...] }
            if (response.data.results) {
                imageResults.value = response.data.results;
            } else if (response.data.error) {
                error.value = response.data.error;
            }
        } catch (err) {
            console.error(err);
            error.value = 'Error performing image search';
        } finally {
            loading.value = false;
        }
        return imageResults.value;
    };

    return {
        // State
        loading,
        error,
        textResults,
        imageResults,

        // Actions
        searchByText,
        searchByImage
    };
});
