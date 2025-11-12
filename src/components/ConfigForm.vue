<script setup lang="ts">
import type { FolderNames } from "@/types";

interface Props {
  folderNames: FolderNames;
  selectedFile: File | null;
  isProcessing: boolean;
}

interface Emits {
  (e: "update:folderNames", value: FolderNames): void;
  (e: "process"): void;
}

const emit = defineEmits<Emits>();

const updatePoints = (value: string) => {
  emit("update:folderNames", {
    ...props.folderNames,
    points: value,
  });
};

const updatePolygons = (value: string) => {
  emit("update:folderNames", {
    ...props.folderNames,
    polygons: value,
  });
};

const props = defineProps<Props>();
</script>

<template>
  <div class="flex flex-col justify-center space-y-5">
    <div>
      <label class="block text-sm font-medium text-slate-700 mb-1"
        >Nama Folder Placemark (Titik)</label
      >
      <input
        type="text"
        :value="folderNames.points"
        @input="updatePoints(($event.target as HTMLInputElement).value)"
        class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
        placeholder="Contoh: HP COVER LAMA"
      />
      <p class="text-xs text-slate-400 mt-1">Folder berisi titik lokasi yang akan dikelompokkan.</p>
    </div>

    <div>
      <label class="block text-sm font-medium text-slate-700 mb-1"
        >Nama Folder Polygon (Batas)</label
      >
      <input
        type="text"
        :value="folderNames.polygons"
        @input="updatePolygons(($event.target as HTMLInputElement).value)"
        class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
        placeholder="Contoh: BOUNDARY FAT"
      />
      <p class="text-xs text-slate-400 mt-1">Folder berisi area/batas poligon.</p>
    </div>

    <button
      @click="emit('process')"
      :disabled="!selectedFile || isProcessing"
      class="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed mt-2"
    >
      <span v-if="isProcessing" class="loader mr-2"></span>
      <span v-if="isProcessing">Memproses...</span>
      <span v-else>Proses File</span>
    </button>
  </div>
</template>
