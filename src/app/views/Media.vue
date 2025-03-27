<template>
  <div class="p-6">
    <h2 class="text-xl font-bold mb-4">Uploaded Media</h2>

    <div v-if="loading" class="text-gray-500">Loading...</div>
    <div v-if="error" class="text-red-600">{{ error }}</div>

    <div v-if="mediaItems.length" class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="item in mediaItems" :key="item.filename" class="border rounded p-4 shadow-sm">
        <img
            v-if="item.thumbnail"
            :src="`${item.thumbnail}`"
            alt="thumbnail"
            class="w-full h-40 object-cover rounded mb-2"
        />
        <h3 class="font-semibold">{{ item.filename }}</h3>
        <p class="text-sm text-gray-600">Type: {{ item.media_type }}</p>
        <p class="text-sm text-gray-600">RGA: {{ item.rga }}</p>
        <p class="text-sm text-gray-600">
          Hashtags:
          <span
              v-for="tag in item.hashtags"
              :key="tag"
              class="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded mr-1 text-xs"
          >
            {{ tag }}
          </span>
        </p>
        <div v-if="item.media_type === 'video'" class="mt-4 flex flex-wrap gap-2">
          <button @click="analyzeContent(item.filename)" class="btn">Analyze Content</button>
          <button @click="analyzeAd(item.filename)" class="btn">Analyze Ad</button>
          <button @click="generateSubtitle(item.filename)" class="btn">Generate Subtitle</button>
        </div>
      </div>
    </div>

    <div v-if="!loading && !mediaItems.length" class="text-center text-gray-500 mt-10">
      No media found.
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useMediaStore } from '@/app/stores/media';
import { storeToRefs } from 'pinia';

const store = useMediaStore();
const { fetchMedia, analyzeContent, analyzeAd, generateSubtitle } = store;
const { mediaItems, loading, error } = storeToRefs(store);

const route = useRoute();
const mediaType = computed(() => {
  switch (route.name) {
    case 'images': return 'image';
    case 'texts': return 'text';
    case 'audios': return 'audio';
    case 'videos': return 'video';
    default: return '';
  }
});

watch(mediaType, (type) => {
  fetchMedia(type);
}, { immediate: true });
</script>

<style scoped>
.btn {
  @apply px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded transition;
}
</style>