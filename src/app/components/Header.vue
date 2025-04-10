<template>
  <header class="bg-white dark:bg-secondary-dark text-black dark:text-white shadow">
    <!-- Main Header Layout -->
    <div class="p-4 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
      <!-- Logo + Mobile Profile -->
      <div class="flex justify-between items-center w-full sm:w-auto">
        <RouterLink :to="{ name: 'home' }" class="flex items-center gap-2">
          <img src="/logo.svg" alt="Mediai Logo" class="h-8 w-8" />
          <h1 class="text-xl sm:text-2xl font-bold tracking-tight">Mediai</h1>
        </RouterLink>

        <!-- Profile (Mobile Only) -->
        <div class="relative sm:hidden flex items-center gap-2">
          <button @click="() => openModal?.('search')" class="toolbar-btn search-btn p-2">
            <MagnifyingGlassIcon class="h-5 w-5 icon" />
          </button>
          <ProfileDropdown @toggle-dark="emitToggleDark" @change-locale="emitChangeLocale" />
        </div>
      </div>

      <!-- Desktop Buttons + Profile -->
      <div class="hidden sm:flex items-center gap-4 justify-end w-full">
        <!-- Upload + Recommend Group -->
        <div class="flex items-center gap-3">
          <button @click="() => openModal?.('upload')" class="toolbar-btn flex items-center gap-2">
            <ArrowUpTrayIcon class="h-5 w-5" />
            {{ t('buttons.upload') }}
          </button>
          <button
            @click="() => openModal?.('recommend')"
            class="toolbar-btn flex items-center gap-2"
          >
            <LightBulbIcon class="h-5 w-5" />
            {{ t('buttons.recommend') }}
          </button>
        </div>

        <!-- Search + Profile -->
        <div class="flex items-center gap-3">
          <button
            @click="() => openModal?.('search')"
            class="toolbar-btn search-btn flex items-center gap-2"
          >
            <MagnifyingGlassIcon class="h-5 w-5 icon" />
            {{ t('buttons.search') }}
          </button>
          <ProfileDropdown @toggle-dark="emitToggleDark" @change-locale="emitChangeLocale" />
        </div>
      </div>
    </div>

    <!-- Mobile Button Row (Upload + Recommend Only) -->
    <div class="sm:hidden px-4 pb-4">
      <div class="flex gap-2">
        <button
          @click="() => openModal?.('upload')"
          class="toolbar-btn flex-1 flex items-center justify-center gap-2"
        >
          <ArrowUpTrayIcon class="h-5 w-5" />
          {{ t('buttons.upload') }}
        </button>
        <button
          @click="() => openModal?.('recommend')"
          class="toolbar-btn flex-1 flex items-center justify-center gap-2"
        >
          <LightBulbIcon class="h-5 w-5" />
          {{ t('buttons.recommend') }}
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import { useI18n } from 'vue-i18n';
import ProfileDropdown from './ProfileDropdown.vue';
import { ArrowUpTrayIcon, MagnifyingGlassIcon, LightBulbIcon } from '@heroicons/vue/24/outline';
import { RouterLink } from 'vue-router';

const emit = defineEmits(['toggle-dark', 'change-locale']);
const { t } = useI18n();
const openModal = inject<(type: string, data?: any) => void>('openModal');

function emitToggleDark() {
  emit('toggle-dark');
}

function emitChangeLocale(lang: string) {
  emit('change-locale', lang);
}
</script>
