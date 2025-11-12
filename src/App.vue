<script setup lang="ts">
import { ref, reactive } from "vue";
import AppHeader from "./components/AppHeader.vue";
import FileUploader from "./components/FileUploader.vue";
import ConfigForm from "./components/ConfigForm.vue";
import ResultsTable from "./components/ResultsTable.vue";
import ErrorMessage from "./components/ErrorMessage.vue";
import Instructions from "./components/AppInstructions.vue";
import {
  parseKMZFile,
  parseXML,
  extractGeometries,
  analyzePointInPolygon,
} from "./utils/kmlParser";
import { downloadCSV } from "./utils/csvExport";
import type { FolderNames, AnalysisResult } from "./types";

const selectedFile = ref<File | null>(null);
const isProcessing = ref(false);
const errorMessage = ref("");
const folderNames = reactive<FolderNames>({
  points: "HP COVER",
  polygons: "BOUNDARY FAT",
});
const results = ref<AnalysisResult[]>([]);

const handleFileSelect = (file: File | null) => {
  selectedFile.value = file;
  results.value = [];
  errorMessage.value = "";
};

const handleError = (message: string) => {
  errorMessage.value = message;
};

const processFile = async () => {
  if (!selectedFile.value) return;

  isProcessing.value = true;
  errorMessage.value = "";
  results.value = [];

  try {
    let kmlContent = "";

    if (selectedFile.value.name.toLowerCase().endsWith(".kmz")) {
      kmlContent = await parseKMZFile(selectedFile.value);
    } else {
      kmlContent = await selectedFile.value.text();
    }

    const xmlDoc = parseXML(kmlContent);

    const polygonFeatures = extractGeometries(xmlDoc, folderNames.polygons, "Polygon");
    const pointFeatures = extractGeometries(xmlDoc, folderNames.points, "Point");

    if (polygonFeatures.length === 0) {
      throw new Error(`Tidak ditemukan polygon di dalam folder "${folderNames.polygons}"`);
    }
    if (pointFeatures.length === 0) {
      throw new Error(`Tidak ditemukan titik di dalam folder "${folderNames.points}"`);
    }

    console.log(`Ditemukan ${polygonFeatures.length} polygon dan ${pointFeatures.length} titik.`);

    const analysisResults = analyzePointInPolygon(pointFeatures, polygonFeatures);
    results.value = analysisResults;
  } catch (err) {
    console.error(err);
    errorMessage.value = "Terjadi kesalahan: " + (err as Error).message;
  } finally {
    isProcessing.value = false;
  }
};

const handleDownloadCSV = () => {
  downloadCSV(results.value);
};
</script>

<template>
  <div class="bg-slate-50 text-slate-800 min-h-screen p-4 md:p-8">
    <div class="max-w-5xl mx-auto">
      <AppHeader />

      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="p-6 md:p-8 border-b border-slate-100">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FileUploader
              :selected-file="selectedFile"
              @file-selected="handleFileSelect"
              @error="handleError"
            />

            <ConfigForm
              v-model:folder-names="folderNames"
              :selected-file="selectedFile"
              :is-processing="isProcessing"
              @process="processFile"
            />
          </div>

          <ErrorMessage v-if="errorMessage" :message="errorMessage" />
        </div>

        <ResultsTable v-if="results.length > 0" :results="results" @download="handleDownloadCSV" />

        <Instructions v-else-if="!selectedFile" />
      </div>
    </div>
  </div>
</template>
