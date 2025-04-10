<template>
  <div class="max-w-xl mx-auto space-y-6 p-5">
    <h1 class="text-xl font-bold">{{ t('tokens.title') }}</h1>

    <form @submit.prevent="handleCreate" class="space-y-4">
      <input
          v-model="tokenName"
          type="text"
          :placeholder="t('tokens.placeholder')"
          class="w-full p-3 border rounded-lg dark:bg-secondary-dark dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent"
      />
      <button
          type="submit"
          class="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        <PlusIcon class="w-5 h-5" />
        <span>{{ t('tokens.create') }}</span>
      </button>
    </form>

    <div v-if="tokenStore.error" class="text-red-600 text-sm">
      {{ tokenStore.error }}
    </div>

    <hr class="border-gray-300 dark:border-gray-700" />

    <h2 class="text-lg font-semibold">{{ t('tokens.list') }}</h2>

    <ul v-if="tokenStore.tokens.length" class="space-y-3">
      <li
          v-for="token in tokenStore.tokens"
          :key="token.id"
          class="p-4 border rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 dark:border-gray-600 bg-white dark:bg-gray-900"
      >
        <div>
          <p class="font-medium">{{ token.name }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ token.created_at }}</p>
          <p class="text-xs text-gray-400 mt-1">
            {{ token.access_token }}
          </p>
        </div>
        <button
            @click="tokenStore.deleteToken(token.id)"
            class="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm"
        >
          <TrashIcon class="w-5 h-5" />
          <span>{{ t('tokens.delete') }}</span>
        </button>
      </li>
    </ul>
    <p v-else class="text-gray-500">{{ t('tokens.none') }}</p>

    <Modal v-if="showTokenModal" :active-modal="'custom'" :modal-data="null" @close="closeModal">
      <div class="space-y-6 text-center">
        <h2 class="text-xl font-bold">{{ t('tokens.generated') }}</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('tokens.copyInstruction') }}</p>
        <div class="relative bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-left">
          <code class="block break-words text-sm text-gray-800 dark:text-gray-100">
            {{ tokenStore.createdToken }}
          </code>
          <button
              @click="copyToken"
              class="absolute top-2 right-2 text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1"
          >
            <ClipboardIcon class="w-4 h-4" />
            <span>{{ t('buttons.copy') }}</span>
          </button>
        </div>
        <button
            @click="closeModal"
            class="px-6 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition"
        >
          {{ t('buttons.close') }}</button>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTokenStore } from '@/app/stores/token';
import Modal from '@/app/components/Modals/Modals.vue';
import { TrashIcon, ClipboardIcon, PlusIcon } from '@heroicons/vue/24/outline';

const { t } = useI18n();
const tokenStore = useTokenStore();
const tokenName = ref('');
const showTokenModal = ref(false);

const handleCreate = async () => {
  if (tokenName.value.trim()) {
    await tokenStore.createToken(tokenName.value.trim());
    tokenName.value = '';
  }
};

const closeModal = () => {
  showTokenModal.value = false;
  tokenStore.createdToken = '';
};

const copyToken = async () => {
  try {
    await navigator.clipboard.writeText(tokenStore.createdToken);
  } catch (e) {
    console.error('Failed to copy token', e);
  }
};

watch(() => tokenStore.createdToken, (val) => {
  if (val) {
    showTokenModal.value = true;
  }
});

onMounted(() => {
  tokenStore.fetchTokens();
});
</script>