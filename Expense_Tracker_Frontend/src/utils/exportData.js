const escapeCsvCell = (value) => {
  const str = String(value ?? '');
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

export const downloadCsv = (filename, rows) => {
  if (!rows?.length) return false;

  const csv = rows.map((row) => row.map(escapeCsvCell).join(',')).join('\n');
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(url);
  return true;
};

const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export const exportPdfReport = ({ title, subtitle, headers, rows, summaryLines = [] }) => {
  if (!rows?.length) return false;

  const tableHead = headers.map((h) => `<th>${escapeHtml(h)}</th>`).join('');
  const tableBody = rows
    .map(
      (row) =>
        `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`
    )
    .join('');

  const summaryHtml =
    summaryLines.length > 0
      ? `<ul class="summary">${summaryLines.map((line) => `<li>${escapeHtml(line)}</li>`).join('')}</ul>`
      : '';

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)}</title>
  <style>
    body { font-family: system-ui, sans-serif; padding: 24px; color: #1e293b; }
    h1 { font-size: 22px; margin: 0 0 8px; color: #326650; }
    p { margin: 0 0 20px; color: #64748b; font-size: 14px; }
    .summary { margin: 0 0 16px; padding-left: 20px; font-size: 14px; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th, td { border: 1px solid #e2e8f0; padding: 8px 10px; text-align: left; }
    th { background: #f1f5f9; font-weight: 600; }
    tr:nth-child(even) { background: #f8fafc; }
    @media print { body { padding: 12px; } }
  </style>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  <p>${escapeHtml(subtitle || '')} · Generated ${escapeHtml(new Date().toLocaleString('en-IN'))}</p>
  ${summaryHtml}
  <table>
    <thead><tr>${tableHead}</tr></thead>
    <tbody>${tableBody}</tbody>
  </table>
</body>
</html>`;

  try {
    const iframe = document.createElement('iframe');
    iframe.setAttribute('title', 'Print export');
    iframe.style.cssText =
      'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;';
    document.body.appendChild(iframe);

    let printed = false;

    const printFrame = () => {
      if (printed || !document.body.contains(iframe)) return;
      const frameWindow = iframe.contentWindow;
      if (!frameWindow) {
        iframe.remove();
        return;
      }
      printed = true;
      frameWindow.focus();
      frameWindow.print();
      setTimeout(() => iframe.remove(), 1000);
    };

    const frameDoc = iframe.contentWindow?.document;
    if (!frameDoc) {
      iframe.remove();
      return false;
    }

    frameDoc.open();
    frameDoc.write(html);
    frameDoc.close();

    iframe.onload = printFrame;
    setTimeout(printFrame, 350);

    return true;
  } catch {
    return false;
  }
};

export const formatRecordRowsForExport = (records, type = 'expense') => {
  const headers = ['Title', 'Description', 'Amount', 'Date', 'Category', 'Payment Mode'];
  const rows = records.map((r) => [
    r.title,
    r.description || '',
    type === 'expense' ? r.amount : r.income,
    new Date(r.expenseDate).toLocaleDateString('en-IN'),
    type === 'expense' ? r.expCat?.catName || '' : r.incomeCategory?.catName || '',
    r.paymentMode || '',
  ]);
  return { headers, rows };
};
