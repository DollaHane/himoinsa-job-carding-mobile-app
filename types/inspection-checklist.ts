export interface InspectionChecklistItem {
  step: number
  description: string
}

export interface InspectionChecklistTemplate {
  id: number
  name: string
  items: Array<InspectionChecklistItem>
  created_at?: string
  updated_at?: string
}

export interface JobcardChecklistItem {
  step: number
  description: string
  checked: boolean | null
  notes: string
}

export interface JobcardInspectionChecklist {
  id: number
  jobcard_id: number
  template_name: string
  items: Array<JobcardChecklistItem>
  created_at?: string
  updated_at?: string
}
