<template>
  <header class="bg-white dark:bg-secondary-dark text-black dark:text-white shadow">
    <!-- Main Header Layout -->
    <div class="p-4 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
      <!-- Logo + Mobile Profile -->
      <div class="flex justify-between items-center w-full sm:w-auto">
        <div class="flex items-center gap-2">
          <span class="text-2xl">🎬</span>
          <h1 class="text-xl sm:text-2xl font-bold tracking-tight">
            {{ t('header.dashboard') }}
          </h1>
        </div>

        <!-- Profile (Mobile Only) -->
        <div class="relative sm:hidden">
          <ProfileDropdown @toggle-dark="emitToggleDark" @change-locale="emitChangeLocale" />
        </div>
      </div>

      <!-- Desktop Buttons + Profile -->
      <div class="hidden sm:flex items-center gap-4 justify-end w-full">
        <div class="flex items-center gap-3">
          <button @click="() => openModal?.('upload')" class="toolbar-btn flex items-center gap-2">
            <ArrowUpTrayIcon class="h-5 w-5" />
            {{ t('buttons.upload') }}
          </button>
          <button @click="() => openModal?.('search')" class="toolbar-btn flex items-center gap-2">
            <MagnifyingGlassIcon class="h-5 w-5" />
            {{ t('buttons.search') }}
          </button>
          <button @click="() => openModal?.('recommend')" class="toolbar-btn flex items-center gap-2">
            <LightBulbIcon class="h-5 w-5" />
            {{ t('buttons.recommend') }}
          </button>
        </div>

        <ProfileDropdown @toggle-dark="emitToggleDark" @change-locale="emitChangeLocale" />
      </div>
    </div>

    <!-- Mobile Button Row -->
    <div class="sm:hidden px-4 pb-4">
      <div class="flex gap-2">
        <button @click="() => openModal?.('upload')" class="toolbar-btn flex-1 flex items-center justify-center gap-2">
          <ArrowUpTrayIcon class="h-5 w-5" />
          {{ t('buttons.upload') }}
        </button>
        <button @click="() => openModal?.('search')" class="toolbar-btn flex-1 flex items-center justify-center gap-2">
          <MagnifyingGlassIcon class="h-5 w-5" />
          {{ t('buttons.search') }}
        </button>
        <button @click="() => openModal?.('recommend')" class="toolbar-btn flex-1 flex items-center justify-center gap-2">
          <LightBulbIcon class="h-5 w-5" />
          {{ t('buttons.recommend') }}
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { useI18n } from 'vue-i18n'
import ProfileDropdown from './ProfileDropdown.vue'
import {
  ArrowUpTrayIcon,
  MagnifyingGlassIcon,
  LightBulbIcon
} from '@heroicons/vue/24/outline'

const emit = defineEmits(['toggle-dark', 'change-locale'])
const { t } = useI18n()
const openModal = inject<(type: string, data?: any) => void>('openModal')

function emitToggleDark() {
  emit('toggle-dark')
}

function emitChangeLocale(lang: string) {
  emit('change-locale', lang)
}
</script>

<style scoped>
.toolbar-btn {
  @apply text-sm px-4 py-2 rounded-lg font-medium transition-all text-center;
  @apply bg-gray-100 text-black hover:bg-gray-200;
  @apply dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700;
  @apply border border-gray-300 dark:border-gray-600;
  @apply focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500;
}
</style>
