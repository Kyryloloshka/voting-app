<script setup lang="ts">
import { Button } from '@/components/ui/button';
</script>

<template>
  <main class="container pt-12">
    <div class="flex flex-col gap-9 items-center">
      <h1 class="text-center  text-3xl font-medium tracking-wider">Welcome to the Voting App</h1>
      <router-link to="/create-voting">
        <Button>
          + Create Voting
        </Button>
      </router-link>
    </div>
  </main>
</template>

<style scoped>

</style>