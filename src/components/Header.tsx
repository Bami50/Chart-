import React, { useState } from 'react';
import { Download, ChevronDown, FileText, Image as ImageIcon, Code2, RefreshCw } from 'lucide-react';

export type ActiveView = 'studio' | 'sync' | 'streaming' | 'data' | 'code';

interface HeaderProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  onExportPNG: () => void;
  onExportSVG: () => void;
  onExportCSV: () => void;
  onExportJSON: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  onExportPNG,
  onExportSVG,
  onExportCSV,
  onExportJSON,
}) => {
  const [exportOpen, setExportOpen] = useState(false);

  return (
    <header className="flex items-center justify-between gap-8 px-6 py-4 border-b border-slate-800 bg-slate-950/90 backdrop-blur sticky top-0 z-30">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-sm shadow-indigo-500/30">
          ▲
        </div>
        <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
          ApexStudio
        </span>
      </div>

      {/* Zone 2: 4-5 clean single-line navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
        <button
          onClick={() => setActiveView('studio')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            activeView === 'studio' ? 'text-white border-b-2 border-indigo-500 font-semibold' : ''
          }`}
        >
          Studio Designer
        </button>
        <button
          onClick={() => setActiveView('sync')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            activeView === 'sync' ? 'text-white border-b-2 border-indigo-500 font-semibold' : ''
          }`}
        >
          Synchronized Hub
        </button>
        <button
          onClick={() => setActiveView('streaming')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            activeView === 'streaming' ? 'text-white border-b-2 border-indigo-500 font-semibold' : ''
          }`}
        >
          Real-Time Stream
        </button>
        <button
          onClick={() => setActiveView('data')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            activeView === 'data' ? 'text-white border-b-2 border-indigo-500 font-semibold' : ''
          }`}
        >
          Dataset Editor
        </button>
        <button
          onClick={() => setActiveView('code')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            activeView === 'code' ? 'text-white border-b-2 border-indigo-500 font-semibold' : ''
          }`}
        >
          Code Export
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="relative shrink-0">
        <button
          onClick={() => setExportOpen(!exportOpen)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-600/30 transition-all whitespace-nowrap shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Options</span>
          <ChevronDown className="w-3 h-3 opacity-80" />
        </button>

        {exportOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setExportOpen(false)}
            />
            <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-xl shadow-black/50 py-1.5 z-50 text-xs">
              <button
                onClick={() => {
                  onExportPNG();
                  setExportOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2 transition-colors"
              >
                <ImageIcon className="w-4 h-4 text-indigo-400" />
                <span>Export as Image (PNG)</span>
              </button>
              <button
                onClick={() => {
                  onExportSVG();
                  setExportOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2 transition-colors"
              >
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span>Export Vector (SVG)</span>
              </button>
              <div className="my-1 border-t border-slate-800" />
              <button
                onClick={() => {
                  onExportCSV();
                  setExportOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2 transition-colors"
              >
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Export Data (CSV)</span>
              </button>
              <button
                onClick={() => {
                  onExportJSON();
                  setExportOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2 transition-colors"
              >
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Export Config (JSON)</span>
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
};
