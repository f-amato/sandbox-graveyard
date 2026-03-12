export type CompanyStatus =
  | "acquired"
  | "ipo"
  | "active"
  | "shutdown"
  | "unknown";

export type CompanySource = "rsac" | "yc" | "both";

export interface Company {
  id: string;
  name: string;
  year: number;
  winner: boolean;
  description: string;
  status: CompanyStatus;
  category: string;
  source: CompanySource;
  ycBatch?: string;
  founded?: number;
  acquisitionDetails?: string;
  acquisitionPrice?: string;
  yearAcquired?: number;
  ipoDetails?: string;
  shutdownDetails?: string;
  notes?: string;
  website?: string;
  lessonLearned?: string;
  totalFunding?: string;
  fundingRounds?: string;
  keyInvestors?: string[];
  bootstrapped?: boolean;
}

export const SOURCE_LABELS: Record<CompanySource, string> = {
  rsac: "RSAC ISB",
  yc: "Y Combinator",
  both: "RSAC + YC",
};

export const SOURCE_COLORS: Record<CompanySource, string> = {
  rsac: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  yc: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  both: "bg-pink-500/20 text-pink-400 border-pink-500/30",
};

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
