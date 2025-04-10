<template>
  <div class="space-y-6">
    <!-- Modal Title -->
    <h3 class="text-2xl font-bold text-center text-gray-800 dark:text-white">
      {{ $t('titles.recommendation') }}
    </h3>

    <!-- Form -->
    <form @submit.prevent="submitRecommendation" class="space-y-4">
      <div>
        <label for="inputFilename" class="block mb-2 font-medium text-gray-700 dark:text-gray-200">
          {{ $t('labels.selectMedia') }}
        </label>
        <select
          v-model="selectedFile"
          id="inputFilename"
          class="w-full px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option v-for="file in mediaItems" :key="file.id" :value="file.id">
            {{ file.filename }}
          </option>
        </select>
      </div>

      <button
        type="submit"
        class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition disabled:opacity-50 font-medium"
        :disabled="loading"
      >
        {{ $t('buttons.recommend') }}
      </button>

      <!-- Progress Bar -->
      <div
        v-if="progress > 0"
        class="w-full bg-gray-200 dark:bg-gray-700 rounded h-5 overflow-hidden"
      >
        <div
          class="h-full bg-[linear-gradient(135deg,_rgba(59,130,246,1)_25%,_rgba(96,165,250,1)_25%,_rgba(96,165,250,1)_50%,_rgba(59,130,246,1)_50%,_rgba(59,130,246,1)_75%,_rgba(96,165,250,1)_75%)] bg-[length:40px_40px] animate-stripes text-white text-sm text-center"
          :style="{ width: progress + '%' }"
        >
          {{ progress }}%
        </div>
      </div>
    </form>

    <!-- Results Table -->
    <div
      v-if="results.length"
      class="overflow-x-auto border rounded-xl shadow-sm dark:border-gray-700"
    >
      <table class="min-w-full text-center border-collapse text-sm">
        <thead class="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white uppercase text-xs">
          <tr>
            <th class="p-3">{{ $t('table.thumbnail') }}</th>
            <th class="p-3">{{ $t('table.filename') }}</th>
            <th class="p-3">{{ $t('table.cosineSimilarity') }}</th>
            <th class="p-3">{{ $t('table.commonHashtags') }}</th>
            <th class="p-3">{{ $t('table.totalScore') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(rec, idx) in results"
            :key="idx"
            class="transition hover:bg-gray-50 dark:hover:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
          >
            <td class="p-3">
              <img
                :src="rec.thumbnail"
                alt="Thumbnail"
                class="inline-block w-16 h-16 object-cover rounded shadow"
              />
            </td>
            <td class="p-3">{{ rec.filename }}</td>
            <td class="p-3">{{ rec.cosine_similarity }}%</td>
            <td class="p-3 break-words max-w-[160px]">{{ rec.common_hashtags.join(', ') }}</td>
            <td class="p-3 font-semibold">{{ rec.total_score }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="text-red-600 dark:text-red-400 text-center font-medium">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useMediaStore } from '@/app/stores/media';
import { useI18n } from 'vue-i18n';

defineEmits(['close']);

const store = useMediaStore();
const { t } = useI18n();

const selectedFile = ref(0);
const progress = ref(0);
const loading = ref(false);
const error = ref('');
const results = ref<Array<any>>([]);

const mediaItems = computed(() => store.mediaItems);

onMounted(async () => {
  await store.fetchMedia('image');
});

watch(
  mediaItems,
  (items) => {
    if (items.length > 0) {
      selectedFile.value = items[0].id;
    }
  },
  { immediate: true },
);

const submitRecommendation = async () => {
  progress.value = 0;
  error.value = '';
  results.value = [];
  loading.value = true;

  try {
    progress.value = 50;

    const data = await store.recommend(selectedFile.value);

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
