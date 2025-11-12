export interface FolderNames {
  points: string;
  polygons: string;
}

export interface Feature {
  name: string;
  coordinates: number[] | number[][];
}

export interface AnalysisResult {
  name: string;
  coordinates: number[];
  group: string;
}
