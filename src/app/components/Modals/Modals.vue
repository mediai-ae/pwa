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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 sm:h-6 sm:w-6"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10 8.586l4.95-4.95a1 1 0 111.414 1.414L11.414 10l4.95 4.95a1 1 0 01-1.414 1.414L10 11.414l-4.95 4.95a1 1 0 01-1.414-1.414L8.586 10 3.636 5.05a1 1 0 011.414-1.414L10 8.586z"
            clip-rule="evenodd"
          />
        </svg>
      </button>

      <UploadModal v-if="activeModal === 'upload'" type="upload" @close="emit('close')" />
      <AnalysisModal
        v-if="activeModal === 'content'"
        type="content"
        :analysis="modalData"
        @close="emit('close')"
      />
      <AdModal
        v-if="activeModal === 'ad'"
        type="ad"
        :sceneData="modalData"
        @close="emit('close')"
      />
      <SubtitleGenerationModal
        v-if="activeModal === 'subtitle'"
        type="subtitle"
        :mediaId="modalData"
        @close="emit('close')"
      />
      <RecommendModal v-if="activeModal === 'recommend'" type="recommend" @close="emit('close')" />
      <SearchModal v-if="activeModal === 'search'" type="search" @close="emit('close')" />
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
