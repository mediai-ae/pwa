<template>
  <div class="dashboard-home">
    <div class="header">
      <h1>Assets Gallery</h1>
      <div class="actions">
        <button id="uploadBtn">Upload</button>
        <button id="searchBtn">Search</button>
        <button id="recommendBtn">Recommendation</button>
      </div>
    </div>

    <div class="tabs">
      <router-link :to="{name: 'texts'}" active-class="active">Texts</router-link>
      <router-link :to="{name: 'images'}" active-class="active">Image</router-link>
      <router-link :to="{name: 'audios'}" active-class="active">Audio</router-link>
      <router-link :to="{name: 'videos'}" active-class="active">Video</router-link>
    </div>


    <router-view></router-view>
  </div>

</template>


<script setup lang="ts">
import '@/dashboard/style.css';

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Tahoma&display=swap');
</style>