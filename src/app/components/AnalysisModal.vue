<template>
  <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn">
    <div class="w-full max-w-4xl mx-4 p-6 bg-white dark:bg-secondary-dark text-black dark:text-white rounded-2xl shadow-2xl space-y-6 overflow-y-auto max-h-[90vh]">

      <!-- Modal Title -->
      <h3 class="text-xl font-semibold text-center">
        {{ $t('titles.analysisResults') }}
      </h3>

      <!-- Analysis Table -->
      <div v-if="analysis && analysis.length">
        <table class="w-full text-center border-collapse">
          <thead>
          <tr class="bg-gray-200 dark:bg-gray-700 text-sm">
            <th class="p-2">فریم</th>
            <th class="p-2">زمان (ثانیه)</th>
            <th class="p-2">هشتگ‌ها</th>
            <th class="p-2">RGA</th>
            <th class="p-2">عملیات</th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="(scene, index) in analysis"
              :key="index"
              class="border-b border-gray-300 dark:border-gray-600 text-sm"
          >
            <td class="p-2">
              <img :src="scene.frame_path" class="max-w-[80px] mx-auto rounded shadow" />
            </td>
            <td class="p-2">{{ scene.frame_time }}</td>
            <td class="p-2">
              {{ scene.hashtags?.length ? scene.hashtags.join(', ') : '----' }}
            </td>
            <td class="p-2">
          <span
              :class="[
              'rga-tag text-white font-semibold px-3 py-1 rounded-full text-xs',
              {
                'bg-red-600': scene.rga === 'High',
                'bg-yellow-500': scene.rga === 'Medium',
                'bg-green-600': scene.rga === 'Low'
              }
            ]"
          >
            {{ scene.rga }}
          </span>
            </td>
            <td class="p-2">
              <button
                  @click="$emit('approve', index)"
                  class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-xl mr-2 text-xs"
              >
                تایید
              </button>
              <button
                  @click="$emit('reject', index)"
                  class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-xl text-xs"
              >
                رد
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <p v-else class="text-center text-gray-600 dark:text-gray-300">
        {{ $t('messages.noAnalysisData') }}
      </p>

      <!-- Action Buttons -->
      <div class="flex justify-center gap-4 pt-2">
        <button
            @click="$emit('close')"
            class="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition font-medium"
        >
          {{ $t('buttons.close') }}
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">

defineProps<{
  analysis: Array<any>
}>();

defineEmits(['close', 'approve', 'reject']);

function onApprove(index: number) {
  // Emit to parent if needed
  console.log('Approved frame', index);
}

function onReject(index: number) {
  // Emit to parent if needed
  console.log('Rejected frame', index);
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
