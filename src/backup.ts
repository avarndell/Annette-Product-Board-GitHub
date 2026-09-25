import type { Product } from './products';

// Quotes a value when it contains characters that would break a CSV row.
function csvCell(value: unknown): string {
  const text = value == null ? '' : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function toCsv(products: Product[]): string {
  const columns = [...new Set(products.flatMap(Object.keys))];
  const rows = products.map((p) => columns.map((c) => csvCell(p[c])).join(','));
  return [columns.join(','), ...rows].join('\r\n');
}

export function downloadBackup(products: Product[]): void {
  // The leading BOM makes Excel read the file as UTF-8.
  const blob = new Blob(['﻿' + toCsv(products)], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `product-board-backup-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}
