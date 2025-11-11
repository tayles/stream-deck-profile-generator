import { parse } from 'csv-parse/sync';
import { generateId } from './hotkey-utils';
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
  if (!csv.trim()) {
    throw new Error('CSV file is empty');
  }

  let records: any[];
  
  try {
    records = parse(csv, {
      columns: (header: string[]) => {
        // Normalize headers to lowercase
        return header.map(h => h.trim().toLowerCase());
      },
      skip_empty_lines: true,
      trim: true,
      relax_quotes: true,
    });
  } catch (error) {
    throw new Error(`Failed to parse CSV: ${error instanceof Error ? error.message : String(error)}`);
  }

  if (records.length === 0) {
    throw new Error('CSV file is empty');
  }

  // Get headers from first record
  const firstRecord = records[0];
  const headers = Object.keys(firstRecord);

  // Validate required headers
  if (!headers.includes('hotkey')) {
    throw new Error('CSV must have a "Hotkey" column');
  }
  if (!headers.includes('label')) {
    throw new Error('CSV must have a "Label" column');
  }

  const rows: CsvRow[] = [];
  
  // Process each record
  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    
    const row: CsvRow = {
      hotkey: record.hotkey?.trim() || '',
      label: record.label?.trim() || '',
    };

    // Add optional fields if present and not empty
    if (record.id?.trim()) {
      row.id = record.id.trim();
    }
    if (record.page?.trim()) {
      row.page = record.page.trim();
    }
    if (record.color?.trim()) {
      row.color = record.color.trim();
    }

    // Validate required fields
    if (!row.hotkey) {
      throw new Error(`Line ${i + 2}: Hotkey is required`);
    }
    if (!row.label) {
      throw new Error(`Line ${i + 2}: Label is required`);
    }

    rows.push(row);
  }

  return rows;
}

/**
 * Group by pages and auto-generate pages based on the number of rows and columns. Named pages are first.
 */
export function groupByPage(data: CsvRow[], rows: number, cols: number): Record<string, HotkeyDescriptor[]> {
  const pageSize = rows * cols;
  const pages: Record<string, HotkeyDescriptor[]> = {};
  
  // First, group explicitly named pages
  const namedRows: Record<string, CsvRow[]> = {};
  const unnamedRows: CsvRow[] = [];
  
  for (const row of data) {
    if (row.page) {
      if (!namedRows[row.page]) {
        namedRows[row.page] = [];
      }
      namedRows[row.page]!.push(row);
    } else {
      unnamedRows.push(row);
    }
  }

  // Process named pages
  let globalIndex = 0;
  for (const [pageName, pageRows] of Object.entries(namedRows)) {
    pages[pageName] = pageRows.map(row => ({
      id: row.id || generateId(row.label),
      label: row.label,
      hotkey: row.hotkey,
      color: row.color,
      index: globalIndex++,
    }));
  }

  // Auto-generate pages for unnamed rows
  let pageNum = 1;
  for (let i = 0; i < unnamedRows.length; i += pageSize) {
    const pageRows = unnamedRows.slice(i, i + pageSize);
    const pageName = `Page ${pageNum}`;
    
    pages[pageName] = pageRows.map(row => ({
      id: row.id || generateId(row.label),
      label: row.label,
      hotkey: row.hotkey,
      color: row.color,
      index: globalIndex++,
    }));
    
    pageNum++;
  }

  return pages;
}
