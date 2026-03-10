<script setup lang="ts">
import { mdiDomain } from '@mdi/js'
import { RouterView } from 'vue-router'
</script>

<template>
  <v-app>
    <v-app-bar fixed color="surface">
      <template #prepend>
        <v-icon :icon="`svg:${mdiDomain}`" size="32" class="mr-2" aria-hidden="true" />
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
