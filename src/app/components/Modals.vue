<template>
  <UploadModal
      v-if="activeModal === 'upload'"
      type="upload"
      @close="emit('close')"
      @upload-finished="handleUploadFinished"
  />
<!--  <AnalysisModal-->
<!--      v-if="activeModal === 'content'"-->
<!--      type="content"-->
<!--      :data="modalData"-->
<!--      @close="emit('close')"-->
<!--  />-->
</template>

<script setup lang="ts">
import UploadModal from '@/app/components/UploadModal.vue';
import AnalysisModal from '@/app/components/AnalysisModal.vue';

defineProps<{
  activeModal: string;
  modalData: any;
}>();

const emit = defineEmits(['close']);

function handleUploadFinished() {
  emit('close');
}
</script>
