<script setup lang="ts">
import { useAssetsStore } from '@/stores/assets'
import { assetColorByIndex } from '@/constants/chartColors'
import { computed } from 'vue'

const props = defineProps<{
  ids: string[]
}>()

const assetsStore = useAssetsStore()

const items = computed(() =>
  props.ids.map((id) => {
    const index = assetsStore.list.findIndex((a) => a.id === id)
    const asset = assetsStore.list.find((a) => a.id === id)
    const name = asset?.name ?? id
    const color = index >= 0 ? assetColorByIndex(index) : '#888'
    return { id, name, color }
  })
)
</script>

<template>
  <div v-if="items.length > 0" class="asset-name-tags text-body-2 text-medium-emphasis">
    <span v-for="item in items" :key="item.id" class="asset-tag">
      <span class="asset-tag-bullet" :style="{ backgroundColor: item.color }" aria-hidden="true" />
      <span class="asset-tag-name">{{ item.name }}</span>
    </span>
  </div>
</template>

<style scoped>
.asset-name-tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 16px;
}
.asset-tag {
  display: inline-flex;
  align-items: center;
  min-width: 0;
}
.asset-tag-bullet {
  flex-shrink: 0;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 6px;
}
.asset-tag-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
