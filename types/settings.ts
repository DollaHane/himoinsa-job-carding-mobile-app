export interface InspectionTaskTemplate {
  task_step: number;
  description: string;
  duration: number;
}

export interface SettingEntry {
  slug: string;
  value: string;
  title?: string;
  description?: string | null;
  id?: number;
}

export type AppSettings = Record<string, string>;
