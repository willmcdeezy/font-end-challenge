<script setup lang="ts">
import { RouterView } from 'vue-router'
import habitatLogo from '@/assets/habitat-logo.svg'
</script>

<template>
  <v-app>
    <v-app-bar fixed color="surface">
      <template #prepend>
        <img :src="habitatLogo" alt="" class="habitat-logo mr-2" aria-hidden="true" />
      </template>
      <v-app-bar-title>Habitat Energy</v-app-bar-title>
    </v-app-bar>
    <v-main>
      <v-container fluid class="pt-4">
        <RouterView />
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.habitat-logo {
  height: 36px;
  width: auto;
  display: block;
}
</style>
