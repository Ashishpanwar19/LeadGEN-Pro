export interface Lead {
  id: string;
  companyName: string;
  domain: string;
  industry: string;
  employeeCount: number;
  techStack: string[];
  score: number;
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
  lastEnriched?: string;
  location?: string;
  description?: string;
  founded?: string;
  revenue?: string;
  contactEmail?: string;
  linkedinUrl?: string;
  generatedEmail?: string;
  generatedLinkedinMessage?: string;
  videoCallLink?: string;
}

export interface EnrichedData {
  companyName?: string;
  industry?: string;
  employeeCount?: number;
  techStack?: string[];
  description?: string;
  location?: string;
  founded?: string;
  revenue?: string;
  contactEmail?: string;
  linkedinUrl?: string;
}

export interface AIGeneratedContent {
  emailSubject: string;
  emailBody: string;
  linkedinMessage: string;
}

export interface LeadGenerationParams {
  industry: string;
  location: string;
  companySize: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  count: number;
}