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
  const lines = csv.trim().split('\n').filter(line => line.trim());
  if (lines.length === 0) {
    throw new Error('CSV file is empty');
  }

  // Parse header row
  const headerLine = lines[0]!;
  const headers = headerLine.split(',').map(h => h.trim().toLowerCase());
  
  // Validate required headers
  if (!headers.includes('hotkey')) {
    throw new Error('CSV must have a "Hotkey" column');
  }
  if (!headers.includes('label')) {
    throw new Error('CSV must have a "Label" column');
  }

  const rows: CsvRow[] = [];
  
  // Parse data rows
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]!.trim();
    if (!line) continue;
    
    const values = parseCsvLine(line);
    if (values.length !== headers.length) {
      throw new Error(`Line ${i + 1}: Expected ${headers.length} columns, got ${values.length}`);
    }

    const row: CsvRow = {
      hotkey: '',
      label: '',
    };

    for (let j = 0; j < headers.length; j++) {
      const header = headers[j]!;
      const value = values[j]!.trim();
      
      switch (header) {
        case 'id':
          if (value) row.id = value;
          break;
        case 'hotkey':
          row.hotkey = value;
          break;
        case 'label':
          row.label = value;
          break;
        case 'page':
          if (value) row.page = value;
          break;
        case 'color':
          if (value) row.color = value;
          break;
      }
    }

    // Validate required fields
    if (!row.hotkey) {
      throw new Error(`Line ${i + 1}: Hotkey is required`);
    }
    if (!row.label) {
      throw new Error(`Line ${i + 1}: Label is required`);
    }

    rows.push(row);
  }

  return rows;
}

/**
 * Parse a CSV line handling quoted values with commas
 */
function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i]!;
    
    if (char === '"') {
      // Handle escaped quotes
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  values.push(current);
  return values;
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
