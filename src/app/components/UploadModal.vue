<template>
  <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn">
    <div class="w-full max-w-lg mx-4 p-6 bg-white dark:bg-secondary-dark text-black dark:text-white rounded-2xl shadow-2xl space-y-6">

      <!-- Modal Title -->
      <h3 class="text-xl font-semibold text-center">
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
          <p v-if="file?.name" class="mt-2 text-sm text-gray-700 dark:text-gray-300">
            📁 {{ file.name }}
          </p>
        </div>

        <!-- Progress Bar -->
        <div v-if="uploading" class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
              class="bg-green-600 h-full transition-all duration-300"
              :style="{ width: progress + '%' }"
          ></div>
        </div>

        <!-- Upload Result -->
        <div v-if="result" class="border-t pt-4 mt-4 space-y-2 text-sm">
          <p><span class="font-semibold">📊 RGA Category:</span> {{ result.rga_category }}</p>
          <p>
            <span class="font-semibold">🔞 Nudity Score:</span>
            Sexy: {{ nudity.sexy }}% |
            Porn: {{ nudity.porn }}%
          </p>
          <p><span class="font-semibold">🏷️ Hashtags:</span> {{ result.hashtags || 'None' }}</p>
        </div>

        <!-- Upload Message -->
        <p v-if="message" class="text-sm text-green-600 dark:text-green-400 text-center">
          {{ message }}
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-center gap-4 pt-2">
        <button
            @click="$emit('close')"
            class="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition font-medium"
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
import {useMediaStore} from "@/app/stores/media";

defineProps<{ type: string }>();
const emit = defineEmits(['close', 'upload-finished']);

const mediaStore = useMediaStore();
const { fetchMedia } = mediaStore;

const file = ref<File | null>(null);
const result = ref<any | null>(null);
const nudity = ref<{ sexy: number; porn: number }>({ sexy: 0, porn: 0 });

const store = useUploadStore();
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

      emit('upload-finished', result.value?.media_type); // or use a more explicit prop if needed

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


function handleUploadFinished(type: string) {
  fetchMedia(type);
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
