<template>
  <div class="border rounded p-4 shadow-sm">
    <img
        v-if="media.thumbnail"
        :src="`${media.thumbnail}`"
        alt="thumbnail"
        class="w-full h-40 object-cover rounded mb-2"
    />
    <h3 class="font-semibold">{{ media.filename }}</h3>
    <p class="text-sm text-gray-600">Type: {{ media.media_type }}</p>
    <p class="text-sm text-gray-600">RGA: {{ media.rga_category }}</p>
    <p class="text-sm text-gray-600">
      Hashtags:
      <span
          v-for="tag in media.hashtags"
          :key="tag"
          class="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded mr-1 text-xs"
      >
              #{{ tag }}
      </span>
    </p>

    <div
        v-if="media.media_type === 'video'"
        class="mt-4 flex flex-wrap gap-2"
    >
      <button
          @click="handleModal('content', media.id)"
          class="btn flex items-center justify-center gap-2"
          :disabled="buttonLoading['content']"
          :class="{ 'opacity-50 cursor-not-allowed': buttonLoading['content'] }"
      >
        <Loading v-if="buttonLoading['content']"></Loading>
        <span>
                {{
            buttonLoading['content']
                ? t('buttons.analyzingContent')
                : t('buttons.analyzeContent')
          }}
              </span>
      </button>

      <button
          @click="handleModal('ad', media.id)"
          class="btn flex items-center justify-center gap-2"
          :disabled="buttonLoading['ad']"
          :class="{ 'opacity-50 cursor-not-allowed': buttonLoading['ad'] }"
      >
        <Loading v-if="buttonLoading['ad']"></Loading>
        <span>
                {{
            buttonLoading['ad']
                ? t('buttons.analyzingAd')
                : t('buttons.analyzeAd')
          }}
              </span>
      </button>

      <button
          @click="handleModal('subtitle', media.id)"
          class="btn flex items-center justify-center gap-2"
          :disabled="buttonLoading['subtitle']"
          :class="{ 'opacity-50 cursor-not-allowed': buttonLoading['subtitle'] }"
      >
        <Loading v-if="buttonLoading['subtitle']"></Loading>
        <span>
                {{
            buttonLoading['subtitle']
                ? t('buttons.generatingSubtitle')
                : t('buttons.generateSubtitle')
          }}
              </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  media: Media
}>();


import { ref, inject } from 'vue';
import { useI18n } from 'vue-i18n';
import {type Media, useMediaStore} from '@/app/stores/media';
import Loading from '@/app/components/Loading.vue';

const { t } = useI18n();

const openModal = inject('openModal') as (type: string, data: any) => void;

const store = useMediaStore();
const { analyzeContent, analyzeAd, generateSubtitle } = store;

const buttonLoading = ref<{ [key: string]: boolean }>({});

async function handleModal(type: 'content' | 'ad' | 'subtitle', id: number) {
  buttonLoading.value[type] = true;

  try {
    let response;
    if (type === 'content') {
      response = await analyzeContent(id);
      openModal?.('content', response.data);
    } else if (type === 'ad') {
      response = await analyzeAd(id);
      openModal?.('ad', response.data.scene_data);
    } else if (type === 'subtitle') {
      response = await generateSubtitle(id);
      openModal?.('subtitle', {
        jobId: response.data.job_id,
        srtFile: response.data.srt_file,
        language: response.data.detected_language,
        pitchImage: response.data.pitch_image,
        audioChunks: response.data.audio_chunks
      });
    }
  } catch (error) {
    console.error(`Error loading ${type} modal:`, error);
  } finally {
    buttonLoading.value[type] = false;
  }
}

</script>

<style scoped>
.btn {
  @apply px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded transition duration-200 ease-in-out;
}
</style>

