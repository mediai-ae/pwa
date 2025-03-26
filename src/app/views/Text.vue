<template>
  <div class="p-6">
    <h2 class="text-xl font-bold mb-4">Uploaded Media</h2>

    <div v-if="loading" class="text-gray-500">Loading...</div>
    <div v-if="error" class="text-red-600">{{ error }}</div>

    <div v-if="mediaItems.length" class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="item in mediaItems" :key="item.filename" class="border rounded p-4 shadow-sm">
        <img
            v-if="item.thumbnail"
            :src="`/${item.thumbnail}`"
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
      </div>
    </div>

    <div v-if="!loading && !mediaItems.length" class="text-center text-gray-500 mt-10">
      No media found.
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useMediaStore } from '@/app/stores/media';

const store = useMediaStore();
const { fetchMedia, mediaItems,  loading, error } = store;

onMounted(() => {
  fetchMedia('text');
});
</script>
