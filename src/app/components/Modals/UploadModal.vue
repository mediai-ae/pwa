<template>
  <div class="space-y-6">
    <!-- Modal Title -->
    <h3 class="text-2xl font-bold text-center text-gray-800 dark:text-white">
      {{ $t('buttons.upload') }}
    </h3>

    <!-- File Upload Area -->
    <div
      class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-6 text-center transition hover:border-blue-500"
    >
      <label for="fileInput" class="cursor-pointer flex flex-col items-center space-y-3">
        <ArrowUpTrayIcon class="h-10 w-10 text-blue-600" />
        <span class="text-blue-700 dark:text-blue-300 font-medium">
          {{ file ? $t('buttons.chooseAnother') : $t('buttons.chooseFile') }}
        </span>
        <input id="fileInput" type="file" class="hidden" @change="onFileChange" />
      </label>
      <div
        v-if="file?.name"
        class="mt-4 text-sm text-gray-700 dark:text-gray-300 truncate flex items-center justify-center gap-2"
      >
        <DocumentIcon class="h-5 w-5 text-gray-500" />
        <span class="font-medium">{{ file.name }}</span>
      </div>
    </div>

    <!-- Progress Bar -->
    <div
      v-if="uploading"
      class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden"
    >
      <div
        class="h-full rounded-full bg-[linear-gradient(135deg,_rgba(59,130,246,1)_25%,_rgba(96,165,250,1)_25%,_rgba(96,165,250,1)_50%,_rgba(59,130,246,1)_50%,_rgba(59,130,246,1)_75%,_rgba(96,165,250,1)_75%)] bg-[length:40px_40px] animate-stripes transition-all duration-500"
        :style="{ width: progress + '%' }"
      ></div>
    </div>

    <!-- Upload Result -->
    <div
      v-if="result"
      class="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-3 text-sm sm:text-base"
    >
      <div class="flex items-center gap-2">
        <ChartBarIcon class="h-5 w-5 text-indigo-500" />
        <span class="font-semibold">{{ $t('labels.rgaCategory') }}:</span>
        <span>{{ result.rga_category }}</span>
      </div>
      <div class="flex items-center gap-2">
        <EyeDropperIcon class="h-5 w-5 text-pink-500" />
        <span class="font-semibold">{{ $t('labels.nudityScore') }}:</span>
        <span>
          {{ $t('labels.sexy') }}: {{ result.nudity.sexy }}% — {{ $t('labels.porn') }}:
          {{ result.nudity.porn }}%
        </span>
      </div>
      <div class="flex items-center gap-2">
        <TagIcon class="h-5 w-5 text-green-500" />
        <span class="font-semibold">{{ $t('labels.hashtags') }}:</span>
        <span>{{ result.hashtags || $t('messages.none') }}</span>
      </div>
    </div>

    <!-- Success Message -->
    <p v-if="message" class="text-center text-green-600 dark:text-green-400 text-sm font-medium">
      {{ message }}
    </p>

    <!-- Footer Actions -->
    <div class="flex justify-center pt-4">
      <button
        @click="$emit('close')"
        class="px-6 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition"
      >
        {{ $t('buttons.close') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useUploadStore } from '@/app/stores/upload';
import { useMediaStore } from '@/app/stores/media';
import { useRouter } from 'vue-router';

import {
  ArrowUpTrayIcon,
  DocumentIcon,
  ChartBarIcon,
  EyeDropperIcon,
  TagIcon,
} from '@heroicons/vue/24/outline';

const emit = defineEmits(['close', 'upload-finished']);
const router = useRouter();

const file = ref<File | null>(null);
const result = ref<any | null>(null);

const store = useUploadStore();
const mediaStore = useMediaStore();
const { fetchMedia } = mediaStore;
const { progress, uploading, message } = storeToRefs(store);

async function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement;
  if (target.files?.length) {
    file.value = target.files[0];
    result.value = null;

    store.reset();
    const res = await store.uploadFile(file.value);

    if (res) {
      result.value = res;
      await fetchMedia(res.media_type);
      await router.push(res.media_type + 's');

      emit('upload-finished', result.value?.media_type);
    }
  }
}
</script>
