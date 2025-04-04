<template>
  <div class="p-6">
    <h2 class="text-xl font-bold mb-4">{{ t('header.title') }}</h2>

    <div v-if="loading" class="text-gray-500">Loading...</div>
    <div v-if="error" class="text-red-600">{{ error }}</div>

    <div v-if="mediaItems.length" class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
          v-for="media in mediaItems"
          :key="media.id"
      >
        <SingleMedia :media="media" />
      </div>
    </div>

    <div
        v-if="!loading && !mediaItems.length"
        class="text-center text-gray-500 mt-10"
    >
      No media found.
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useMediaStore } from '@/app/stores/media';
import { storeToRefs } from 'pinia';
import SingleMedia from '@/app/components/SingleMedia.vue';

const { t } = useI18n();

const store = useMediaStore();
const { fetchMedia } = store;
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
