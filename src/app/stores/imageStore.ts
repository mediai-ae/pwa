import { defineStore } from 'pinia';
import axios from 'axios';

export const useImageStore = defineStore('imageStore', {
  state: () => ({
    images: [] as string[],
  }),
  actions: {
    async fetchImages() {
      try {
        const res = await axios.get('/api/images');
        this.images = res.data.images;
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    },
  },
});
