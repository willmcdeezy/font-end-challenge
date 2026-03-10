<script setup lang="ts">
import { mdiClose } from '@mdi/js'

defineProps<{
  ariaLabel?: string
}>()

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <v-btn
    icon
    variant="text"
    size="small"
    :aria-label="ariaLabel ?? 'Close'"
    class="modal-close-btn"
    @click="emit('close')"
  >
    <v-icon :icon="`svg:${mdiClose}`" />
  </v-btn>
</template>

<style scoped>
.modal-close-btn {
  flex-shrink: 0;
}
</style>
