<script setup lang="ts">
import { ref } from "vue";

interface Props {
  selectedFile: File | null;
}

interface Emits {
  (e: "file-selected", file: File | null): void;
  (e: "error", message: string): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

const isDragging = ref(false);

const handleDrop = (e: DragEvent) => {
  isDragging.value = false;
  const files = e.dataTransfer?.files;
  if (files && files.length > 0) {
    processSelectedFile(files[0]!);
  }
};

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const files = target.files;
  if (files && files.length > 0) {
    processSelectedFile(files[0]!);
  }
};

const processSelectedFile = (file: File) => {
  if (!file.name.toLowerCase().endsWith(".kmz") && !file.name.toLowerCase().endsWith(".kml")) {
    emit("error", "Mohon upload file dengan format .kmz atau .kml");
    return;
  }
  emit("file-selected", file);
};

const removeFile = () => {
  emit("file-selected", null);
};
</script>

<template>
  <div
    class="border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 flex flex-col items-center justify-center h-full"
    :class="{
      'border-blue-500 bg-blue-50': isDragging,
      'border-slate-300 hover:border-slate-400': !isDragging,
    }"
    @dragover.prevent="isDragging = true"
    @dragleave.prevent="isDragging = false"
    @drop.prevent="handleDrop"
  >
    <div v-if="!selectedFile">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-12 w-12 text-slate-400 mx-auto mb-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
        />
      </svg>
      <p class="text-sm text-slate-600 font-medium">Drag & Drop file .KMZ di sini</p>
      <p class="text-xs text-slate-400 mt-1">atau</p>
      <label
        class="mt-3 inline-block px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer shadow-sm"
      >
        Pilih File
        <input type="file" class="hidden" accept=".kmz,.kml" @change="handleFileSelect" />
      </label>
    </div>
    <div v-else class="w-full">
      <div
        class="flex items-center justify-between bg-blue-50 p-3 rounded border border-blue-100 mb-3"
      >
        <div class="flex items-center overflow-hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-blue-500 mr-2 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span class="text-sm text-blue-700 font-medium truncate">{{ selectedFile.name }}</span>
        </div>
        <button @click="removeFile" class="text-blue-400 hover:text-red-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <p class="text-xs text-slate-500 text-left">Siap diproses.</p>
    </div>
  </div>
</template>
