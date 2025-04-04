<template>
  <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn px-2">
    <div class="relative w-full max-w-6xl bg-white dark:bg-secondary-dark text-black dark:text-white rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh] p-4 sm:p-6 space-y-6">

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
        {{ $t('titles.sceneAnalysis') }}
      </h3>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full text-center border-collapse text-xs sm:text-sm">
          <thead>
          <tr class="bg-gray-200 dark:bg-gray-700 text-xs sm:text-sm whitespace-nowrap">
            <th class="p-2">{{ $t('table.sceneId') }}</th>
            <th class="p-2">{{ $t('table.keyFrame') }}</th>
            <th class="p-2">{{ $t('table.saliencyMap') }}</th>
            <th class="p-2">{{ $t('table.emptySpace') }}</th>
            <th class="p-2">{{ $t('table.emotion') }}</th>
            <th class="p-2">{{ $t('table.billboards') }}</th>
            <th class="p-2">{{ $t('table.saliencyScore') }}</th>
            <th class="p-2">{{ $t('table.motionScore') }}</th>
            <th class="p-2">{{ $t('table.dominantColor') }}</th>
            <th class="p-2">{{ $t('table.complementaryColor') }}</th>
            <th class="p-2">{{ $t('table.score') }}</th>
            <th class="p-2">{{ $t('table.isBest') }}</th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="(scene, index) in sceneData"
              :key="index"
              :class="scene.is_best ? 'bg-gray-300 dark:bg-gray-800 font-semibold' : 'border-b border-gray-300 dark:border-gray-600'"
          >
            <td class="p-2">{{ scene.scene_id }}</td>
            <td class="p-2">
              <img
                  :src="scene.frame"
                  class="max-w-[80px] mx-auto rounded shadow cursor-pointer"
                  @click="openThumbnail(scene.frame, scene.is_best)"
              />
            </td>
            <td class="p-2">
              <img :src="scene.saliency" class="max-w-[80px] mx-auto rounded" />
            </td>
            <td class="p-2">{{ scene.empty_space }}</td>
            <td class="p-2">{{ scene.emotion }}</td>
            <td class="p-2">{{ scene.billboards }}</td>
            <td class="p-2">{{ scene.saliency_score }}</td>
            <td class="p-2">{{ scene.motion_score }}</td>
            <td class="p-2">
              <div class="w-6 h-6 mx-auto rounded-full" :style="{ backgroundColor: `rgb(${scene.color.join(',')})` }"></div>
            </td>
            <td class="p-2">
              <div class="w-6 h-6 mx-auto rounded-full" :style="{ backgroundColor: `rgb(${scene.complementary_color.join(',')})` }"></div>
            </td>
            <td class="p-2">{{ scene.score }}</td>
            <td class="p-2">{{ scene.is_best ? $t('labels.yes') : '—' }}</td>
          </tr>
          </tbody>
        </table>
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
  }>
}>();

defineEmits(['close']);

function openThumbnail(src: string, isBest: boolean) {
  // Replace with your own logic
  console.log('Open thumbnail:', src, 'Is best:', isBest);
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
