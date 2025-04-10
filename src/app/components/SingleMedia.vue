<template>
  <div
    class="rounded-2xl border border-gray-200 dark:border-gray-700 shadow p-4 space-y-4 transition hover:shadow-md bg-white dark:bg-gray-900"
  >
    <!-- Media Display -->
    <div>
      <template v-if="!isExpanded">
        <img
          v-if="media.thumbnail"
          :src="media.thumbnail"
          alt="thumbnail"
          class="w-full h-40 object-cover rounded-xl"
        />
      </template>
      <template v-else>
        <video
          v-if="media.media_type === 'video'"
          :src="media.url"
          controls
          class="w-full rounded-xl"
        />
        <audio
          v-else-if="media.media_type === 'audio'"
          :src="media.url"
          controls
          class="w-full rounded-xl"
        />
        <div
          v-else-if="media.media_type === 'text'"
          class="max-h-40 overflow-auto text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words border border-gray-300 dark:border-gray-600 p-2 rounded-xl bg-gray-50 dark:bg-gray-800"
        >
          {{ media.url }}
        </div>
      </template>
    </div>

    <!-- Title -->
    <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
      {{ media.filename }}
    </h3>

    <!-- Scores -->
    <div
      v-if="media.nudity.sexy || media.nudity.porn"
      class="text-sm text-gray-600 dark:text-gray-400 space-y-1"
    >
      <p v-if="media.nudity.sexy">{{ $t('labels.sexy') }}: {{ media.nudity.sexy }}%</p>
      <p v-if="media.nudity.porn">{{ $t('labels.porn') }}: {{ media.nudity.porn }}%</p>
    </div>

    <!-- Metadata -->
    <div class="text-sm text-gray-600 dark:text-gray-400">
      <p>
        Type: <span class="font-medium">{{ media.media_type }}</span>
      </p>
      <p>
        RGA: <span class="font-medium">{{ media.rga_category }}</span>
      </p>
    </div>

    <!-- Hashtags -->
    <div v-if="media.hashtags.length" class="flex flex-wrap gap-1">
      <span
        v-for="tag in media.hashtags"
        :key="tag"
        class="bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-100 px-2 py-1 rounded-full text-xs"
      >
        #{{ tag }}
      </span>
    </div>

    <!-- Actions -->
    <div class="flex flex-wrap items-center gap-2 pt-2">
      <template v-if="media.media_type === 'video'">
        <button
          @click="handleModal('content', media.id)"
          class="btn"
          :disabled="buttonLoading['content']"
        >
          <Loading v-if="buttonLoading['content']" />
          <span>{{
            buttonLoading['content'] ? t('buttons.analyzingContent') : t('buttons.analyzeContent')
          }}</span>
        </button>

        <button @click="handleModal('ad', media.id)" class="btn" :disabled="buttonLoading['ad']">
          <Loading v-if="buttonLoading['ad']" />
          <span>{{ buttonLoading['ad'] ? t('buttons.analyzingAd') : t('buttons.analyzeAd') }}</span>
        </button>

        <button
          @click="openSubtitleLanguageSelector(media.id)"
          class="btn"
          :disabled="buttonLoading['subtitle']"
        >
          <Loading v-if="buttonLoading['subtitle']" />
          <span>{{
            buttonLoading['subtitle']
              ? t('buttons.generatingSubtitle')
              : t('buttons.generateSubtitle')
          }}</span>
        </button>
      </template>

      <!-- Toggle Full View -->
      <button
        v-if="media.media_type !== 'image'"
        @click="toggleShowFull"
        class="icon-btn"
        :title="isExpanded ? t('buttons.hideDetails') : t('buttons.showDetails')"
      >
        <EyeIcon class="w-5 h-5" />
      </button>

      <!-- Delete -->
      <button
        @click="handleDelete(media.id)"
        class="icon-btn text-red-600 hover:text-red-700"
        :disabled="buttonLoading.delete"
      >
        <Loading v-if="buttonLoading.delete" />
        <TrashIcon v-else class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue';
import { useI18n } from 'vue-i18n';
import { type Media, useMediaStore } from '@/app/stores/media';
import Loading from '@/app/components/Loading.vue';
import { EyeIcon, TrashIcon } from '@heroicons/vue/24/outline';

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
    const response = type === 'content' ? await analyzeContent(id) : await analyzeAd(id);
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
