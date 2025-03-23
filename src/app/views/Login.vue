<template>
  <div
      :dir="locale === 'ar' ? 'rtl' : 'ltr'"
      class="min-h-screen bg-gray-50 dark:bg-primary-dark text-black dark:text-white transition"
  >
    <!-- Header Controls -->
    <div class="absolute top-4 right-4 flex items-center gap-3 z-10">
      <select v-model="locale" class="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-sm">
        <option value="en">🇺🇸 English</option>
        <option value="ar">🇸🇦 العربية</option>
      </select>
      <button @click="toggleDark" class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm">
        {{ isDark ? '🌙' : '☀️' }}
      </button>
    </div>

    <!-- Centered Card -->
    <div class="flex items-center justify-center px-4 py-6 sm:py-12 min-h-screen">
      <div class="w-full sm:max-w-md bg-white dark:bg-secondary-dark shadow-xl rounded-xl p-6 sm:p-8 space-y-6">
        <img src="/logo.svg" alt="Logo" class="w-20 h-20 mx-auto" />

        <h1 class="text-2xl font-bold text-center">{{ t('login.title') }}</h1>
        <p class="text-center text-gray-500 dark:text-gray-300">
          {{ t('login.subtitle') }}
        </p>

        <!-- Google Button -->
        <button
            @click="handleGoogleLogin"
            class="w-full px-4 py-2 rounded bg-white text-black border border-gray-300 hover:shadow flex items-center justify-center gap-2 dark:bg-gray-100"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" class="w-5 h-5" />
          <span class="font-medium">{{ t('login.googleButton') }}</span>
        </button>

        <div class="text-center my-4 text-sm text-gray-400 dark:text-gray-500">
          {{ t('login.or') }}
        </div>

        <!-- Login Form -->
        <form @submit.prevent="loginWithUsername" class="space-y-4">
          <input
              type="text"
              v-model="username"
              :placeholder="t('login.usernamePlaceholder')"
              class="w-full px-4 py-2 rounded bg-white dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent"
              required
          />

          <!-- Password Input with Toggle -->
          <div class="relative">
            <input
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                :placeholder="t('login.passwordPlaceholder')"
                class="w-full px-4 py-2 pr-10 rounded bg-white dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent"
                required
            />
            <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-300 focus:outline-none"
                tabindex="-1"
            >
              <span v-if="showPassword">🙈</span>
              <span v-else>👁️</span>
            </button>
          </div>

          <button
              type="submit"
              class="w-full px-4 py-2 rounded bg-accent-soft text-white hover:bg-accent transition"
          >
            {{ t('login.loginButton') }}
          </button>
        </form>

        <p v-if="auth.error" class="text-center text-sm text-red-500">{{ auth.error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/app/stores/auth';
import { googleTokenLogin } from 'vue3-google-login';

const auth = useAuthStore();
const router = useRouter();
const { locale: i18nLocale, t } = useI18n();

const locale = computed({
  get: () => i18nLocale.value,
  set: (val) => (i18nLocale.value = val),
});

const isDark = ref(true);
const showPassword = ref(false);
const username = ref('');
const password = ref('');

// Sync dark mode with <html>
function toggleDark() {
  isDark.value = !isDark.value;
  document.documentElement.classList.toggle('dark', isDark.value);
}

// Init dark mode & user
onMounted(() => {
  document.documentElement.classList.toggle('dark', isDark.value);
  auth.loadUserFromStorage();
});

// Login with username/pass
function loginWithUsername() {
  auth.signIn(username.value, password.value);
}

// Google Login
async function handleGoogleLogin() {
  try {
    const response = await googleTokenLogin();
    console.log('✅ Google Access Token:', response.access_token);
    localStorage.setItem('access_token', response.access_token);
    router.push('/app');
  } catch (error) {
    console.error('❌ Google Login Error:', error);
  }
}
</script>
