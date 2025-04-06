<template>
  <header class="p-4 shadow bg-white dark:bg-secondary-dark text-black dark:text-white">
    <div class="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
      <!-- Logo and Mobile Controls -->
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-2">
          <span class="text-2xl">🎬</span>
          <h1 class="text-xl sm:text-2xl font-bold tracking-tight">
            {{ t('header.dashboard') }}
          </h1>
        </div>

        <!-- Mobile Controls -->
        <div class="flex items-center gap-2 sm:hidden" :class="isRTL ? 'flex-row-reverse' : ''">
          <select
              class="locale-select"
              :value="locale"
              @change="onLocaleChange"
          >
            <option value="en">🇬🇧</option>
            <option value="ar">🇸🇦</option>
          </select>

          <button @click="$emit('toggle-dark')" class="toolbar-btn">
            🌓
          </button>

          <div class="relative">
            <button @click="menuOpen = !menuOpen" class="toolbar-btn">
              📋
            </button>
            <transition name="fade">
              <div
                  v-if="menuOpen"
                  class="absolute mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-50"
                  :class="isRTL ? 'left-0' : 'right-0'"
              >
                <button
                    @click="() => openAndClose('upload')"
                    class="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  ⬆️ {{ t('buttons.upload') }}
                </button>
                <button
                    @click="() => openAndClose('search')"
                    class="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  🔍 {{ t('buttons.search') }}
                </button>
                <button
                    @click="() => openAndClose('recommend')"
                    class="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  💡 {{ t('buttons.recommend') }}
                </button>
              </div>
            </transition>
          </div>
        </div>
      </div>

      <!-- Desktop Controls -->
      <div class="hidden sm:flex items-center gap-4 justify-end">
        <div class="flex items-center gap-3">
          <button @click="() => openModal?.('upload')" class="toolbar-btn">
            ⬆️ {{ t('buttons.upload') }}
          </button>
          <button class="toolbar-btn">
            🔍 {{ t('buttons.search') }}
          </button>
          <button @click="() => openModal?.('recommend')" class="toolbar-btn">
            💡 {{ t('buttons.recommend') }}
          </button>
        </div>

        <div class="flex items-center gap-2">
          <select
              class="toolbar-btn pl-3 pr-8"
              :value="locale"
              @change="onLocaleChange"
          >
            <option value="en">🇬🇧 English</option>
            <option value="ar">🇸🇦 العربية</option>
          </select>

          <button @click="$emit('toggle-dark')" class="toolbar-btn">
            🌓
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { inject, ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineProps<{ locale: string }>();
const emit = defineEmits(['toggle-dark', 'change-locale']);
const { t, locale } = useI18n();

const openModal = inject<(type: string, data?: any) => void>('openModal');
const menuOpen = ref(false);
const isRTL = computed(() => locale.value === 'ar');

function onLocaleChange(event: Event) {
  const target = event.target as HTMLSelectElement;
  emit('change-locale', target.value);
}

function openAndClose(type: string) {
  menuOpen.value = false;
  openModal?.(type);
}
</script>

<style scoped>
.toolbar-btn {
  @apply text-sm px-4 py-2 rounded-md font-medium transition-all;
  @apply bg-gray-100 text-black hover:bg-gray-200;
  @apply dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700;
  @apply border border-gray-300 dark:border-gray-600;
  @apply focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500;
}

.locale-select {
  font-size: 1.5rem;
  padding: 0.25rem 0.5rem;
  background: transparent;
  border: none;
  outline: none;
  appearance: none;
  line-height: 1;
  height: 2.25rem;
}

@media (min-width: 640px) {
  .locale-select {
    font-size: 0.875rem;
    padding: 0.5rem 2rem;
    border: 1px solid #d1d5db;
    background-color: #f3f4f6;
    border-radius: 0.375rem;
    color: #111827;
  }

  .dark .locale-select {
    background-color: #1f2937;
    border-color: #4b5563;
    color: #fff;
  }
}

select.toolbar-btn:focus,
button.toolbar-btn:focus {
  outline: none;
  box-shadow: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
