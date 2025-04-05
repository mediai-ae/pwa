<template>
  <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn px-2">
    <div class="relative w-full max-w-2xl bg-white dark:bg-secondary-dark text-black dark:text-white rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh] p-4 sm:p-6 space-y-6">

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
        {{ $t('titles.generateSubtitle') }}
      </h3>

      <!-- Language Selector -->
      <div class="text-sm sm:text-base">
        <label for="language" class="font-medium block mb-1">{{ $t('labels.selectLanguage') }}</label>
        <select
            id="language"
            v-model="selectedLanguage"
            aria-label="Language selector"
            class="w-full p-2 rounded-xl bg-gray-100 dark:bg-gray-800"
        >
          <option value="en">English</option>
          <option value="fa">فارسی</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
          <option value="de">Deutsch</option>
          <option value="it">Italiano</option>
        </select>
      </div>

      <!-- Confirm Button -->
      <div class="text-center">
        <button
            @click="startSubtitleGeneration"
            :disabled="generating"
            :aria-busy="generating"
            class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition disabled:opacity-50"
        >
          {{ generating ? $t('buttons.generatingSubtitle') : $t('buttons.generateSubtitle') }}
        </button>
      </div>

      <!-- Pitch -->
      <div v-if="pitchImage">
        <h4 class="font-semibold mb-2">{{ $t('labels.pitchContour') }}</h4>
        <img :src="pitchImage" alt="Pitch Contour" class="max-w-full rounded shadow" />
      </div>

      <!-- Clean Audio -->
      <div v-if="cleanAudio">
        <h4 class="font-semibold mb-2">{{ $t('labels.cleanAudio') }}</h4>
        <audio :src="cleanAudio" controls class="w-full"></audio>
      </div>

      <!-- Subtitle Links -->
      <div v-if="mergedLink && translatedLink" class="text-sm space-y-1">
        <p>
          {{ $t('labels.originalSubtitle') }}:
          <a :href="mergedLink" class="text-blue-600 hover:underline">{{ $t('labels.download') }}</a>
        </p>
        <p>
          {{ $t('labels.translatedSubtitle') }}:
          <a :href="translatedLink" class="text-blue-600 hover:underline">{{ $t('labels.download') }}</a>
        </p>
      </div>

      <!-- Final Download Button -->
      <div v-if="ready" class="text-center">
        <button
            @click="downloadFinal"
            class="mt-4 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition"
        >
          {{ $t('buttons.downloadFinalSubtitle') }}
        </button>
      </div>

      <!-- Bottom Close Button -->
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
import { ref, onUnmounted } from 'vue';
import { useMediaStore } from '@/app/stores/media';

const props = defineProps<{ mediaId: number }>();
const emit = defineEmits(['close']);

const selectedLanguage = ref('en');
const generating = ref(false);
const ready = ref(false);

const pitchImage = ref('');
const cleanAudio = ref('');
const mergedLink = ref('');
const translatedLink = ref('');

const store = useMediaStore();
let interval: ReturnType<typeof setInterval>;

const startSubtitleGeneration = async () => {
  generating.value = true;
  ready.value = false;

  try {
    const response = await store.generateSubtitle(props.mediaId, selectedLanguage.value);
    const jobId = response.data.job_id;

    interval = setInterval(async () => {
      try {
        const status = await store.getSubtitleStatus(jobId);

        if (status.pitch_image) {
          pitchImage.value = status.pitch_image;
        }
        if (status.clean_audio) {
          cleanAudio.value = status.clean_audio;
        }

        if (status['result']) {
          mergedLink.value = status['result']['merged_srt'];
          translatedLink.value = status['result']['translated_srt'];
        }

        if (status.progress >= 100) {
          generating.value = false;
          ready.value = true;
          clearInterval(interval);
        }
      } catch (err) {
        console.error('Error polling subtitle status:', err);
        generating.value = false;
        clearInterval(interval);
      }
    }, 2000);

  } catch (error) {
    console.error('Subtitle generation failed:', error);
    generating.value = false;
  }
};

const downloadFinal = () => {
  if (mergedLink.value) {
    window.location.href = mergedLink.value;
  }
};

// Cleanup interval on modal close/unmount
onUnmounted(() => {
  if (interval) clearInterval(interval);
});
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
