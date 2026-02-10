<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="bg-slate-50 min-h-screen p-8">
    <div class="max-w-4xl mx-auto">
      <header class="mb-12 text-center">
        <h1 class="text-4xl font-bold text-slate-900 mb-4">Jotelco Tools</h1>
        <p class="text-xl text-slate-600">Kumpulan alat bantu untuk pekerjaan telekomunikasi.</p>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Placement Grouper Card -->
        <RouterLink 
          to="/tools/placement-grouper"
          class="block group bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-500 transition-all duration-300"
        >
          <div class="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600 group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h2 class="text-xl font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">Placement Grouper</h2>
          <p class="text-slate-500 text-sm">Analisis Point-in-Polygon dari file KMZ untuk mengelompokkan titik ke dalam area polygon.</p>
        </RouterLink>

        <!-- BTS Azimuth Visualizer Card -->
        <RouterLink 
          to="/tools/azimuth-visualizer"
          class="block group bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-500 transition-all duration-300"
        >
          <div class="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-500 transition-colors duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600 group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <h2 class="text-xl font-semibold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors">BTS Azimuth Visualizer</h2>
          <p class="text-slate-500 text-sm">Generate visualisasi azimuth, beamwidth, dan circle radius untuk site-site telekomunikasi ke format KMZ.</p>
        </RouterLink>

        <!-- Placeholder for Future Tools -->
        <div class="bg-slate-100 p-6 rounded-xl border border-slate-200 border-dashed flex flex-col items-center justify-center text-center opacity-75">
          <div class="h-12 w-12 bg-slate-200 rounded-lg flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-slate-500">More Tools Coming Soon</h3>
        </div>
      </div>
    </div>
  </div>
</template>
