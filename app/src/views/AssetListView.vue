<script setup lang="ts">
import { useAssetsStore } from '@/stores/assets'
import { onMounted } from 'vue'

const assetsStore = useAssetsStore()

onMounted(() => {
  assetsStore.load()
})
</script>

<template>
  <div>
    <h2 class="text-h6 mb-4">Asset List</h2>
    <v-progress-linear v-if="assetsStore.loading" indeterminate />
    <v-alert v-else-if="assetsStore.error" type="error" :text="assetsStore.error" />
    <v-table v-else>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Type</th>
          <th>Location</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="asset in assetsStore.list" :key="asset.id">
          <td>{{ asset.id }}</td>
          <td>{{ asset.name }}</td>
          <td>{{ asset.type }}</td>
          <td>{{ asset.location }}</td>
          <td>{{ asset.status }}</td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>
