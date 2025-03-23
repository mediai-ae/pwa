<template>
  <div
      :dir="locale === 'ar' ? 'rtl' : 'ltr'"
      :class="{ dark: isDark }"
      class="min-h-screen bg-gray-50 dark:bg-primary-dark text-black dark:text-white transition"
  >
    <div class="absolute top-4 right-4 flex items-center gap-3 z-10">
      <select
          v-model="locale"
          class="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-sm"
      >
        <option value="en">🇺🇸 English</option>
        <option value="ar">🇸🇦 العربية</option>
      </select>
      <button
          @click="toggleDark"
          class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm"
      >
        {{ isDark ? '🌙' : '☀️' }}
      </button>
    </div>

    <div class="flex items-center justify-center px-4 py-6 sm:py-12 min-h-screen">
      <div class="w-full sm:max-w-md bg-white dark:bg-secondary-dark shadow-xl rounded-xl p-6 sm:p-8 space-y-6">
        <img src="/logo.svg" alt="Logo" class="w-20 h-20 mx-auto" />

        <h1 class="text-2xl font-bold text-center">{{ t('login.title') }}</h1>
        <p class="text-center text-gray-500 dark:text-gray-300">
          {{ t('login.subtitle') }}
        </p>

        <button
            @click="handleGoogleLogin"
            class="w-full px-4 py-2 rounded bg-white text-black border border-gray-300 hover:shadow flex items-center justify-center gap-2 dark:bg-gray-100"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" class="w-5 h-5" />
          <span class="font-medium">{{ t('login.googleButton') }}</span>
        </button>

        <div class="text-center my-4 text-sm text-gray-400 dark:text-gray-500">{{ t('login.or') }}</div>

        <form @submit.prevent="loginWithEmail" class="space-y-4">
          <input
              type="email"
              v-model="email"
              :placeholder="t('login.emailPlaceholder')"
              class="w-full px-4 py-2 rounded bg-white dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent"
              required
          />
          <input
              type="password"
              v-model="password"
              :placeholder="t('login.passwordPlaceholder')"
              class="w-full px-4 py-2 rounded bg-white dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent"
              required
          />
          <button
              type="submit"
              class="w-full px-4 py-2 rounded bg-accent-soft text-white hover:bg-accent transition"
          >
            {{ t('login.loginButton') }}
          </button>
        </form>

        <p v-if="error" class="text-center text-sm text-red-500">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { googleTokenLogin } from 'vue3-google-login'

const router = useRouter()
const { locale: i18nLocale, t } = useI18n()

const locale = computed({
  get: () => i18nLocale.value,
  set: val => (i18nLocale.value = val),
})

const isDark = ref(true)
const email = ref('')
const password = ref('')
const error = ref('')

function toggleDark() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
}

async function handleGoogleLogin() {
  try {
    const response = await googleTokenLogin()
    console.log('✅ Access Token:', response.access_token)

    localStorage.setItem('access_token', response.access_token)
    router.push('/dashboard')
  } catch (error) {
    console.error('❌ Google Login Error:', error)
  }
}

function loginWithEmail() {
  if (email.value === 'admin@example.com' && password.value === '123456') {
    localStorage.setItem('user', JSON.stringify({ email: email.value }))
    router.push('/dashboard')
  } else {
    error.value = t('login.invalidCredentials')
  }
}
</script>
