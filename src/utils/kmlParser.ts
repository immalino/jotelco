import JSZip from "jszip";
import * as turf from "@turf/turf";
import type { Feature, AnalysisResult } from "@/types";

export const parseKMZFile = async (file: File): Promise<string> => {
  const zip = new JSZip();
  const zipContent = await zip.loadAsync(file);

  const kmlFileName = Object.keys(zipContent.files).find((name) =>
    name.toLowerCase().endsWith(".kml")
  );

  if (!kmlFileName) {
    throw new Error("File .kml tidak ditemukan di dalam archive .kmz");
  }

  return await zipContent.file(kmlFileName)!.async("string");
};

export const parseXML = (kmlContent: string): Document => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(kmlContent, "text/xml");

  if (xmlDoc.querySelector("parsererror")) {
    throw new Error("Gagal memparsing struktur XML/KML.");
  }

  return xmlDoc;
};

export const extractGeometries = (
  xmlDoc: Document,
  targetFolderName: string,
  geometryType: "Point" | "Polygon"
): Feature[] => {
  const features: Feature[] = [];

  const folders = xmlDoc.getElementsByTagName("Folder");
  let targetFolder: Element | null = null;

  for (let i = 0; i < folders.length; i++) {
    const nameTag = folders[i]!.getElementsByTagName("name")[0];
    if (nameTag && nameTag.textContent?.trim().toLowerCase() === targetFolderName.toLowerCase()) {
      targetFolder = folders[i]!;
      break;
    }
  }

  if (!targetFolder) return [];

  const placemarks = targetFolder.getElementsByTagName("Placemark");

  for (let i = 0; i < placemarks.length; i++) {
    const pm = placemarks[i]!;
    const geomTag = pm.getElementsByTagName(geometryType)[0];

    if (geomTag) {
      const nameTag = pm.getElementsByTagName("name")[0];
      const name = nameTag ? nameTag.textContent?.trim() || "Unnamed" : "Unnamed";

      const coordsTag = geomTag.getElementsByTagName("coordinates")[0];
      if (coordsTag) {
        const coordsRaw = coordsTag.textContent?.trim() || "";

        if (geometryType === "Point") {
          const parts = coordsRaw.split(",");
          const lon = parseFloat(parts[0]!);
          const lat = parseFloat(parts[1]!);
          features.push({ name, coordinates: [lon, lat] });
        } else if (geometryType === "Polygon") {
          const coordPairs = coordsRaw.split(/\s+/);
          const polyCoords = coordPairs
            .map((pair) => {
              const parts = pair.split(",");
              if (parts.length >= 2) {
                return [parseFloat(parts[0]!), parseFloat(parts[1]!)];
              }
              return null;
            })
            .filter((c): c is number[] => c !== null);

          features.push({ name, coordinates: polyCoords });
        }
      }
    }
  }

  return features;
};

export const analyzePointInPolygon = (
  pointFeatures: Feature[],
  polygonFeatures: Feature[]
): AnalysisResult[] => {
  const analysisResults: AnalysisResult[] = [];

  pointFeatures.forEach((point) => {
    let assignedGroup = "Unassigned";

    const turfPoint = turf.point(point.coordinates as [number, number]);

    for (const poly of polygonFeatures) {
      try {
        const turfPoly = turf.polygon([poly.coordinates as number[][]]);

        if (turf.booleanPointInPolygon(turfPoint, turfPoly)) {
          assignedGroup = poly.name;
          break;
        }
      } catch (err) {
        console.warn("Gagal memproses polygon:", poly.name, err);
      }
    }

    analysisResults.push({
      name: point.name,
      coordinates: point.coordinates as number[],
      group: assignedGroup,
    });
  });

  return analysisResults;
};
