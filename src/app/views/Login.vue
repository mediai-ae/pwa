<template>
  <div
      :dir="locale === 'ar' ? 'rtl' : 'ltr'"
      class="min-h-screen bg-gray-50 dark:bg-primary-dark text-black dark:text-white transition"
  >
    <!-- Header Controls -->
    <div class="absolute top-4 right-4 flex items-center gap-2 z-10">
      <!-- Language Selector -->
      <div class="relative" ref="langDropdownRef">
        <button
            @click="langOpen = !langOpen"
            class="flex items-center gap-2 px-3 py-2 rounded-full border border-gray-300 dark:border-gray-600 hover:shadow transition"
        >
          <GlobeAltIcon class="w-5 h-5 text-gray-600 dark:text-gray-300" />
          <svg
              class="w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <transition name="fade">
          <div
              v-if="langOpen"
              class="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50"
          >
            <button
                @click="changeLocale('en')"
                class="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <img src="/flags/US.svg" alt="English" class="h-4 w-6 rounded-sm" />
              English
            </button>
            <button
                @click="changeLocale('ar')"
                class="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <img src="/flags/SA.svg" alt="Arabic" class="h-4 w-6 rounded-sm" />
              العربية
            </button>
          </div>
        </transition>
      </div>

      <!-- Dark Mode Toggle -->
      <button
          @click="toggleDark"
          class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
      >
        <component :is="isDark ? MoonIcon : SunIcon" class="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </button>
    </div>

    <!-- Login Card -->
    <div class="flex items-center justify-center px-4 py-6 sm:py-12 min-h-screen">
      <div
          class="w-full sm:max-w-md bg-white dark:bg-secondary-dark shadow-xl rounded-2xl p-6 sm:p-8 space-y-6"
      >
        <img
            v-if="isDark"
            src="/logo-dark.png"
            alt="Dark Logo"
            class="w-20 h20 mx-auto"
        />
        <img
            v-else
            src="/logo-light.png"
            alt="Light Logo"
            class="w-20 h-20 mx-auto"
        />
        <h1 class="text-2xl font-bold text-center">{{ t('login.title') }}</h1>
        <p class="text-center text-gray-500 dark:text-gray-300">{{ t('login.subtitle') }}</p>

        <!-- Google Login Button -->
        <button
            @click="handleGoogleLogin"
            disabled
            class="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 border border-gray-300 dark:border-gray-600 cursor-not-allowed flex items-center justify-center gap-2"
        >
          <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              class="w-5 h-5 opacity-50"
          />
          <span class="font-medium">{{ t('login.googleButton') }} (Disabled)</span>
        </button>

        <div class="text-center my-4 text-sm text-gray-400 dark:text-gray-500">
          {{ t('login.or') }}
        </div>

        <!-- Login Form -->
        <form @submit.prevent="loginWithUsername" class="space-y-4">
          <div class="relative">
            <UserIcon class="w-5 h-5 absolute top-3 left-3 text-gray-400" />
            <input
                type="text"
                v-model="username"
                :placeholder="t('login.usernamePlaceholder')"
                class="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent"
                required
            />
          </div>

          <div class="relative">
            <LockClosedIcon class="w-5 h-5 absolute top-3 left-3 text-gray-400" />
            <input
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                :placeholder="t('login.passwordPlaceholder')"
                class="w-full pl-10 pr-10 py-2 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent"
                required
            />
            <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-2.5 text-gray-500 dark:text-gray-300 focus:outline-none"
                tabindex="-1"
            >
              <component :is="showPassword ? EyeSlashIcon : EyeIcon" class="w-5 h-5" />
            </button>
          </div>

          <button
              type="submit"
              class="w-full px-4 py-2 rounded-lg bg-accent-soft text-white hover:bg-accent transition font-semibold"
          >
            {{ t('login.loginButton') }}
          </button>
        </form>

        <p v-if="auth.error" class="text-center text-sm text-red-500 mt-2">{{ auth.error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/app/stores/auth';
import { googleTokenLogin } from 'vue3-google-login';
import {
  GlobeAltIcon,
  MoonIcon,
  SunIcon,
  UserIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/vue/24/outline';

const auth = useAuthStore();
const router = useRouter();
const { locale: i18nLocale, t } = useI18n();

const locale = computed({
  get: () => i18nLocale.value,
  set: (val) => {
    i18nLocale.value = val;
    localStorage.setItem('app-locale', val);
  },
});

const isDark = ref(true);
const langOpen = ref(false);
const langDropdownRef = ref<HTMLElement | null>(null);

onMounted(() => {
  const savedLocale = localStorage.getItem('app-locale');
  if (savedLocale) locale.value = savedLocale;

  const savedTheme = localStorage.getItem('app-theme');
  isDark.value = savedTheme === 'dark';

  document.documentElement.classList.toggle('dark', isDark.value);
  auth.loadUserFromStorage();

  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

function toggleDark() {
  isDark.value = !isDark.value;
  document.documentElement.classList.toggle('dark', isDark.value);
  localStorage.setItem('app-theme', isDark.value ? 'dark' : 'light');
}

function changeLocale(lang: string) {
  locale.value = lang;
  langOpen.value = false;
}

function handleClickOutside(event: MouseEvent) {
  if (langDropdownRef.value && !langDropdownRef.value.contains(event.target as Node)) {
    langOpen.value = false;
  }
}

const showPassword = ref(false);
const username = ref('');
const password = ref('');

function loginWithUsername() {
  auth.signIn(username.value, password.value);
}

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
