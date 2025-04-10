<template>
  <div class="space-y-8">
    <!-- Modal Title -->
    <h3 class="text-2xl font-bold text-center text-gray-800 dark:text-white">
      {{ $t('titles.generateSubtitle') }}
    </h3>

    <!-- Language Selector -->
    <div class="space-y-2 text-sm sm:text-base">
      <label for="language" class="block font-medium text-gray-700 dark:text-gray-200">
        {{ $t('labels.selectLanguage') }}
      </label>
      <select
        id="language"
        v-model="selectedLanguage"
        class="w-full px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition disabled:opacity-50"
      >
        {{ generating ? $t('buttons.generatingSubtitle') : $t('buttons.generateSubtitle') }}
      </button>
    </div>

    <!-- Pitch Contour -->
    <div v-if="pitchImage" class="space-y-2">
      <h4 class="font-semibold text-gray-800 dark:text-white">
        {{ $t('labels.pitchContour') }}
      </h4>
      <img
        :src="pitchImage"
        alt="Pitch Contour"
        class="w-full max-w-lg mx-auto rounded shadow-md"
      />
    </div>

    <!-- Clean Audio -->
    <div v-if="cleanAudio" class="space-y-2">
      <h4 class="font-semibold text-gray-800 dark:text-white">
        {{ $t('labels.cleanAudio') }}
      </h4>
      <audio :src="cleanAudio" controls class="w-full max-w-lg mx-auto block rounded-md" />
    </div>

    <!-- Subtitle Links -->
    <div
      v-if="mergedLink && translatedLink"
      class="text-sm space-y-1 text-gray-700 dark:text-gray-300"
    >
      <p>
        {{ $t('labels.originalSubtitle') }}:
        <a :href="mergedLink" class="text-blue-600 hover:underline font-medium">
          {{ $t('labels.download') }}
        </a>
      </p>
      <p>
        {{ $t('labels.translatedSubtitle') }}:
        <a :href="translatedLink" class="text-blue-600 hover:underline font-medium">
          {{ $t('labels.download') }}
        </a>
      </p>
    </div>

    <!-- Final Download Button -->
    <div v-if="ready" class="text-center">
      <button
        @click="downloadFinal"
        class="mt-4 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition"
      >
        {{ $t('buttons.downloadFinalSubtitle') }}
      </button>
    </div>

    <!-- Bottom Close Button -->
    <div class="flex justify-center pt-4">
      <button
        @click="$emit('close')"
        class="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition"
      >
        {{ $t('buttons.close') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import { useMediaStore } from '@/app/stores/media';

const props = defineProps<{ mediaId: number }>();
defineEmits(['close']);

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
