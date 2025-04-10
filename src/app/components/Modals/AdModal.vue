<template>
  <div class="space-y-6">
    <!-- Modal Title -->
    <h3 class="text-2xl font-bold text-center text-gray-800 dark:text-white">
      {{ $t('titles.sceneAnalysis') }}
    </h3>

    <!-- Table -->
    <div class="overflow-x-auto border rounded-xl shadow-sm dark:border-gray-700">
      <table class="min-w-full border-collapse text-xs sm:text-sm text-center">
        <thead
          class="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-100 sticky top-0 z-10"
        >
          <tr>
            <th class="p-3 whitespace-nowrap">{{ $t('table.sceneId') }}</th>
            <th class="p-3">{{ $t('table.keyFrame') }}</th>
            <th class="p-3">{{ $t('table.saliencyMap') }}</th>
            <th class="p-3">{{ $t('table.emptySpace') }}</th>
            <th class="p-3">{{ $t('table.emotion') }}</th>
            <th class="p-3">{{ $t('table.billboards') }}</th>
            <th class="p-3">{{ $t('table.saliencyScore') }}</th>
            <th class="p-3">{{ $t('table.motionScore') }}</th>
            <th class="p-3">{{ $t('table.dominantColor') }}</th>
            <th class="p-3">{{ $t('table.complementaryColor') }}</th>
            <th class="p-3">{{ $t('table.score') }}</th>
            <th class="p-3">{{ $t('table.isBest') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(scene, index) in sceneData"
            :key="index"
            :class="[
              'transition hover:bg-gray-100 dark:hover:bg-gray-800',
              scene.is_best
                ? 'bg-yellow-100/70 dark:bg-yellow-900/20 font-semibold'
                : 'border-b border-gray-200 dark:border-gray-600',
            ]"
          >
            <td class="p-3">{{ scene.scene_id }}</td>
            <td class="p-3">
              <img
                :src="scene.frame"
                class="max-w-[80px] mx-auto rounded shadow cursor-pointer hover:scale-105 transition"
                @click="openThumbnail(scene.frame, scene.is_best)"
              />
            </td>
            <td class="p-3">
              <img :src="scene.saliency" class="max-w-[80px] mx-auto rounded shadow" />
            </td>
            <td class="p-3">{{ scene.empty_space }}</td>
            <td class="p-3">{{ scene.emotion }}</td>
            <td class="p-3">{{ scene.billboards }}</td>
            <td class="p-3">{{ scene.saliency_score }}</td>
            <td class="p-3">{{ scene.motion_score }}</td>
            <td class="p-3">
              <div
                class="w-6 h-6 mx-auto rounded-full border border-gray-300 dark:border-gray-500"
                :style="{ backgroundColor: `rgb(${scene.color.join(',')})` }"
              ></div>
            </td>
            <td class="p-3">
              <div
                class="w-6 h-6 mx-auto rounded-full border border-gray-300 dark:border-gray-500"
                :style="{ backgroundColor: `rgb(${scene.complementary_color.join(',')})` }"
              ></div>
            </td>
            <td class="p-3">{{ scene.score }}</td>
            <td class="p-3">
              <template v-if="scene.is_best">
                <StarIcon class="h-5 w-5 text-yellow-500 inline-block" />
                <span class="sr-only">{{ $t('labels.yes') }}</span>
              </template>
              <template v-else>—</template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

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
import { StarIcon } from '@heroicons/vue/24/outline';

defineProps<{
  sceneData: Array<{
    scene_id: string;
    frame: string;
    saliency: string;
    empty_space: string;
    emotion: string;
    billboards: string;
    saliency_score: number;
    motion_score: number;
    color: [number, number, number];
    complementary_color: [number, number, number];
    score: number;
    is_best: boolean;
  }>;
}>();

defineEmits(['close']);

function openThumbnail(src: string, isBest: boolean) {
  // Replace with your own logic
  console.log('Open thumbnail:', src, 'Is best:', isBest);
}
</script>
