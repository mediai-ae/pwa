<template>
  <div class="space-y-8">
    <!-- Modal Title -->
    <h3 class="text-2xl font-bold text-center text-gray-800 dark:text-white">
      {{ $t('search.title') }}
    </h3>

    <!-- Text Search Form -->
    <form @submit.prevent="handleTextSearch" class="space-y-4">
      <label for="searchQuery" class="block font-medium text-gray-700 dark:text-gray-200">
        {{ $t('search.labels.searchQuery') }}
      </label>
      <input
        v-model="searchQuery"
        id="searchQuery"
        type="text"
        class="w-full px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition disabled:opacity-50"
        :disabled="store.loading"
      >
        {{ $t('search.buttons.textSearch') }}
      </button>
    </form>

    <!-- Text Search Results -->
    <div
      v-if="store.textResults.length"
      class="overflow-x-auto border rounded-xl shadow-sm dark:border-gray-700"
    >
      <table class="min-w-full text-center border-collapse text-sm">
        <thead class="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white uppercase text-xs">
          <tr>
            <th class="p-3">{{ $t('search.table.thumbnail') }}</th>
            <th class="p-3">{{ $t('search.table.name') }}</th>
            <th class="p-3">{{ $t('search.table.hashtags') }}</th>
            <th class="p-3">{{ $t('search.table.rga') }}</th>
            <th class="p-3">{{ $t('search.table.fingerprint') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, idx) in store.textResults"
            :key="idx"
            class="border-t border-gray-200 dark:border-gray-700 transition hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <td class="p-3">
              <img
                :src="item.thumbnail"
                alt="Thumbnail"
                class="w-16 h-16 object-cover rounded shadow"
              />
            </td>
            <td class="p-3">{{ item.filename }}</td>
            <td class="p-3">{{ item.hashtags.join(', ') }}</td>
            <td class="p-3">{{ item.rga_category }}</td>
            <td class="p-3">{{ item.fingerprint }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Image Search Section -->
    <h4 class="text-lg font-semibold text-center text-gray-800 dark:text-white">
      {{ $t('search.buttons.imageSearch') }}
    </h4>

    <form @submit.prevent="handleImageSearch" class="space-y-4">
      <div
        class="w-full p-6 border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-xl text-center cursor-pointer bg-gray-100 dark:bg-gray-800 hover:border-blue-500 transition"
        @dragover.prevent
        @drop.prevent="onImageDrop"
        @click="$refs.imageInput.click()"
      >
        <p class="text-sm sm:text-base mb-1 text-gray-600 dark:text-gray-300">
          {{ $t('search.labels.dragDropText') }}
        </p>
        <input
          ref="imageInput"
          type="file"
          accept="image/*"
          class="hidden"
          @change="onFileSelected"
        />
        <p v-if="imageFileName" class="text-sm italic mt-2 text-blue-600 dark:text-blue-400">
          {{ imageFileName }}
        </p>
      </div>

      <button
        type="submit"
        class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition disabled:opacity-50"
        :disabled="store.loading"
      >
        {{ $t('search.buttons.imageSearch') }}
      </button>
    </form>

    <!-- Image Search Results -->
    <div
      v-if="store.imageResults.length"
      class="overflow-x-auto border rounded-xl shadow-sm dark:border-gray-700"
    >
      <table class="min-w-full text-center border-collapse text-sm">
        <thead class="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white uppercase text-xs">
          <tr>
            <th class="p-3">{{ $t('search.table.thumbnail') }}</th>
            <th class="p-3">{{ $t('search.table.name') }}</th>
            <th class="p-3">{{ $t('search.table.hashtags') }}</th>
            <th class="p-3">{{ $t('search.table.rga') }}</th>
            <th class="p-3">{{ $t('search.table.fingerprint') }}</th>
            <th class="p-3">{{ $t('search.table.similarity') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(res, i) in store.imageResults"
            :key="i"
            class="border-t border-gray-200 dark:border-gray-700 transition hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <td class="p-3">
              <img
                :src="res.thumbnail"
                alt="Thumbnail"
                class="w-16 h-16 object-cover rounded shadow"
              />
            </td>
            <td class="p-3">{{ res.filename }}</td>
            <td class="p-3">{{ res.hashtags.join(', ') }}</td>
            <td class="p-3">{{ res.rga_category }}</td>
            <td class="p-3">{{ res.fingerprint }}</td>
            <td class="p-3 font-semibold">{{ res.similarity }}%</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Error Message -->
    <div v-if="store.error" class="text-center text-red-600 dark:text-red-400 font-medium">
      {{ store.error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSearchStore } from '@/app/stores/search';

defineEmits(['close']);

const { t } = useI18n();
const store = useSearchStore();

const searchQuery = ref('');
const imageFile = ref<File | null>(null);
const imageFileName = ref('');

const handleTextSearch = async () => {
  await store.searchByText(searchQuery.value);
};

const handleImageSearch = async () => {
  if (!imageFile.value) {
    store.error = t('search.errors.noImageSelected');
    return;
  }
  await store.searchByImage(imageFile.value);
};

function onFileSelected(e: Event) {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    imageFile.value = target.files[0];
    imageFileName.value = target.files[0].name;
  }
}

function onImageDrop(e: DragEvent) {
  if (e.dataTransfer && e.dataTransfer.files.length > 0) {
    imageFile.value = e.dataTransfer.files[0];
    imageFileName.value = e.dataTransfer.files[0].name;
  }
}
</script>
