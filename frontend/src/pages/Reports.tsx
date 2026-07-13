import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, FileText, BarChart2, CheckCircle, ShieldAlert } from 'lucide-react';
import api from '../utils/api';

const Reports: React.FC = () => {
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingExcel, setDownloadingExcel] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const downloadReport = async (format: 'pdf' | 'excel') => {
    setMessage(null);
    if (format === 'pdf') setDownloadingPdf(true);
    else setDownloadingExcel(true);

    try {
      const url = `/api/admin/reports/bookings/${format}`;
      const responseType = 'blob';
      const res = await api.get(url, { responseType });

      const extension = format === 'pdf' ? 'pdf' : 'xlsx';
      const type = format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

      const file = new Blob([res.data], { type });
      const fileURL = URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = fileURL;
      link.setAttribute('download', `Bookings-Report-${new Date().toISOString().slice(0,10)}.${extension}`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      setMessage({ text: `${format.toUpperCase()} report downloaded successfully.`, type: 'success' });
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Failed to generate and download report.', type: 'error' });
    } finally {
      setDownloadingPdf(false);
      setDownloadingExcel(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 space-y-8">
      <Link
        to="/admin"
        className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
      </Link>

      <div className="glass-panel rounded-3xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden space-y-8">
        <div className="border-b border-slate-800/80 pb-4">
          <h1 className="text-2xl font-extrabold text-white font-outfit">Export Administrative Reports</h1>
          <p className="text-xs text-slate-400 mt-1">
            Download current reservation ledger, transactional bookings summary, and revenue statistics.
          </p>
        </div>

        {message && (
          <div className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 border ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
          }`}>
            {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
          {/* Card 1: PDF */}
          <div className="p-6 rounded-2xl border border-slate-900 bg-slate-950/40 flex flex-col justify-between space-y-4 hover:border-slate-800 transition-all">
            <div className="space-y-2">
              <FileText className="w-8 h-8 text-indigo-400" />
              <h3 className="font-bold text-sm text-slate-200">PDF Booking Summary</h3>
              <p className="text-slate-400 leading-relaxed">
                Generates a print-ready document detailing active registrations, event names, seat allocations, and gross pricing.
              </p>
            </div>

            <button
              onClick={() => downloadReport('pdf')}
              disabled={downloadingPdf}
              className="w-full flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-bold py-3 rounded-xl transition-all shadow-md active:scale-95"
            >
              {downloadingPdf ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Download className="w-4 h-4" /> Export as PDF
                </>
              )}
            </button>
          </div>

          {/* Card 2: Excel */}
          <div className="p-6 rounded-2xl border border-slate-900 bg-slate-950/40 flex flex-col justify-between space-y-4 hover:border-slate-800 transition-all">
            <div className="space-y-2">
              <BarChart2 className="w-8 h-8 text-cyan-400" />
              <h3 className="font-bold text-sm text-slate-200">Excel Transaction Ledger</h3>
              <p className="text-slate-400 leading-relaxed">
                Exports fully structured spreadsheet rows containing transaction IDs, timestamp metrics, email credentials, venues, and prices.
              </p>
            </div>

            <button
              onClick={() => downloadReport('excel')}
              disabled={downloadingExcel}
              className="w-full flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-bold py-3 rounded-xl transition-all shadow-md active:scale-95"
            >
              {downloadingExcel ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Download className="w-4 h-4" /> Export as Excel (xlsx)
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Reports;
