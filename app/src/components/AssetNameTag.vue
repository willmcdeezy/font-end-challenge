<script setup lang="ts">
import type { Asset } from '@/types'
import { useAssetsStore } from '@/stores/assets'
import { assetColorByIndex } from '@/constants/chartColors'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    asset: Asset
    /** small = tiles & table, large = asset detail header */
    size?: 'small' | 'large'
  }>(),
  { size: 'small' }
)

const assetsStore = useAssetsStore()

const assetColor = computed(() => {
  const index = assetsStore.list.findIndex((a) => a.id === props.asset.id)
  return index >= 0 ? assetColorByIndex(index) : '#888'
})
</script>

<template>
  <span class="asset-name-tag" :class="[`asset-name-tag--${size}`]">
    <span class="asset-name-tag__bullet" :style="{ backgroundColor: assetColor }" aria-hidden="true" />
    <component :is="size === 'large' ? 'h1' : 'span'" class="asset-name-tag__name">
      {{ asset.name }}
    </component>
  </span>
</template>

<style scoped>
.asset-name-tag {
  display: inline-flex;
  align-items: center;
  min-width: 0;
}
.asset-name-tag__bullet {
  flex-shrink: 0;
  border-radius: 50%;
  margin-right: 10px;
}
.asset-name-tag__name {
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.asset-name-tag--small .asset-name-tag__bullet {
  width: 8px;
  height: 8px;
}
.asset-name-tag--small .asset-name-tag__name {
  font-size: 0.9375rem;
}

.asset-name-tag--large .asset-name-tag__bullet {
  width: 12px;
  height: 12px;
}
.asset-name-tag--large .asset-name-tag__name {
  font-size: 1.5rem;
  font-weight: 500;
  line-height: 1.2;
  margin: 0;
}
</style>
