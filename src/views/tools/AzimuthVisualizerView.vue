<script setup lang="ts">
import { ref, reactive } from 'vue';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { createKMLString, type SiteData } from '../../utils/kmlGenerator';
import ErrorMessage from '../../components/ErrorMessage.vue';

// State untuk Mode
const activeTab = ref<'single' | 'batch'>('single');
const siteData = ref<SiteData[]>([]);
const isProcessing = ref(false);
const errorMessage = ref('');

// State untuk Single Site
const singleSite = reactive({
  Site_ID: '',
  Lat: '',
  Lon: '',
  Azim_S1: '',
  Azim_S2: '',
  Azim_S3: '',
  Radius_Meter: 500
});

// Logic: Download Template Excel
const downloadTemplate = () => {
  const headers = [['Site_ID', 'Lat', 'Lon', 'Azim_S1', 'Azim_S2', 'Azim_S3', 'Radius_Meter']];
  const exampleData = [['EXAMPLE_SITE', -7.799, 113.398, 90, 120, 240, 500]];
  const ws = XLSX.utils.aoa_to_sheet([...headers, ...exampleData]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Template");
  XLSX.writeFile(wb, "Template_Azimuth_Batch.xlsx");
};

const handleFileUpload = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (evt) => {
    try {
      const bstr = evt.target?.result;
      if (!bstr) return;

      const wb = XLSX.read(bstr, { type: 'binary' });
      const firstSheetName = wb.SheetNames[0];
    
      if (!firstSheetName) {
        errorMessage.value = "File Excel tidak memiliki sheet.";
        return;
      }

      const worksheet = wb.Sheets[firstSheetName];
      if (!worksheet) {
        errorMessage.value = "Sheet tidak ditemukan.";
        return;
      }

      const data = XLSX.utils.sheet_to_json(worksheet) as SiteData[];
      siteData.value = data;
      errorMessage.value = '';
    } catch (err) {
      errorMessage.value = "Gagal membaca file Excel.";
      console.error(err);
    }
  };

  reader.readAsBinaryString(file);
};

// Logic: Generate KMZ
const handleDownload = async () => {
  const dataToProcess = activeTab.value === 'single' ? [singleSite] : siteData.value;
  
  if (dataToProcess.length === 0 || (activeTab.value === 'single' && !singleSite.Site_ID)) {
    errorMessage.value = "Mohon isi data terlebih dahulu";
    return;
  }

  isProcessing.value = true;
  errorMessage.value = '';
  
  try {
    const kmlContent = createKMLString(dataToProcess);
    const zip = new JSZip();
    zip.file("doc.kml", kmlContent);
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `Azimuth_${activeTab.value}_${Date.now()}.kmz`);
  } catch (err) {
    errorMessage.value = "Gagal membuat file KMZ.";
    console.error(err);
  } finally {
    isProcessing.value = false;
  }
};
</script>

<template>
  <div class="bg-slate-50 text-slate-800 min-h-screen p-4 md:p-8">
    <div class="max-w-5xl mx-auto">
      <header class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-slate-900 mb-2">BTS Azimuth Visualizer</h1>
        <p class="text-slate-500">Generate Google Earth Azimuth with Dual-Beamwidth & Circle</p>
      </header>

      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <!-- Tabs -->
        <div class="flex border-b border-slate-100">
          <button 
            @click="activeTab = 'single'" 
            :class="activeTab === 'single' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'"
            class="flex-1 py-4 text-center font-semibold transition-all duration-200"
          >
            Single Site
          </button>
          <button 
            @click="activeTab = 'batch'" 
            :class="activeTab === 'batch' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'"
            class="flex-1 py-4 text-center font-semibold transition-all duration-200"
          >
            Batch Upload
          </button>
        </div>

        <div class="p-6 md:p-8">
          <!-- Single Site Form -->
          <div v-if="activeTab === 'single'" class="space-y-6">
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-700">Site ID</label>
              <input 
                v-model="singleSite.Site_ID" 
                type="text" 
                placeholder="e.g. JAW-JI-JMR-0012" 
                class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
              >
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-slate-700">Latitude</label>
                <input 
                  v-model="singleSite.Lat" 
                  type="number" 
                  placeholder="-7.799" 
                  class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                >
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-slate-700">Longitude</label>
                <input 
                  v-model="singleSite.Lon" 
                  type="number" 
                  placeholder="113.398" 
                  class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                >
              </div>
            </div>

            <div class="grid grid-cols-3 gap-4">
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-slate-700 text-center">Azimuth S1</label>
                <input 
                  v-model="singleSite.Azim_S1" 
                  type="number" 
                  class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-center"
                >
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-slate-700 text-center">Azimuth S2</label>
                <input 
                  v-model="singleSite.Azim_S2" 
                  type="number" 
                  class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-center"
                >
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-slate-700 text-center">Azimuth S3</label>
                <input 
                  v-model="singleSite.Azim_S3" 
                  type="number" 
                  class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-center"
                >
              </div>
            </div>
            
             <div class="space-y-2">
                <label class="block text-sm font-semibold text-slate-700 text-center">Radius (Meters)</label>
                <input 
                  v-model="singleSite.Radius_Meter" 
                  type="number" 
                  placeholder="500"
                  class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-center"
                >
              </div>
          </div>

          <!-- Batch Upload Form -->
          <div v-else class="space-y-8">
            <div class="flex justify-between items-center bg-blue-50 p-4 rounded-lg border border-blue-100">
              <p class="text-sm text-blue-700 italic">*Format file harus sesuai template</p>
              <button @click="downloadTemplate" class="text-blue-600 text-sm font-semibold hover:text-blue-800 hover:underline flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Template Excel
              </button>
            </div>

             <div class="relative border-2 border-dashed border-slate-300 rounded-xl p-12 text-center hover:bg-slate-50 transition-all cursor-pointer group">
              <input type="file" @change="handleFileUpload" accept=".xlsx,.csv" class="absolute inset-0 opacity-0 cursor-pointer z-10">
              <div class="space-y-4">
                <div class="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div class="text-slate-600">
                  <span class="block text-lg font-medium">Click to upload or drag and drop</span>
                  <p class="text-sm text-slate-400 mt-1">Excel (.xlsx) or CSV files</p>
                </div>
                <div v-if="siteData.length > 0" class="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  {{ siteData.length }} sites loaded
                </div>
              </div>
            </div>
          </div>

          <!-- Error Message -->
          <ErrorMessage v-if="errorMessage" :message="errorMessage" class="mt-6" />

          <!-- Action Button -->
          <button 
            @click="handleDownload" 
            :disabled="isProcessing"
            class="w-full mt-8 bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 shadow-lg hover:shadow-xl active:scale-95 transition-all disabled:bg-slate-300 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
          >
            <svg v-if="isProcessing" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span v-else>Download KMZ File</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
