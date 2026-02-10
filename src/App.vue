<script setup lang="ts">
import { RouterView, RouterLink } from "vue-router";
</script>

<template>
  <div class="min-h-screen bg-slate-50 font-sans">
    <nav class="bg-white border-b border-slate-200 px-4 py-3">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <RouterLink to="/" class="text-xl font-bold text-slate-800 flex items-center gap-2">
          <span class="bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded-lg text-sm">JT</span>
          Jotelco Tools
        </RouterLink>
        <div class="flex gap-4">
          <RouterLink to="/tools" class="text-slate-600 hover:text-blue-600 font-medium">Tools</RouterLink>
        </div>
      </div>
    </nav>

    <main>
      <RouterView />
    </main>
  </div>
</template>
