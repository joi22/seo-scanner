/**
 * In-memory store for scan results.
 * Each result is stored by a short random ID.
 * In production you'd swap this for Redis or a database.
 */

export interface ScanData {
  id: string;
  url: string;
  scannedAt: string;
  title: string;
  description: string;
  h1Count: number;
  h2Count: number;
  h3Count: number;
  topKeywords: { word: string; count: number }[];
  issues: Issue[];
  score: number;
}

export interface Issue {
  type: "error" | "warn" | "ok";
  label: string;
  detail?: string;
  impact: "high" | "medium" | "low";
}

// Simple in-process map (survives for the lifetime of the Node process)
const store = new Map<string, ScanData>();

export function saveResult(data: ScanData): void {
  store.set(data.id, data);
}

export function getResult(id: string): ScanData | undefined {
  return store.get(id);
}

/** Generate a short collision-resistant ID */
export function generateId(): string {
  return Math.random().toString(36).slice(2, 9);
}
