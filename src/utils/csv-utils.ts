import type { HotkeyDescriptor } from "../types/types";

export interface CsvRow {
  id?: string;
  hotkey: string;
  label: string;
  page?: string;
  color?: string;
}

/**
 * Parse a CSV file content into an array of CsvRow objects.
 * Header row can be in any order and is case insensitive.
 * Expected headers: Id, Hotkey, Label, Page, Color
 */
export function parseCsv(csv: string): CsvRow[] {
  return [];
}

/**
 * Group by pages and auto-generate pages based on the number of rows and columns. Named pages are first.
 */
export function groupByPage(data: CsvRow[], rows: number, cols: number): Record<string, HotkeyDescriptor[]> {
  return {};
}
