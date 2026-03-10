<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import { mdiHelpCircleOutline } from '@mdi/js'
import habitatLogo from '@/assets/habitat-logo.svg'
import ModalCloseButton from '@/components/ModalCloseButton.vue'

const helpOpen = ref(false)
</script>

<template>
  <v-app>
    <v-app-bar fixed color="surface">
      <template #prepend>
        <div class="app-bar-prepend">
          <img :src="habitatLogo" alt="" class="habitat-logo" aria-hidden="true" />
        </div>
      </template>
      <v-app-bar-title class="app-bar-title">Habitat Energy</v-app-bar-title>
      <template #append>
        <div class="app-bar-append">
          <v-btn variant="text" @click="helpOpen = true">
            <v-icon :icon="`svg:${mdiHelpCircleOutline}`" start />
            Help
          </v-btn>
        </div>
      </template>
    </v-app-bar>
    <v-main>
      <v-container fluid class="pt-4">
        <RouterView />
      </v-container>
    </v-main>

    <v-dialog v-model="helpOpen" max-width="400" transition="dialog-transition">
      <v-card>
        <v-card-title class="d-flex align-center justify-space-between">
          <span>Help</span>
          <ModalCloseButton aria-label="Close help" @close="helpOpen = false" />
        </v-card-title>
        <v-card-text class="pt-0">
          <ul class="help-list">
            <li>Click an asset to view more real time data and individual metric and power.</li>
            <li>Toggle Asset view for tile or table view.</li>
            <li>Click legend items to remove or add data to charts.</li>
          </ul>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<style scoped>
.app-bar-prepend {
  padding-left: 16px;
  padding-right: 8px;
}
@media (min-width: 960px) {
  .app-bar-prepend {
    padding-left: 24px;
    padding-right: 12px;
  }
}
.app-bar-title {
  padding-left: 0;
}
.app-bar-append {
  padding-right: 16px;
}
@media (min-width: 960px) {
  .app-bar-append {
    padding-right: 24px;
  }
}
.habitat-logo {
  height: 36px;
  width: auto;
  display: block;
}
.help-list {
  margin: 0;
  padding-left: 1.25rem;
  line-height: 1.6;
}
.help-list li {
  margin-bottom: 1rem;
}
.help-list li:last-child {
  margin-bottom: 0;
}
</style>
