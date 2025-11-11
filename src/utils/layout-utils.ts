import { generateId } from './hotkey-utils';
import type { HotkeyDescriptor } from "../types/types";
import type { CsvRow } from './csv-utils';

/**
 * Group by pages and auto-generate pages based on the number of rows and columns. Named pages are first.
 * 
 * Reserves space for navigation buttons in the bottom right corner:
 * - 2+ pages: reserves 1 space for Next button (last position on each page)
 * - 3+ pages: reserves 2 spaces for Previous and Next buttons (last 2 positions on each page)
 */
export function groupByPage(data: CsvRow[], rows: number, cols: number): Record<string, HotkeyDescriptor[]> {
  const totalPageSize = rows * cols;
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

  // Calculate how many pages we'll need for unnamed rows
  // We need to reserve space for navigation buttons
  let effectivePageSize = totalPageSize;
  
  // First pass: estimate number of pages without navigation buttons
  const estimatedPages = Math.ceil(unnamedRows.length / totalPageSize);
  
  if (estimatedPages >= 2) {
    // Reserve 1 space for Next button
    effectivePageSize = totalPageSize - 1;
  }
  if (estimatedPages >= 3) {
    // Reserve 2 spaces for Previous and Next buttons
    effectivePageSize = totalPageSize - 2;
  }
  
  // Recalculate actual number of pages with reduced page size
  const actualPages = Math.ceil(unnamedRows.length / effectivePageSize);
  
  // Adjust effective page size based on actual page count
  if (actualPages >= 3) {
    effectivePageSize = totalPageSize - 2;
  } else if (actualPages >= 2) {
    effectivePageSize = totalPageSize - 1;
  } else {
    effectivePageSize = totalPageSize;
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

  // Auto-generate pages for unnamed rows with reserved navigation button space
  let pageNum = 1;
  for (let i = 0; i < unnamedRows.length; i += effectivePageSize) {
    const pageRows = unnamedRows.slice(i, i + effectivePageSize);
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
