import type { AnalysisResult } from "@/types";

export const downloadCSV = (results: AnalysisResult[]) => {
  if (results.length === 0) return;

  const headers = ["No", "Nama Placemark", "Grup ID", "Latitude", "Longitude"];
  const rows = results.map((item, idx) => [
    idx + 1,
    `"${item.name}"`,
    `"${item.group}"`,
    item.coordinates[1],
    item.coordinates[0],
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `hasil_grouper_${new Date().toISOString().slice(0, 10)}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
