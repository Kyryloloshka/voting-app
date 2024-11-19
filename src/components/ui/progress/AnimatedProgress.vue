<script setup lang="ts">
import { Progress } from '@/components/ui/progress/index.ts'
import { type HTMLAttributes, ref, watchEffect } from 'vue'
import type { ProgressRootProps } from 'radix-vue'

const progress = ref<null | number>(0)
const props = withDefaults(
  defineProps<ProgressRootProps & { class?: HTMLAttributes['class'] }>(),
  {
    modelValue: 0,
  },
)
watchEffect((cleanupFn) => {
  const timer = setTimeout(() => progress.value = props.modelValue, 500)
  cleanupFn(() => clearTimeout(timer))
})
</script>

<template>
  <Progress v-model="progress" />
</template>

<style scoped>

</style>