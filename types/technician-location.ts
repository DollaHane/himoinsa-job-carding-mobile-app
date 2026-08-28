export interface TechnicianLocation {
  technician_id: number;
  lat: number;
  lng: number;
  accuracy_meters?: number | null;
  source?: "web" | "mobile" | null;
  updated_at: string;
}

export interface JobcardEta {
  distance_meters: number;
  duration_seconds: number;
  eta_minutes: number;
  eta_at: string;
  polyline: string | null;
  technician_location: {
    lat: number;
    lng: number;
    updated_at: string | null;
  } | null;
  destination: { lat: number; lng: number };
}

export interface JobcardEtaResponse {
  data: JobcardEta | null;
  reason?: string | null;
}
