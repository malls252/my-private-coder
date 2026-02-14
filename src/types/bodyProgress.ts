export interface WeightEntry {
  date: string; // ISO date string YYYY-MM-DD
  weight: number;
  notes?: string;
}

export interface PhotoEntry {
  date: string;
  front?: string; // base64 or URL
  side?: string;
  back?: string;
}

export interface BodyGoal {
  startWeight: number;
  startDate: string;
  targetWeight: number;
  targetDate: string;
}

export interface BodyProgress {
  weights: WeightEntry[];
  photos: PhotoEntry[];
  goal: BodyGoal | null;
}
