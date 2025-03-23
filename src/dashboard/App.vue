<template>
  <div :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'" :class="{ dark: isDark }">
    <div class="min-h-screen font-tahoma transition-colors duration-500 bg-white text-black dark:bg-primary-dark dark:text-white">

      <!-- Header -->
      <Header
          :locale="locale"
          @change-locale="changeLocale"
          @toggle-dark="toggleDark"
          @open-modal="openModal"
          @toggle-dropdown="toggleDropdown"
      />

      <!-- Dropdown -->
      <Dropdown v-if="dropdownVisible" />

      <!-- Tabs -->
      <div class="tabs flex text-center shadow transition text-black bg-gray-100 dark:text-white dark:bg-secondary-dark">
        <router-link class="tab flex-1 py-3" :to="{ name: 'texts' }" active-class="active">Texts</router-link>
        <router-link class="tab flex-1 py-3" :to="{ name: 'images' }" active-class="active">Images</router-link>
        <router-link class="tab flex-1 py-3" :to="{ name: 'audios' }" active-class="active">Audios</router-link>
        <router-link class="tab flex-1 py-3" :to="{ name: 'videos' }" active-class="active">Videos</router-link>
      </div>

      <!-- Main Content -->
      <main class="p-4 transition-all duration-300">
        <!-- Vue Router View -->
        <router-view></router-view>

        <!-- Image Grid (optional showcase) -->
        <div v-if="images.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          <img
              v-for="img in images"
              :key="img"
              :src="img"
              class="rounded shadow hover:scale-105 transition"
          />
        </div>
      </main>

      <!-- Upload Modal -->
      <Modal
          v-if="activeModal === 'upload'"
          :type="'upload'"
          @close="activeModal = ''"
      >
        <form @submit.prevent="handleUpload" class="space-y-4">
          <input type="file" @change="onFileChange" class="block w-full text-sm text-white" />
          <button type="submit" class="bg-green-600 px-4 py-2 rounded hover:bg-green-700">Upload</button>
          <p v-if="uploadMessage" class="text-sm text-green-400">{{ uploadMessage }}</p>
        </form>
      </Modal>
    </div>
  </div>
</template>

<script setup lang="ts">
import '@/dashboard/style.css'
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import Header from '@/dashboard/components/Header.vue'
import Modal from '@/dashboard/components/Modal.vue'
import Dropdown from '@/dashboard/components/Dropdown.vue'
import { useImageStore } from '@/dashboard/stores/imageStore'
import axios from 'axios'

const { locale } = useI18n()
const isDark = ref(true)
const activeModal = ref('')
const dropdownVisible = ref(false)
const uploadFile = ref<File | null>(null)
const uploadMessage = ref('')

const store = useImageStore()
const images = store.images

function toggleDark() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
}

function changeLocale(lang: string) {
  locale.value = lang
}

function openModal(name: string) {
  activeModal.value = name
  dropdownVisible.value = false
  uploadMessage.value = ''
}

function toggleDropdown() {
  dropdownVisible.value = !dropdownVisible.value
}

function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files?.length) {
    uploadFile.value = target.files[0]
  }
}

async function handleUpload() {
  if (!uploadFile.value) return
  const formData = new FormData()
  formData.append('file', uploadFile.value)
  try {
    await axios.post('/api/upload', formData)
    uploadMessage.value = 'Upload successful'
    store.fetchImages()
  } catch (err) {
    uploadMessage.value = 'Upload failed'
  }
}

onMounted(() => {
  store.fetchImages()
})
</script>

<style scoped>
.tab {
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
}
.tab.active {
  background-color: #e5e7eb;
  border-bottom-color: #6b78a7;
  font-weight: bold;
}
.dark .tab.active {
  background-color: #394263;
}
</style>
