import React, { useState } from 'react';
import { ChartSeriesItem } from '../types/chart';
import { Table, Plus, Trash2, Shuffle, Download, Upload, Check, AlertCircle } from 'lucide-react';

interface DataTableModalProps {
  categories: string[] | undefined;
  series: ChartSeriesItem[];
  onUpdateData: (categories: string[] | undefined, series: ChartSeriesItem[]) => void;
  onRandomizeData: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const DataTableModal: React.FC<DataTableModalProps> = ({
  categories = [],
  series,
  onUpdateData,
  onRandomizeData,
}) => {
  const [newCategoryLabel, setNewCategoryLabel] = useState('');
  const [importText, setImportText] = useState('');
  const [showImport, setShowImport] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  // Check if series is numeric arrays or OHLC objects
  const isOHLC = series.length > 0 && Array.isArray(series[0].data) && typeof series[0].data[0] === 'object' && series[0].data[0]?.y;

  const handleCellChange = (seriesIndex: number, dataIndex: number, valStr: string) => {
    const val = parseFloat(valStr);
    if (isNaN(val)) return;

    const newSeries = series.map((s, sIdx) => {
      if (sIdx !== seriesIndex) return s;
      const newData = [...s.data];
      if (typeof newData[dataIndex] === 'object' && newData[dataIndex]?.y) {
        // OHLC close price update
        const current = newData[dataIndex];
        const newY = Array.isArray(current.y) ? [...current.y] : current.y;
        if (Array.isArray(newY)) {
          newY[3] = val; // update close
        }
        newData[dataIndex] = { ...current, y: newY };
      } else {
        newData[dataIndex] = val;
      }
      return { ...s, data: newData };
    });

    onUpdateData(categories, newSeries);
  };

  const handleCategoryChange = (catIndex: number, newName: string) => {
    if (!categories) return;
    const newCats = [...categories];
    newCats[catIndex] = newName;
    onUpdateData(newCats, series);
  };

  const handleAddRow = (e: React.FormEvent) => {
    e.preventDefault();
    const label = newCategoryLabel.trim() || `Point ${categories ? categories.length + 1 : 1}`;
    const newCats = categories ? [...categories, label] : undefined;

    const newSeries = series.map((s) => {
      const lastVal = s.data.length > 0 ? (typeof s.data[s.data.length - 1] === 'number' ? s.data[s.data.length - 1] : 100) : 100;
      const variation = Math.round((Math.random() * 20 - 10) * 10) / 10;
      const newVal = Math.max(10, Math.round((lastVal + variation) * 10) / 10);
      return {
        ...s,
        data: [...s.data, newVal],
      };
    });

    onUpdateData(newCats, newSeries);
    setNewCategoryLabel('');
  };

  const handleDeleteRow = (index: number) => {
    const newCats = categories ? categories.filter((_, i) => i !== index) : undefined;
    const newSeries = series.map((s) => ({
      ...s,
      data: s.data.filter((_, i) => i !== index),
    }));
    onUpdateData(newCats, newSeries);
  };

  const handleImportJSON = () => {
    setImportError(null);
    try {
      const parsed = JSON.parse(importText);
      if (Array.isArray(parsed.series)) {
        onUpdateData(parsed.categories || categories, parsed.series);
        setShowImport(false);
        setImportText('');
      } else if (Array.isArray(parsed)) {
        // assumed array of numbers or series
        onUpdateData(categories, [{ name: 'Imported Series', data: parsed }]);
        setShowImport(false);
        setImportText('');
      } else {
        setImportError('JSON must contain a "series" array: { series: [...] }');
      }
    } catch (err: any) {
      setImportError('Invalid JSON format: ' + err.message);
    }
  };

  const handleExportCSV = () => {
    let csv = '';
    const headers = ['Category / Time', ...series.map((s) => `"${s.name}"`)];
    csv += headers.join(',') + '\n';

    const rowCount = Math.max(
      categories?.length || 0,
      ...series.map((s) => s.data.length)
    );

    for (let i = 0; i < rowCount; i++) {
      const cat = categories && categories[i] ? `"${categories[i]}"` : `Row ${i + 1}`;
      const vals = series.map((s) => {
        const item = s.data[i];
        if (typeof item === 'object' && item?.y) {
          return Array.isArray(item.y) ? item.y.join(';') : item.y;
        }
        return item ?? '';
      });
      csv += [cat, ...vals].join(',') + '\n';
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'apex_chart_dataset.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4 text-xs">
      {/* Table Header and Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Table className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-semibold text-white">Interactive Dataset Table</h3>
          <span className="text-slate-500 text-[11px]">
            {series.length} series · {categories?.length || series[0]?.data.length || 0} rows
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRandomizeData}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg transition-colors"
            title="Randomize series with realistic mathematical jitter"
          >
            <Shuffle className="w-3.5 h-3.5 text-amber-400" />
            <span>Jitter Values</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setShowImport(!showImport)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span>Import Data</span>
          </button>
        </div>
      </div>

      {/* Import Drawer */}
      {showImport && (
        <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-200">Paste JSON or Series Array:</span>
            <button
              onClick={() => setShowImport(false)}
              className="text-slate-500 hover:text-slate-300 text-[11px]"
            >
              Cancel
            </button>
          </div>
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder='{ "categories": ["Q1", "Q2", "Q3"], "series": [{ "name": "Growth", "data": [45, 68, 89] }] }'
            rows={4}
            className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-slate-200 font-mono text-[11px] focus:outline-none focus:border-indigo-500"
          />
          {importError && (
            <div className="flex items-center gap-1.5 text-rose-400 text-[11px]">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{importError}</span>
            </div>
          )}
          <div className="flex justify-end">
            <button
              onClick={handleImportJSON}
              className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium text-xs transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply Dataset</span>
            </button>
          </div>
        </div>
      )}

      {/* Data Grid Table */}
      <div className="overflow-x-auto max-h-96 border border-slate-800 rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-950 text-slate-400 sticky top-0 z-10 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-800">
            <tr>
              <th className="py-2.5 px-3 border-r border-slate-800 w-12 text-center">#</th>
              <th className="py-2.5 px-3 border-r border-slate-800 min-w-32">Label / Date</th>
              {series.map((s, idx) => (
                <th key={idx} className="py-2.5 px-3 border-r border-slate-800 text-right min-w-28">
                  {s.name}
                </th>
              ))}
              <th className="py-2.5 px-3 w-16 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-[11px] tabular-nums">
            {categories && categories.length > 0 ? (
              categories.map((cat, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2 px-3 text-center text-slate-500 border-r border-slate-800">
                    {rowIdx + 1}
                  </td>
                  <td className="py-2 px-3 border-r border-slate-800 font-sans">
                    <input
                      type="text"
                      value={cat}
                      onChange={(e) => handleCategoryChange(rowIdx, e.target.value)}
                      className="bg-transparent text-slate-200 border-b border-transparent hover:border-slate-700 focus:border-indigo-500 focus:bg-slate-950 focus:outline-none w-full px-1"
                    />
                  </td>
                  {series.map((s, sIdx) => {
                    const rawVal = s.data[rowIdx];
                    const displayVal =
                      typeof rawVal === 'object' && rawVal?.y
                        ? Array.isArray(rawVal.y)
                          ? rawVal.y[3] // Close price
                          : rawVal.y
                        : rawVal ?? 0;

                    return (
                      <td key={sIdx} className="py-2 px-3 text-right border-r border-slate-800">
                        <input
                          type="number"
                          step="any"
                          value={displayVal}
                          onChange={(e) => handleCellChange(sIdx, rowIdx, e.target.value)}
                          className="bg-transparent text-slate-200 text-right border-b border-transparent hover:border-slate-700 focus:border-indigo-500 focus:bg-slate-950 focus:outline-none w-24 px-1"
                        />
                      </td>
                    );
                  })}
                  <td className="py-2 px-3 text-center">
                    <button
                      onClick={() => handleDeleteRow(rowIdx)}
                      className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                      title="Delete row"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              // When categories are implicit, use series[0].data length
              (series[0]?.data || []).map((point: any, rowIdx: number) => {
                const label = typeof point === 'object' && point?.x ? String(point.x) : `Point ${rowIdx + 1}`;
                return (
                  <tr key={rowIdx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2 px-3 text-center text-slate-500 border-r border-slate-800">
                      {rowIdx + 1}
                    </td>
                    <td className="py-2 px-3 border-r border-slate-800 font-sans text-slate-300">
                      {label}
                    </td>
                    {series.map((s, sIdx) => {
                      const rawVal = s.data[rowIdx];
                      const displayVal =
                        typeof rawVal === 'object' && rawVal?.y
                          ? Array.isArray(rawVal.y)
                            ? `[${rawVal.y.join(', ')}]`
                            : rawVal.y
                          : rawVal ?? 0;

                      return (
                        <td key={sIdx} className="py-2 px-3 text-right border-r border-slate-800">
                          {typeof displayVal === 'number' ? (
                            <input
                              type="number"
                              step="any"
                              value={displayVal}
                              onChange={(e) => handleCellChange(sIdx, rowIdx, e.target.value)}
                              className="bg-transparent text-slate-200 text-right border-b border-transparent hover:border-slate-700 focus:border-indigo-500 focus:bg-slate-950 focus:outline-none w-24 px-1"
                            />
                          ) : (
                            <span className="text-slate-300">{displayVal}</span>
                          )}
                        </td>
                      );
                    })}
                    <td className="py-2 px-3 text-center">
                      <button
                        onClick={() => handleDeleteRow(rowIdx)}
                        className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                        title="Delete row"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add new data row form */}
      <form onSubmit={handleAddRow} className="flex items-center gap-2 pt-2">
        <input
          type="text"
          placeholder="New label / period (e.g. 'Next Month')"
          value={newCategoryLabel}
          onChange={(e) => setNewCategoryLabel(e.target.value)}
          className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
        />
        <button
          type="submit"
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium rounded-lg transition-colors whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Data Row</span>
        </button>
      </form>
    </div>
  );
};
