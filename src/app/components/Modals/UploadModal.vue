<template>
  <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn px-2">
    <div class="relative w-full max-w-lg bg-white dark:bg-secondary-dark text-black dark:text-white rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh] p-4 sm:p-6 space-y-6">

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
        {{ $t('buttons.upload') }}
      </h3>

      <!-- Upload Section -->
      <div v-if="type === 'upload'" class="space-y-4">

        <!-- File Input -->
        <div class="text-center">
          <label
              for="fileInput"
              class="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition cursor-pointer"
          >
            {{ file ? $t('buttons.chooseAnother') : $t('buttons.chooseFile') }}
          </label>
          <input
              id="fileInput"
              type="file"
              class="hidden"
              @change="onFileChange"
          />
          <p v-if="file?.name" class="mt-2 text-sm text-gray-700 dark:text-gray-300 truncate">
            📁 {{ file.name }}
          </p>
        </div>

        <!-- Progress Bar -->
        <div v-if="uploading" class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
              class="bg-green-600 h-full transition-all duration-500"
              :style="{ width: progress + '%' }"
          ></div>
        </div>

        <!-- Upload Result -->
        <div v-if="result" class="border-t pt-4 mt-4 space-y-2 text-sm text-left sm:text-base">
          <p>
            <span class="font-semibold">📊 {{ $t('labels.rgaCategory') }}:</span>
            {{ result.rga_category }}
          </p>
          <p>
            <span class="font-semibold">🔞 {{ $t('labels.nudityScore') }}:</span>
            {{ $t('labels.sexy') }}: {{ nudity.sexy }}% |
            {{ $t('labels.porn') }}: {{ nudity.porn }}%
          </p>
          <p>
            <span class="font-semibold">🏷️ {{ $t('labels.hashtags') }}:</span>
            {{ result.hashtags || $t('messages.none') }}
          </p>
        </div>

        <!-- Upload Message -->
        <p v-if="message" class="text-sm text-green-600 dark:text-green-400 text-center">
          {{ message }}
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-center pt-2">
        <button
            @click="$emit('close')"
            class="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition text-sm sm:text-base font-medium"
        >
          {{ $t('buttons.close') }}
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useUploadStore } from '@/app/stores/upload';
import { useMediaStore } from "@/app/stores/media";

defineProps<{ type: string }>();
const emit = defineEmits(['close', 'upload-finished']);

const file = ref<File | null>(null);
const result = ref<any | null>(null);
const nudity = ref<{ sexy: number; porn: number }>({ sexy: 0, porn: 0 });

const store = useUploadStore();
const mediaStore = useMediaStore();
const { fetchMedia } = mediaStore;
const { progress, uploading, message } = storeToRefs(store);

async function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement;
  if (target.files?.length) {
    file.value = target.files[0];
    result.value = null;
    nudity.value = { sexy: 0, porn: 0 };

    store.reset();
    const res = await store.uploadFile(file.value);

    if (res) {
      result.value = res;
      emit('upload-finished', result.value?.media_type);

      try {
        const parsed = JSON.parse(res.nudity_score.replace(/'/g, '"'));
        nudity.value = {
          sexy: Math.round(parsed.sexy * 100),
          porn: Math.round(parsed.porn * 100),
        };
      } catch (err) {
        console.error('Failed to parse nudity_score:', res.nudity_score);
      }
    }
  }
}
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
