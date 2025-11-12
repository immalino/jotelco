<script setup lang="ts">
import type { AnalysisResult } from "@/types";

interface Props {
  results: AnalysisResult[];
}

interface Emits {
  (e: "download"): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();
</script>

<template>
  <div class="bg-slate-50 border-t border-slate-200">
    <div class="p-4 border-b border-slate-200 flex justify-between items-center flex-wrap gap-3">
      <div>
        <h3 class="text-lg font-semibold text-slate-800">Hasil Analisis</h3>
        <p class="text-sm text-slate-500">Ditemukan {{ results.length }} titik.</p>
      </div>
      <button
        @click="emit('download')"
        class="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        Unduh CSV
      </button>
    </div>

    <div class="overflow-x-auto max-h-[500px]">
      <table class="min-w-full divide-y divide-slate-200">
        <thead class="bg-slate-100 sticky top-0">
          <tr>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
            >
              No
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
            >
              Nama Placemark
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
            >
              Grup (Polygon)
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
            >
              Koordinat (Lon, Lat)
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider"
            >
              Status
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-slate-200">
          <tr v-for="(item, index) in results" :key="index" class="hover:bg-slate-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{{ index + 1 }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
              {{ item.name }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
              <span
                v-if="item.group !== 'Unassigned'"
                class="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold"
              >
                {{ item.group }}
              </span>
              <span v-else class="text-slate-400 italic">Tidak ada grup</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">
              {{ item.coordinates.join(", ") }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-center">
              <span
                class="inline-flex items-center justify-center h-6 w-6 rounded-full"
                :class="
                  item.group !== 'Unassigned'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-gray-100 text-gray-400'
                "
              >
                <svg
                  v-if="item.group !== 'Unassigned'"
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
