export type CompanyStatus =
  | "acquired"
  | "ipo"
  | "active"
  | "shutdown"
  | "unknown";

export interface Company {
  id: string;
  name: string;
  year: number;
  winner: boolean;
  description: string;
  status: CompanyStatus;
  category: string;
  founded?: number;
  acquisitionDetails?: string;
  ipoDetails?: string;
  shutdownDetails?: string;
  notes?: string;
  website?: string;
  lessonLearned?: string;
}

export const STATUS_LABELS: Record<CompanyStatus, string> = {
  acquired: "Acquired",
  ipo: "IPO",
  active: "Active",
  shutdown: "Shutdown",
  unknown: "Unknown",
};

export const STATUS_COLORS: Record<CompanyStatus, string> = {
  acquired: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  ipo: "bg-green-500/20 text-green-400 border-green-500/30",
  active: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  shutdown: "bg-red-500/20 text-red-400 border-red-500/30",
  unknown: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

export const CATEGORIES = [
  "AI Security",
  "Application Security",
  "Cloud Security",
  "Data Security",
  "Endpoint Security",
  "Identity & Access",
  "IoT / Hardware Security",
  "Network Security",
  "Privacy & Compliance",
  "Security Operations",
  "Threat Detection",
  "Vulnerability Management",
  "Other",
] as const;
