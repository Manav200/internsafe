export type RiskLevel = 'low' | 'medium' | 'high';
export type WorkMode = 'all' | 'wfh' | 'offline' | 'hybrid';
export type CompensationType = 'all' | 'paid' | 'unpaid';

export interface RiskFlag {
  id: string;
  label: string;
  explanation: string;
  severity: RiskLevel;
}

export interface VerificationDetails {
  hasCorporateEmail: boolean;
  recruiterEmail: string;
  hasWebsite: boolean;
  websiteUrl?: string;
  hasLinkedIn: boolean;
  linkedInUrl?: string;
  communicationChannel: 'Official Portal' | 'Corporate Email' | 'WhatsApp / Telegram' | 'Direct Unverified Email';
  asksUpfrontFee: boolean;
  feeAmount?: string;
  urgencyPressure: boolean;
  descriptionClarity: 'detailed' | 'moderate' | 'vague';
}

export interface Internship {
  id: string;
  title: string;
  company: string;
  companyLogoBg: string;
  location: string;
  workMode: 'wfh' | 'offline' | 'hybrid';
  compensationType: 'paid' | 'unpaid';
  stipend: string;
  duration: string;
  requiredSkills: string[];
  description: string;
  responsibilities: string[];
  deadline: string;
  postedDate: string;
  applicantsCount: number;
  
  // Verification & Risk
  verification: VerificationDetails;
  riskScore: RiskLevel;
  riskSummary: string;
  triggeredFlags: RiskFlag[];
  safeHighlights: string[];
}

export interface FilterState {
  searchQuery: string;
  locationQuery: string;
  workMode: WorkMode;
  compensation: CompensationType;
  riskLevel: 'all' | RiskLevel;
  selectedSkill?: string;
  sortBy?: 'default' | 'skillMatch' | 'deadline';
}

export type ApplicationStatus = 'Saved' | 'Applied' | 'Interview' | 'Offer' | 'Rejected';

export interface ApplicationRecord {
  id: string;
  internshipId: string;
  status: ApplicationStatus;
  appliedDate?: string;
  deadline: string;
  notes?: string;
  updatedAt: string;
}

export interface ListingReport {
  id: string;
  internshipId: string;
  internshipTitle: string;
  company: string;
  reason: string;
  details?: string;
  reporterEmail?: string;
  reportedAt: string;
}

export interface ResumeEducation {
  degree: string;
  school: string;
  year?: string;
}

export interface ResumeProject {
  title: string;
  description: string;
  techStack?: string[];
}

export interface ResumeExperience {
  role: string;
  company: string;
  duration?: string;
  highlights?: string[];
}

export interface ResumeParsedData {
  skills: string[];
  education: ResumeEducation[];
  projects: ResumeProject[];
  experience: ResumeExperience[];
  summary?: string;
  extractedAt: string;
  fileName?: string;
}

export interface SkillGapOpportunity {
  skill: string;
  count: number;
  unlockedInternshipTitles: string[];
}

