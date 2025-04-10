import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ApiService from '@/app/services/ApiService';
import JwtService from '@/app/services/JwtService';

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  created_at: string;
  updated_at: string;
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const error = ref('');
  const router = useRouter();

  // === SIGN IN ===
  async function signIn(username: string, password: string) {
    try {
      const { data } = await ApiService.post('/auth/signin', { username, password });

      JwtService.saveToken(data.access_token);
      ApiService.setHeader();

      user.value = data.user;
      localStorage.setItem('user', JSON.stringify(data.user));
      error.value = '';

      router.push('/app');
    } catch (err: any) {
      error.value = 'Invalid username or password.';
      console.error('SignIn Error:', err);
    }
  }

  // === SIGN UP ===
  async function signUp(username: string, email: string, password: string) {
    try {
      const { data } = await ApiService.post('/auth/signup', { username, email, password });

      JwtService.saveToken(data.access_token);
      ApiService.setHeader();

      user.value = data.user;
      localStorage.setItem('user', JSON.stringify(data.user));
      error.value = '';

      router.push('/app');
    } catch (err: any) {
      error.value = 'Signup failed. Check fields or try again.';
      console.error('SignUp Error:', err);
    }
  }

  function purgeAuth() {
    user.value = null;
    JwtService.destroyToken();
    localStorage.removeItem('user');
  }

  function signOut() {
    purgeAuth();
    router.push({name: 'sign-in'});
  }

  // === GET AUTH TOKEN ===
  function getAuthToken(): string | null {
    return JwtService.getToken();
  }

  // === LOAD USER FROM STORAGE ===
  function loadUserFromStorage() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      user.value = JSON.parse(storedUser);
      ApiService.setHeader(); // set headers again if refreshing page
    }
  }

  // === FETCH USER FROM BACKEND ===
  async function fetchCurrentUser() {
    try {
      const { data } = await ApiService.get('/auth/me');
      user.value = data.user;
    } catch (err: any) {
      console.error('Failed to fetch current user:', err);
      signOut();
    }
  }

  return {
    user,
    error,
    purgeAuth,
    signIn,
    signUp,
    signOut,
    getAuthToken,
    loadUserFromStorage,
    fetchCurrentUser,
    isAuthenticated: () => !!getAuthToken(),
  };
});
