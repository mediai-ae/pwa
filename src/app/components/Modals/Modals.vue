<template>
  <div
      v-if="activeModal"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn px-2"
  >
    <div
        class="relative w-full max-w-lg bg-white dark:bg-secondary-dark text-black dark:text-white rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh] p-4 sm:p-6 space-y-6"
    >
      <!-- Close Button -->
      <button
          @click="$emit('close')"
          class="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:hover:text-white transition"
          aria-label="Close"
      >
        <!-- SVG icon... -->
      </button>

      <UploadModal v-if="activeModal === 'upload'" @close="emit('close')" />
      <AnalysisModal v-else-if="activeModal === 'content'" :analysis="modalData" @close="emit('close')" />
      <AdModal v-else-if="activeModal === 'ad'" :sceneData="modalData" @close="emit('close')" />
      <SubtitleGenerationModal v-else-if="activeModal === 'subtitle'" :mediaId="modalData" @close="emit('close')" />
      <RecommendModal v-else-if="activeModal === 'recommend'" @close="emit('close')" />
      <SearchModal v-else-if="activeModal === 'search'" @close="emit('close')" />

      <!-- This was missing before -->
      <div v-else-if="activeModal === 'custom'">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UploadModal from '@/app/components/Modals/UploadModal.vue';
import AnalysisModal from '@/app/components/Modals/AnalysisModal.vue';
import AdModal from '@/app/components/Modals/AdModal.vue';
import SubtitleGenerationModal from '@/app/components/Modals/SubtitleGenerationModal.vue';
import RecommendModal from '@/app/components/Modals/RecommendModal.vue';
import SearchModal from '@/app/components/Modals/SearchModal.vue';

defineProps<{
  activeModal: string;
  modalData: any;
}>();

const emit = defineEmits(['close']);
</script>