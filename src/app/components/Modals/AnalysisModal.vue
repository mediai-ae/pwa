<template>
  <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn px-2">
    <div class="relative w-full max-w-4xl bg-white dark:bg-secondary-dark text-black dark:text-white rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh] p-4 sm:p-6 space-y-6">

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
        {{ $t('titles.analysisResults') }}
      </h3>

      <!-- Analysis Table -->
      <div v-if="analysis && analysis.length" class="overflow-x-auto">
        <table class="min-w-full text-center border-collapse text-sm">
          <thead>
          <tr class="bg-gray-200 dark:bg-gray-700 text-xs sm:text-sm uppercase whitespace-nowrap">
            <th class="p-2">{{ $t('table.frame') }}</th>
            <th class="p-2">{{ $t('table.time') }}</th>
            <th class="p-2">{{ $t('table.hashtags') }}</th>
            <th class="p-2">{{ $t('table.rga') }}</th>
            <th class="p-2">{{ $t('table.actions') }}</th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="(scene, index) in analysis"
              :key="index"
              class="border-b border-gray-300 dark:border-gray-600 text-xs sm:text-sm"
          >
            <td class="p-2">
              <img :src="scene.frame_path" class="max-w-[60px] sm:max-w-[80px] mx-auto rounded shadow" />
            </td>
            <td class="p-2 whitespace-nowrap">{{ scene.frame_time }}</td>
            <td class="p-2">
              <div class="max-w-[120px] sm:max-w-none break-words mx-auto">
                {{ scene.hashtags?.length ? scene.hashtags.join(', ') : $t('messages.noHashtags') }}
              </div>
            </td>
            <td class="p-2">
              <span
                  :class="[
                    'text-white font-semibold px-2 py-1 rounded-full text-xs',
                    {
                      'bg-red-600': scene.rga === 'R',
                      'bg-yellow-500': scene.rga === 'A',
                      'bg-green-600': scene.rga === 'G'
                    }
                  ]"
              >
                {{ scene.rga }}
              </span>
            </td>
            <td class="p-2">
              <div class="flex justify-center flex-wrap gap-1">
                <button
                    @click="approveScene(index)"
                    class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-xl text-xs"
                >
                  {{ $t('buttons.approve') }}
                </button>
                <button
                    @click="rejectScene(index)"
                    class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-xl text-xs"
                >
                  {{ $t('buttons.reject') }}
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
import {onMounted} from "vue";
import {useMediaStore} from "@/app/stores/media";

const props = defineProps<{
  analysis: Array<any>
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
