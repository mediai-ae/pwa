<template>
  <div class="space-y-6">
    <!-- Modal Title -->
    <h3 class="text-2xl font-bold text-center text-gray-800 dark:text-white">
      {{ $t('titles.analysisResults') }}
    </h3>

    <!-- Analysis Table -->
    <div
      v-if="analysis && analysis.length"
      class="overflow-x-auto rounded-xl border dark:border-gray-700 shadow-sm"
    >
      <table class="min-w-full text-center border-collapse text-sm">
        <thead
          class="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white uppercase text-xs sm:text-sm"
        >
          <tr>
            <th class="p-3">{{ $t('table.frame') }}</th>
            <th class="p-3">{{ $t('table.time') }}</th>
            <th class="p-3">{{ $t('table.hashtags') }}</th>
            <th class="p-3">{{ $t('table.rga') }}</th>
            <th class="p-3">{{ $t('table.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(scene, index) in analysis"
            :key="index"
            class="transition hover:bg-gray-100 dark:hover:bg-gray-800 border-b border-gray-200 dark:border-gray-600"
          >
            <td class="p-3">
              <img
                :src="scene.frame_path"
                class="max-w-[60px] sm:max-w-[80px] mx-auto rounded shadow"
              />
            </td>
            <td class="p-3 whitespace-nowrap">{{ scene.frame_time }}</td>
            <td class="p-3">
              <div class="max-w-[120px] sm:max-w-none break-words mx-auto text-xs sm:text-sm">
                {{ scene.hashtags?.length ? scene.hashtags.join(', ') : $t('messages.noHashtags') }}
              </div>
            </td>
            <td class="p-3">
              <span
                :class="[
                  'inline-block font-semibold text-white px-2 py-1 rounded-full shadow-sm text-xs sm:text-sm',
                  {
                    'bg-red-600': scene.rga === 'R',
                    'bg-yellow-500 text-black': scene.rga === 'A',
                    'bg-green-600': scene.rga === 'G',
                  },
                ]"
              >
                {{ scene.rga }}
              </span>
            </td>
            <td class="p-3">
              <div class="flex justify-center gap-2">
                <button
                  @click="approveScene(index)"
                  class="p-1.5 bg-green-500 hover:bg-green-600 rounded-full transition"
                  aria-label="Approve"
                >
                  <CheckIcon class="h-4 w-4 text-white" />
                </button>
                <button
                  @click="rejectScene(index)"
                  class="p-1.5 bg-red-500 hover:bg-red-600 rounded-full transition"
                  aria-label="Reject"
                >
                  <XMarkIcon class="h-4 w-4 text-white" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <p v-else class="text-center text-gray-600 dark:text-gray-300 text-sm sm:text-base">
      {{ $t('messages.noAnalysisData') }}
    </p>

    <!-- Bottom Close Button -->
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
import { onMounted } from 'vue';
import { useMediaStore } from '@/app/stores/media';
import { CheckIcon, XMarkIcon } from '@heroicons/vue/24/outline';

const props = defineProps<{
  analysis: Array<any>;
}>();

const store = useMediaStore();

onMounted(async () => {
  await store.fetchMedia('video');
});

const emit = defineEmits(['close', 'approve', 'reject']);

function approveScene(index: number) {
  props.analysis[index].rga = 'G';
  emit('approve', index);
}

function rejectScene(index: number) {
  props.analysis[index].rga = 'R';
  emit('reject', index);
}
</script>
