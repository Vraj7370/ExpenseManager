import { Download, FileText } from 'lucide-react';
import { toast } from 'react-toastify';
import { downloadCsv, exportPdfReport } from '../utils/exportData';

export const ExportButtons = ({
  filename,
  csvRows,
  pdfTitle,
  pdfSubtitle,
  pdfHeaders,
  pdfRows,
  pdfSummaryLines = [],
  disabled = false,
}) => {
  const handleCsv = () => {
    if (!csvRows?.length) {
      toast.info('No data to export');
      return;
    }
    const ok = downloadCsv(filename, csvRows);
    if (ok) toast.success('CSV downloaded');
  };

  const handlePdf = () => {
    if (!pdfRows?.length) {
      toast.info('No data to export');
      return;
    }
    const ok = exportPdfReport({
      title: pdfTitle || filename,
      subtitle: pdfSubtitle,
      headers: pdfHeaders,
      rows: pdfRows,
      summaryLines: pdfSummaryLines,
    });
    if (ok) toast.success('Print dialog opened — choose Save as PDF or a printer');
    else toast.error('Could not open print dialog. Please try again.');
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={handleCsv}
        disabled={disabled}
        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50"
      >
        <Download size={16} />
        Export CSV
      </button>
      <button
        type="button"
        onClick={handlePdf}
        disabled={disabled}
        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md border border-primary-200 bg-primary-50 text-primary-800 hover:bg-primary-100 disabled:opacity-50"
      >
        <FileText size={16} />
        Export PDF
      </button>
    </div>
  );
};
