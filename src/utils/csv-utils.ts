import { parse } from 'csv-parse/sync';

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
      trim: false,
      relax_quotes: true,
    });
  } catch (error) {
    throw new Error(
      `Failed to parse CSV: ${error instanceof Error ? error.message : String(error)}`,
    );
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
      hotkey: record.hotkey?.trim() || record.hotkey,
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
    // allow single space for hotkey
    if (!row.hotkey && row.hotkey !== ' ') {
      throw new Error(`Line ${i + 2}: Hotkey is required`);
    }
    if (!row.label) {
      throw new Error(`Line ${i + 2}: Label is required`);
    }

    rows.push(row);
  }

  return rows;
}
