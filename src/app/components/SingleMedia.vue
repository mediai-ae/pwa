<template>
  <div class="border rounded p-4 shadow-sm">
    <!-- Media Display (skip image display in full mode) -->
    <div class="mb-2">
      <template v-if="!isExpanded">
        <img
            v-if="media.thumbnail"
            :src="media.thumbnail"
            alt="thumbnail"
            class="w-full h-40 object-cover rounded"
        />
      </template>
      <template v-else>
        <video
            v-if="media.media_type === 'video'"
            :src="media.url"
            controls
            class="w-full rounded"
        />
        <audio
            v-else-if="media.media_type === 'audio'"
            :src="media.url"
            controls
            class="w-full"
        />
        <div
            v-else-if="media.media_type === 'text'"
            class="max-h-40 overflow-auto text-sm text-gray-800 whitespace-pre-wrap break-words border p-2 rounded bg-gray-50"
        >
          {{ media.url }}
        </div>
      </template>
    </div>

    <!-- Filename -->
    <h3 class="font-semibold text-lg mb-1">{{ media.filename }}</h3>

    <!-- Nudity Score -->
    <div v-if="media.nudity.sexy || media.nudity.porn" class="text-sm text-gray-600 mb-1">
      <p v-if="media.nudity.sexy">{{ $t('labels.sexy') }}: {{ media.nudity.sexy }}%</p>
      <p v-if="media.nudity.porn">{{ $t('labels.porn') }}: {{ media.nudity.porn }}%</p>
    </div>

    <!-- Metadata -->
    <p class="text-sm text-gray-600">Type: {{ media.media_type }}</p>
    <p class="text-sm text-gray-600">RGA: {{ media.rga_category }}</p>

    <!-- Hashtags -->
    <div class="my-2">
      <span
          v-for="tag in media.hashtags"
          :key="tag"
          class="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded mr-1 text-xs"
      >
        #{{ tag }}
      </span>
    </div>

    <!-- Action Buttons -->
    <div class="mt-4 flex flex-wrap gap-2">
      <!-- Original video buttons -->
      <template v-if="media.media_type === 'video'">
        <button
            @click="handleModal('content', media.id)"
            class="btn flex items-center justify-center gap-2"
            :disabled="buttonLoading['content']"
            :class="{ 'opacity-50 cursor-not-allowed': buttonLoading['content'] }"
        >
          <Loading v-if="buttonLoading['content']" />
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
          <Loading v-if="buttonLoading['ad']" />
          <span>
            {{
              buttonLoading['ad']
                  ? t('buttons.analyzingAd')
                  : t('buttons.analyzeAd')
            }}
          </span>
        </button>

        <button
            @click="openSubtitleLanguageSelector(media.id)"
            class="btn flex items-center justify-center gap-2"
            :disabled="buttonLoading['subtitle']"
            :class="{ 'opacity-50 cursor-not-allowed': buttonLoading['subtitle'] }"
        >
          <Loading v-if="buttonLoading['subtitle']" />
          <span>
            {{
              buttonLoading['subtitle']
                  ? t('buttons.generatingSubtitle')
                  : t('buttons.generateSubtitle')
            }}
          </span>
        </button>
      </template>

      <!-- Show Full Eye Icon Button -->
      <button
          v-if="media.media_type !== 'image'"
          class="btn flex items-center justify-center"
          @click="toggleShowFull"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
             viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      </button>

      <!-- Delete Button -->
      <button
          @click="handleDelete(media.id)"
          class="btn bg-red-600 hover:bg-red-700 flex items-center gap-1"
          :disabled="buttonLoading.delete"
          :class="{ 'opacity-50 cursor-not-allowed': buttonLoading.delete }"
      >
        <Loading v-if="buttonLoading.delete" />
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
             viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m-4 0h14" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue';
import { useI18n } from 'vue-i18n';
import { type Media, useMediaStore } from '@/app/stores/media';
import Loading from '@/app/components/Loading.vue';

defineProps<{ media: Media }>();

const { t } = useI18n();
const openModal = inject('openModal') as (type: string, data: any) => void;

const store = useMediaStore();
const { analyzeContent, analyzeAd, deleteMedia } = store;

const buttonLoading = ref<{ [key: string]: boolean }>({});
const isExpanded = ref(false);

function toggleShowFull() {
  isExpanded.value = !isExpanded.value;
}

async function handleModal(type: 'content' | 'ad', id: number) {
  buttonLoading.value[type] = true;
  try {
    const response = type === 'content'
        ? await analyzeContent(id)
        : await analyzeAd(id);
    openModal?.(type, type === 'content' ? response.data : response.data.scene_data);
  } catch (error) {
    console.error(`Error loading ${type} modal:`, error);
  } finally {
    buttonLoading.value[type] = false;
  }
}

function openSubtitleLanguageSelector(mediaId: number) {
  buttonLoading.value['subtitle'] = true;
  openModal?.('subtitle', mediaId);
  buttonLoading.value['subtitle'] = false;
}

async function handleDelete(id: number) {
  if (!confirm(t('messages.confirmDelete'))) return;
  buttonLoading.value['delete'] = true;
  try {
    await deleteMedia(id);
  } catch (err) {
    console.error('Failed to delete:', err);
  } finally {
    buttonLoading.value['delete'] = false;
  }
}
</script>

<style scoped>
.btn {
  @apply px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded transition duration-200 ease-in-out;
}
</style>
