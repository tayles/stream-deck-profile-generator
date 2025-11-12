import type { HotkeyDescriptor } from '../types/types';
import type { CsvRow } from './csv-utils';
import { generateId } from './hotkey-utils';

/**
 * Group by pages and auto-generate pages based on the number of rows and columns. Named pages are first.
 *
 * Reserves space for navigation buttons in the bottom right corner:
 * - 2+ pages: reserves 1 space for Next button (last position on each page)
 * - 3+ pages: reserves 2 spaces for Previous and Next buttons (last 2 positions on each page)
 *
 * Named pages are also split across multiple pages if they exceed the effective page size.
 */
export function groupByPage(
  data: CsvRow[],
  rows: number,
  cols: number,
): Record<string, HotkeyDescriptor[]> {
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

  // Calculate total number of pages needed (both named and unnamed)
  // First pass: estimate without navigation buttons
  let estimatedNamedPages = 0;
  for (const pageRows of Object.values(namedRows)) {
    estimatedNamedPages += Math.ceil(pageRows.length / totalPageSize);
  }
  const estimatedUnnamedPages = Math.ceil(unnamedRows.length / totalPageSize);
  const estimatedTotalPages = estimatedNamedPages + estimatedUnnamedPages;

  // Determine effective page size based on total pages
  let effectivePageSize = totalPageSize;
  if (estimatedTotalPages >= 3) {
    effectivePageSize = totalPageSize - 2;
  } else if (estimatedTotalPages >= 2) {
    effectivePageSize = totalPageSize - 1;
  }

  // Recalculate actual total pages with effective page size
  let actualNamedPages = 0;
  for (const pageRows of Object.values(namedRows)) {
    actualNamedPages += Math.ceil(pageRows.length / effectivePageSize);
  }
  const actualUnnamedPages = Math.ceil(unnamedRows.length / effectivePageSize);
  const actualTotalPages = actualNamedPages + actualUnnamedPages;

  // Adjust effective page size based on actual total page count
  if (actualTotalPages >= 3) {
    effectivePageSize = totalPageSize - 2;
  } else if (actualTotalPages >= 2) {
    effectivePageSize = totalPageSize - 1;
  } else {
    effectivePageSize = totalPageSize;
  }

  // Process named pages with effective page size (split if necessary)
  let globalIndex = 0;
  for (const [pageName, pageRows] of Object.entries(namedRows)) {
    // If the named page fits in one page
    if (pageRows.length <= effectivePageSize) {
      pages[pageName] = pageRows.map(row => ({
        id: row.id || generateId(row.label),
        label: row.label,
        hotkey: row.hotkey,
        color: row.color,
        index: globalIndex++,
      }));
    } else {
      // Split named page across multiple pages
      let subPageNum = 1;
      for (let i = 0; i < pageRows.length; i += effectivePageSize) {
        const subPageRows = pageRows.slice(i, i + effectivePageSize);
        const subPageName = `${pageName} ${subPageNum}`;

        pages[subPageName] = subPageRows.map(row => ({
          id: row.id || generateId(row.label),
          label: row.label,
          hotkey: row.hotkey,
          color: row.color,
          index: globalIndex++,
        }));

        subPageNum++;
      }
    }
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
