<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <v-app>
    <v-navigation-drawer permanent>
      <v-list nav>
        <v-list-item :to="{ name: 'Assets' }" title="Assets" />
        <v-list-item :to="{ name: 'Telemetry' }" title="Telemetry" />
        <v-list-item :to="{ name: 'Power' }" title="Power" />
        <v-list-item :to="{ name: 'Configuration' }" title="Configuration" />
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <v-container fluid>
        <RouterView />
      </v-container>
    </v-main>
  </v-app>
</template>
