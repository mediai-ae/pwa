<template>
  <UploadModal
      v-if="activeModal === 'upload'"
      type="upload"
      @close="emit('close')"
      @upload-finished="handleUploadFinished"
  />
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
</template>

<script setup lang="ts">
import UploadModal from '@/app/components/Modals/UploadModal.vue';
import AnalysisModal from '@/app/components/Modals/AnalysisModal.vue';
import AdModal from "@/app/components/Modals/AdModal.vue";
import SubtitleGenerationModal from "@/app/components/Modals/SubtitleGenerationModal.vue";

defineProps<{
  activeModal: string;
  modalData: any;
}>();

const emit = defineEmits(['close']);

function handleUploadFinished() {
  emit('close');
}
</script>
