import { defineStore } from 'pinia';
import { ref } from 'vue';
import ApiService from '@/app/services/ApiService';

export interface AccessToken {
  id: number;
  name: string;
  created_at: string;
}

export const useTokenStore = defineStore('token', () => {
  const tokens = ref<AccessToken[]>([]);
  const createdToken = ref<string>('');
  const loading = ref(false);
  const error = ref('');

  const fetchTokens = async () => {
    loading.value = true;
    error.value = '';
    try {
      const { data } = await ApiService.query('/tokens',{});
      tokens.value = data.tokens;
    } catch (err) {
      console.error('Error fetching tokens:', err);
      error.value = 'Failed to fetch tokens.';
    } finally {
      loading.value = false;
    }
  };

  const createToken = async (name: string) => {
    error.value = '';
    try {
      const { data } = await ApiService.post('/tokens', { name });
      createdToken.value = data.token;
      await fetchTokens();
    } catch (err) {
      console.error('Error creating token:', err);
      error.value = 'Failed to create token.';
    }
  };

  const deleteToken = async (id: number) => {
    try {
      await ApiService.delete(`/tokens/${id}`);
      tokens.value = tokens.value.filter((t) => t.id !== id);
    } catch (err) {
      console.error('Error deleting token:', err);
      error.value = 'Failed to delete token.';
    }
  };

  return {
    tokens,
    createdToken,
    loading,
    error,
    fetchTokens,
    createToken,
    deleteToken,
  };
});
