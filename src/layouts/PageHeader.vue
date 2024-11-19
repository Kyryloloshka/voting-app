<script setup lang="ts">
import links from '@/constants/header-links.ts';
</script>

<template>
  <header class="sticky top-0 bg-dark-500/50 backdrop-blur-md z-[1000]">
    <div class="flex gap-12 text-center container justify-between min-h-[70px] items-center">

      <img class="h-12" src="/logo.svg" alt="logo">
      <nav>
        <ul class="flex gap-x-6 gap-y-2 justify-center py-3 flex-wrap">
          <li v-for="link of links" :key="link.href">
            <router-link :to="link.href">{{ link.title }}</router-link>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<style scoped>

</style>