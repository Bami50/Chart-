import React, { useState } from 'react';
import { Copy, Check, Code2, Download, Terminal } from 'lucide-react';

interface CodeExportModalProps {
  reactCode: string;
  vanillaCode: string;
}

export const CodeExportModal: React.FC<CodeExportModalProps> = ({
  reactCode,
  vanillaCode,
}) => {
  const [tab, setTab] = useState<'react' | 'vanilla'>('react');
  const [copied, setCopied] = useState<boolean>(false);

  const activeCode = tab === 'react' ? reactCode : vanillaCode;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCode = () => {
    const filename = tab === 'react' ? 'ApexChartComponent.tsx' : 'chart.html';
    const blob = new Blob([activeCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4 text-xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-semibold text-white">Runnable ApexCharts Code Generator</h3>
          <span className="text-slate-500 text-[11px]">Production-Ready Export</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Tab buttons */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setTab('react')}
              className={`px-3 py-1 rounded transition-colors ${
                tab === 'react'
                  ? 'bg-indigo-600 text-white font-medium'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              React (react-apexcharts)
            </button>
            <button
              onClick={() => setTab('vanilla')}
              className={`px-3 py-1 rounded transition-colors ${
                tab === 'vanilla'
                  ? 'bg-indigo-600 text-white font-medium'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Vanilla JavaScript
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-lg transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>

          <button
            onClick={handleDownloadCode}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download File</span>
          </button>
        </div>
      </div>

      {/* Code Display */}
      <div className="relative rounded-lg bg-slate-950 border border-slate-800/80 p-4 font-mono text-[11px] leading-relaxed overflow-x-auto max-h-[500px]">
        <div className="flex items-center gap-2 pb-2 mb-3 border-b border-slate-800/60 text-slate-400">
          <Terminal className="w-3.5 h-3.5 text-slate-500" />
          <span>{tab === 'react' ? 'ApexChartComponent.tsx' : 'apex-chart.html'}</span>
        </div>
        <pre className="text-slate-300">
          <code>{activeCode}</code>
        </pre>
      </div>

      <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-400 text-[11px] leading-relaxed">
        <strong className="text-slate-200">Installation Instructions:</strong>{' '}
        {tab === 'react' ? (
          <span>
            Run <code className="text-indigo-400">npm install apexcharts react-apexcharts</code> in your project, then import and render the component.
          </span>
        ) : (
          <span>
            Include the ApexCharts CDN script tag <code className="text-indigo-400">&lt;script src=&quot;https://cdn.jsdelivr.net/npm/apexcharts&quot;&gt;&lt;/script&gt;</code> before instantiating the chart.
          </span>
        )}
      </div>
    </div>
  );
};
