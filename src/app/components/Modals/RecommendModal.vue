<template>
  <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn px-2">
    <div class="relative w-full max-w-2xl bg-white dark:bg-secondary-dark text-black dark:text-white rounded-2xl shadow-2xl max-h-[90vh] p-6 overflow-y-auto space-y-6">

      <!-- Close Button -->
      <button
          @click="$emit('close')"
          class="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:hover:text-white transition"
          aria-label="Close"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 8.586l4.95-4.95a1 1 0 111.414 1.414L11.414 10l4.95 4.95a1 1 0 01-1.414 1.414L10 11.414l-4.95 4.95a1 1 0 01-1.414-1.414L8.586 10 3.636 5.05a1 1 0 011.414-1.414L10 8.586z" clip-rule="evenodd"/>
        </svg>
      </button>

      <!-- Modal Title -->
      <h3 class="text-lg sm:text-2xl font-semibold text-center">
        {{ $t('titles.recommendation') }}
      </h3>

      <!-- Form -->
      <form @submit.prevent="submitRecommendation" class="space-y-4">
        <div>
          <label for="inputFilename" class="block mb-1 font-medium">
            {{ $t('labels.selectMedia') }}
          </label>
          <select v-model="selectedFile" id="inputFilename" class="w-full p-2 rounded-xl bg-gray-100 dark:bg-gray-800">
            <option v-for="file in mediaItems" :key="file.id" :value="file.filename">
              {{ file.filename }}
            </option>
          </select>
        </div>

        <input type="hidden" v-model="mediaType" />

        <button
            type="submit"
            class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition disabled:opacity-50"
            :disabled="loading"
        >
          {{ $t('buttons.recommend') }}
        </button>

        <!-- Progress Bar -->
        <div v-if="progress > 0" class="w-full bg-gray-200 rounded h-5 overflow-hidden">
          <div
              class="h-full bg-blue-600 text-white text-sm text-center transition-all duration-500"
              :style="{ width: progress + '%' }"
          >
            {{ progress }}%
          </div>
        </div>
      </form>

      <!-- Results Table -->
      <div v-if="results.length" class="overflow-x-auto">
        <table class="min-w-full text-center border border-gray-300 dark:border-gray-600 text-sm">
          <thead class="bg-gray-100 dark:bg-gray-700 text-xs uppercase">
          <tr>
            <th class="p-2">{{ $t('table.filename') }}</th>
            <th class="p-2">{{ $t('table.cosineSimilarity') }}</th>
            <th class="p-2">{{ $t('table.commonHashtags') }}</th>
            <th class="p-2">{{ $t('table.totalScore') }}</th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="(rec, idx) in results"
              :key="idx"
              class="border-t border-gray-200 dark:border-gray-700"
          >
            <td class="p-2">{{ rec.filename }}</td>
            <td class="p-2">{{ rec.cosine_similarity }}%</td>
            <td class="p-2">{{ rec.common_hashtags.join(', ') }}</td>
            <td class="p-2">{{ rec.total_score }}</td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="text-red-600 text-center">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useMediaStore } from '@/app/stores/media';
import { useI18n } from 'vue-i18n';

const emit = defineEmits(['close']);

const store = useMediaStore();
const { t } = useI18n();

const selectedFile = ref('');
const mediaType = ref('image');
const progress = ref(0);
const loading = ref(false);
const error = ref('');
const results = ref<Array<any>>([]);

const mediaItems = ref(store.mediaItems);

onMounted(async () => {
  if (!mediaItems.value.length) {
    await store.fetchMedia(mediaType.value);
    mediaItems.value = store.mediaItems;
  }

  if (mediaItems.value.length > 0) {
    selectedFile.value = mediaItems.value[0].filename;
  }
});

const submitRecommendation = async () => {
  progress.value = 0;
  error.value = '';
  results.value = [];
  loading.value = true;

  const formData = new FormData();
  formData.append('inputFilename', selectedFile.value);
  formData.append('media_type', mediaType.value);

  try {
    progress.value = 50;

    const res = await fetch('/recommend', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();

    progress.value = 100;

    if (data.error) {
      error.value = t('messages.recommendationError');
    } else {
      results.value = data;
    }

    setTimeout(() => {
      progress.value = 0;
      loading.value = false;
    }, 3000);
  } catch (err) {
    error.value = t('messages.recommendationError');
    loading.value = false;
  }
};
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
</style>
