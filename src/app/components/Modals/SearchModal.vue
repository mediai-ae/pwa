<template>
  <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn px-2">
    <div
        class="relative w-full max-w-2xl bg-white dark:bg-secondary-dark text-black dark:text-white
             rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh] p-4 sm:p-6 space-y-6"
    >
      <!-- Close Button -->
      <button
          @click="$emit('close')"
          class="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:hover:text-white transition"
          aria-label="Close"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 20 20" fill="currentColor">
          <path
              fill-rule="evenodd"
              d="M10 8.586l4.95-4.95a1 1 0
               111.414 1.414L11.414 10l4.95 4.95a1
               1 0 01-1.414 1.414L10 11.414l-4.95
               4.95a1 1 0
               01-1.414-1.414L8.586 10 3.636
               5.05a1 1 0
               011.414-1.414L10 8.586z"
              clip-rule="evenodd"
          />
        </svg>
      </button>

      <!-- Modal Title -->
      <h3 class="text-lg sm:text-2xl font-semibold text-center">
        {{ $t('search.title') }}
      </h3>

      <!-- Text Search Form -->
      <form @submit.prevent="handleTextSearch" class="space-y-4">
        <label for="searchQuery" class="block mb-1 font-medium">
          {{ $t('search.labels.searchQuery') }}
        </label>
        <input
            v-model="searchQuery"
            id="searchQuery"
            type="text"
            class="w-full p-2 rounded-xl bg-gray-100 dark:bg-gray-800"
        />

        <button
            type="submit"
            class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition disabled:opacity-50"
            :disabled="store.loading"
        >
          {{ $t('search.buttons.textSearch') }}
        </button>
      </form>

      <!-- Text Search Results Table -->
      <div v-if="store.textResults.length" class="overflow-x-auto">
        <table class="min-w-full text-center border border-gray-300 dark:border-gray-600 text-sm">
          <thead class="bg-gray-100 dark:bg-gray-700 text-xs uppercase">
          <tr>
            <th class="p-2">{{ $t('search.table.thumbnail') }}</th>
            <th class="p-2">{{ $t('search.table.name') }}</th>
            <th class="p-2">{{ $t('search.table.hashtags') }}</th>
            <th class="p-2">{{ $t('search.table.rga') }}</th>
            <th class="p-2">{{ $t('search.table.fingerprint') }}</th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="(item, idx) in store.textResults"
              :key="idx"
              class="border-t border-gray-200 dark:border-gray-700"
          >
            <td class="p-2">
              <img
                  :src="item.thumbnail"
                  alt="Thumbnail"
                  class="inline-block w-16 h-16 object-cover rounded"
              />
            </td>
            <td class="p-2">{{ item.filename }}</td>
            <td class="p-2">
              {{ item.hashtags.join(', ') }}
            </td>
            <td class="p-2">{{ item.rga_category }}</td>
            <td class="p-2">{{ item.fingerprint }}</td>
          </tr>
          </tbody>
        </table>
      </div>

      <hr />

      <!-- Image Search Title -->
      <h4 class="text-lg font-medium text-center">
        {{ $t('search.buttons.imageSearch') }}
      </h4>

      <!-- Image Search Form -->
      <form @submit.prevent="handleImageSearch" class="space-y-4">
        <div
            class="w-full p-4 border border-dashed border-gray-400 rounded-xl text-center cursor-pointer bg-gray-100 dark:bg-gray-800"
            @dragover.prevent
            @drop.prevent="onImageDrop"
            @click="$refs.imageInput.click()"
        >
          <p class="mb-2">
            {{ $t('search.labels.dragDropText') }}
          </p>
          <input
              ref="imageInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="onFileSelected"
          />
          <p v-if="imageFileName" class="text-sm italic mt-2">
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

      <!-- Image Search Results Table -->
      <div v-if="store.imageResults.length" class="overflow-x-auto">
        <table class="min-w-full text-center border border-gray-300 dark:border-gray-600 text-sm">
          <thead class="bg-gray-100 dark:bg-gray-700 text-xs uppercase">
          <tr>
            <th class="p-2">{{ $t('search.table.thumbnail') }}</th>
            <th class="p-2">{{ $t('search.table.name') }}</th>
            <th class="p-2">{{ $t('search.table.hashtags') }}</th>
            <th class="p-2">{{ $t('search.table.rga') }}</th>
            <th class="p-2">{{ $t('search.table.fingerprint') }}</th>
            <th class="p-2">{{ $t('search.table.similarity') }}</th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="(res, i) in store.imageResults"
              :key="i"
              class="border-t border-gray-200 dark:border-gray-700"
          >
            <td class="p-2">
              <img
                  :src="res.thumbnail"
                  alt="Thumbnail"
                  class="inline-block w-16 h-16 object-cover rounded"
              />
            </td>
            <td class="p-2">{{ res.filename }}</td>
            <td class="p-2">{{ res.hashtags.join(', ') }}</td>
            <td class="p-2">{{ res.rga_category }}</td>
            <td class="p-2">{{ res.fingerprint }}</td>
            <td class="p-2">
              {{ res.similarity }}%
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- Error Message -->
      <div v-if="store.error" class="text-red-600 text-center">
        {{ store.error }}
      </div>
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
const imageFile = ref<File|null>(null);
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

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
</style>
