<template>
  <div class="max-w-xl mx-auto space-y-6 p-5">
    <h1 class="text-xl font-bold">{{ t('tokens.title') }}</h1>

    <form @submit.prevent="handleCreate" class="space-y-4">
      <input
          v-model="tokenName"
          type="text"
          placeholder="Token name"
          class="w-full p-2 border rounded dark:bg-secondary-dark dark:border-gray-600"
      />
      <button
          type="submit"
          class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        {{ t('tokens.create') }}
      </button>
    </form>

    <div v-if="tokenStore.createdToken" class="bg-green-100 text-green-800 p-2 rounded">
      <p>{{ t('tokens.generated') }}:</p>
      <code class="break-words">{{ tokenStore.createdToken }}</code>
    </div>

    <div v-if="tokenStore.error" class="text-red-600">
      {{ tokenStore.error }}
    </div>

    <hr />

    <h2 class="text-lg font-semibold">{{ t('tokens.list') }}</h2>

    <ul v-if="tokenStore.tokens.length" class="space-y-2">
      <li
          v-for="token in tokenStore.tokens"
          :key="token.id"
          class="p-3 border rounded flex items-center justify-between dark:border-gray-600"
      >
        <div>
          <p><strong>{{ token.name }}</strong></p>
          <p class="text-sm text-gray-600 dark:text-gray-400">{{ token.created_at }}</p>
        </div>
        <button
            @click="tokenStore.deleteToken(token.id)"
            class="text-red-600 hover:text-red-800 text-sm"
        >
          {{ t('tokens.delete') }}
        </button>
      </li>
    </ul>
    <p v-else class="text-gray-500">{{ t('tokens.none') }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTokenStore } from '@/app/stores/token';

const { t } = useI18n();
const tokenStore = useTokenStore();
const tokenName = ref('');

const handleCreate = async () => {
  if (tokenName.value.trim()) {
    await tokenStore.createToken(tokenName.value.trim());
    tokenName.value = '';
  }
};

onMounted(() => {
  tokenStore.fetchTokens();
});
</script>
