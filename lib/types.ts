export interface LeadData {
  // Step 1
  fullName: string;
  email: string;
  phone: string;
  // Step 2
  institutionType: string;
  serviceName: string;
  legalQuality: string;
  // Step 3
  caseSubjects: string[];
  caseDescription: string;
  acceptedConfidentiality: boolean;
  // Meta
  createdAt?: string;
  id?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export type TriageStep = 1 | 2 | 3;
