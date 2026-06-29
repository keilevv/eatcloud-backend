export interface MapLayerDto {
  id: string;
  label: string;
  latitude: number;
  longitude: number;
  value: number;
  riskLevel: string;
  category: string;
}

export interface MarkerDto {
  id: string;
  label: string;
  latitude: number;
  longitude: number;
  category: string;
}

export interface HeatmapPointDto {
  latitude: number;
  longitude: number;
  intensity: number;
}
