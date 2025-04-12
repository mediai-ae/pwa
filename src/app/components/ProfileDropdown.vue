<template>
  <div class="relative" :dir="isRTL ? 'rtl' : 'ltr'" ref="dropdownRef">
    <button
        @click="menuOpen = !menuOpen"
        class="flex items-center gap-2 px-2 py-1 rounded-full border border-gray-300 dark:border-gray-700 hover:shadow transition"
    >
      <img src="/profile.png" alt="Profile" class="w-8 h-8 rounded-full object-cover" />
      <svg
          class="w-4 h-4 text-gray-600 dark:text-gray-300"
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
          v-if="menuOpen"
          class="absolute mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 overflow-hidden"
          :class="isRTL ? 'left-0' : 'right-0'"
      >
        <!-- Dark Mode -->
        <button @click="toggleTheme" class="dropdown-item">
          <component :is="isDark ? MoonIcon : SunIcon" class="icon rtl-icon" />
          {{ t('buttons.darkMode') }}
        </button>

        <!-- Language Toggle -->
        <button @click="langOpen = !langOpen" class="dropdown-item justify-between">
          <span class="flex items-center gap-2">
            <GlobeAltIcon class="icon rtl-icon" />
            {{ t('buttons.language') }}
          </span>
          <svg
              class="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
          >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                :d="langOpen ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'"
            />
          </svg>
        </button>

        <!-- Language Submenu -->
        <transition name="fade">
          <div v-if="langOpen" :class="['pl-4', isRTL ? 'text-right pr-4' : 'text-left']">
            <button @click="changeLocale('en')" class="dropdown-item">
              <img
                  src="/flags/US.svg"
                  alt="English"
                  class="h-4 rounded-sm"
                  :class="isRTL ? 'ml-2' : 'mr-2'"
              />
              English
            </button>
            <button @click="changeLocale('ar')" class="dropdown-item">
              <img
                  src="/flags/SA.svg"
                  alt="Arabic"
                  class="h-4 rounded-sm"
                  :class="isRTL ? 'ml-2' : 'mr-2'"
              />
              العربية
            </button>
          </div>
        </transition>

        <!-- Profile Link -->
        <RouterLink
            :to="{ name: 'tokens' }"
            class="dropdown-item hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <UserCircleIcon class="icon rtl-icon" />
          {{ t('buttons.profile') }}
        </RouterLink>

        <hr class="my-1 border-gray-200 dark:border-gray-700" />

        <!-- Sign Out -->
        <button @click="signOut()" class="dropdown-item text-red-600 hover:bg-red-50 dark:hover:bg-red-900">
          <ArrowRightOnRectangleIcon class="icon rtl-icon" />
          {{ t('buttons.signOut') }}
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterLink } from 'vue-router';
import {
  MoonIcon,
  SunIcon,
  GlobeAltIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/vue/24/outline';
import { useAuthStore } from '@/app/stores/auth';

const emit = defineEmits(['toggle-dark', 'change-locale']);
const { t, locale } = useI18n();
const menuOpen = ref(false);
const langOpen = ref(false);
const isDark = ref(false);
const isRTL = computed(() => locale.value === 'ar');
const dropdownRef = ref<HTMLElement | null>(null);

const authStore = useAuthStore();
const { signOut } = authStore;

function toggleTheme() {
  isDark.value = !isDark.value;
  document.documentElement.classList.toggle('dark', isDark.value);
  localStorage.setItem('app-theme', isDark.value ? 'dark' : 'light');
  emit('toggle-dark');
}

function changeLocale(lang: string) {
  emit('change-locale', lang);
  langOpen.value = false;
  menuOpen.value = false;
}

function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    menuOpen.value = false;
    langOpen.value = false;
  }
}

onMounted(() => {
  isDark.value = localStorage.getItem('app-theme') === 'dark';
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.dropdown-item {
  @apply flex items-center w-full text-left px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition;
}
</style>
