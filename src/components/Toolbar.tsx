import React from 'react';
import { ChartType, PaletteName } from '../types/chart';
import { PRESET_DATASETS, COLOR_PALETTES } from '../utils/presets';
import {
  AreaChart,
  LineChart,
  BarChart3,
  CandlestickChart,
  Radar,
  PieChart,
  Flame,
  Gauge,
  Sun,
  Moon,
  RotateCcw,
  SlidersHorizontal,
  Layers,
} from 'lucide-react';

interface ToolbarProps {
  currentChartType: ChartType;
  onSelectChartType: (type: ChartType) => void;
  selectedPresetId: string;
  onSelectPreset: (presetId: string) => void;
  palette: PaletteName;
  onSelectPalette: (palette: PaletteName) => void;
  themeMode: 'dark' | 'light';
  onToggleTheme: () => void;
  onResetZoom: () => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  currentChartType,
  onSelectChartType,
  selectedPresetId,
  onSelectPreset,
  palette,
  onSelectPalette,
  themeMode,
  onToggleTheme,
  onResetZoom,
  isSidebarOpen,
  onToggleSidebar,
}) => {
  const chartTypes: { type: ChartType; label: string; icon: React.ReactNode }[] = [
    { type: 'area', label: 'Area', icon: <AreaChart className="w-3.5 h-3.5" /> },
    { type: 'line', label: 'Line', icon: <LineChart className="w-3.5 h-3.5" /> },
    { type: 'bar', label: 'Column / Bar', icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { type: 'mixed', label: 'Mixed Combo', icon: <Layers className="w-3.5 h-3.5" /> },
    { type: 'candlestick', label: 'Candlestick', icon: <CandlestickChart className="w-3.5 h-3.5" /> },
    { type: 'heatmap', label: 'Heatmap', icon: <Flame className="w-3.5 h-3.5" /> },
    { type: 'radar', label: 'Radar', icon: <Radar className="w-3.5 h-3.5" /> },
    { type: 'radialBar', label: 'Radial Gauge', icon: <Gauge className="w-3.5 h-3.5" /> },
    { type: 'donut', label: 'Donut', icon: <PieChart className="w-3.5 h-3.5" /> },
  ];

  const palettes: { key: PaletteName; label: string; colors: string[] }[] = [
    { key: 'classic', label: 'Apex Classic', colors: COLOR_PALETTES.classic },
    { key: 'emerald', label: 'Emerald Tech', colors: COLOR_PALETTES.emerald },
    { key: 'cyberpunk', label: 'Cyberpunk', colors: COLOR_PALETTES.cyberpunk },
    { key: 'bloomberg', label: 'Bloomberg Fin', colors: COLOR_PALETTES.bloomberg },
    { key: 'nordic', label: 'Nordic Clean', colors: COLOR_PALETTES.nordic },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 bg-slate-900 border-b border-slate-800 text-xs">
      {/* Left zone: Chart Types & Preset Switcher */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Dataset Preset selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="preset-select" className="text-slate-400 font-medium whitespace-nowrap">
            Dataset:
          </label>
          <select
            id="preset-select"
            value={selectedPresetId}
            onChange={(e) => onSelectPreset(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 font-medium cursor-pointer"
          >
            {PRESET_DATASETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.category})
              </option>
            ))}
          </select>
        </div>

        <div className="h-4 w-px bg-slate-800 hidden sm:block" />

        {/* Chart Type Segmented Controls */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 overflow-x-auto max-w-full">
          {chartTypes.map((ct) => {
            const isActive = currentChartType === ct.type;
            return (
              <button
                key={ct.type}
                onClick={() => onSelectChartType(ct.type)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white font-medium shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
                title={`Switch to ${ct.label} chart`}
              >
                {ct.icon}
                <span>{ct.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right zone: Palette, Theme, Controls toggle */}
      <div className="flex items-center gap-2.5 ml-auto">
        {/* Palette selector */}
        <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1">
          <span className="text-slate-400 text-[11px]">Theme:</span>
          <select
            value={palette}
            onChange={(e) => onSelectPalette(e.target.value as PaletteName)}
            className="bg-transparent text-slate-300 focus:outline-none cursor-pointer font-medium text-[11px]"
          >
            {palettes.map((pal) => (
              <option key={pal.key} value={pal.key} className="bg-slate-900 text-slate-200">
                {pal.label}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-0.5 ml-1">
            {COLOR_PALETTES[palette].slice(0, 3).map((c, i) => (
              <span
                key={i}
                className="w-2.5 h-2.5 rounded-full inline-block"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        {/* Dark/Light mode toggle */}
        <button
          onClick={onToggleTheme}
          className="p-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg transition-colors"
          title={`Switch to ${themeMode === 'dark' ? 'Light' : 'Dark'} mode`}
        >
          {themeMode === 'dark' ? (
            <Sun className="w-3.5 h-3.5 text-amber-400" />
          ) : (
            <Moon className="w-3.5 h-3.5 text-indigo-400" />
          )}
        </button>

        {/* Reset zoom */}
        <button
          onClick={onResetZoom}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg transition-colors whitespace-nowrap"
          title="Reset chart zoom to default"
        >
          <RotateCcw className="w-3 h-3 text-slate-400" />
          <span>Reset Zoom</span>
        </button>

        {/* Toggle studio customization drawer */}
        <button
          onClick={onToggleSidebar}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors whitespace-nowrap ${
            isSidebarOpen
              ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300 font-medium'
              : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Chart Studio</span>
        </button>
      </div>
    </div>
  );
};
