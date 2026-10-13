import React from 'react';
import {
  ChartCustomizationOptions,
  CurveStyle,
  FillType,
  YAxisAnnotation,
  XAxisAnnotation,
  PointAnnotation,
} from '../types/chart';
import {
  Sliders,
  TrendingUp,
  Activity,
  Layers,
  Sparkles,
  BookmarkPlus,
  Trash2,
  Plus,
} from 'lucide-react';

interface StudioControlsProps {
  options: ChartCustomizationOptions;
  setOptions: React.Dispatch<React.SetStateAction<ChartCustomizationOptions>>;
  annotations: {
    yAxis: YAxisAnnotation[];
    xAxis: XAxisAnnotation[];
    point: PointAnnotation[];
  };
  onAddYAnnotation: (y: number, label: string, color: string) => void;
  onRemoveYAnnotation: (id: string) => void;
  onAddXAnnotation: (x: string, label: string, color: string) => void;
  onRemoveXAnnotation: (id: string) => void;
  isCandlestickOrCategorical: boolean;
}

export const StudioControls: React.FC<StudioControlsProps> = ({
  options,
  setOptions,
  annotations,
  onAddYAnnotation,
  onRemoveYAnnotation,
  onAddXAnnotation,
  onRemoveXAnnotation,
  isCandlestickOrCategorical,
}) => {
  const [newYVal, setNewYVal] = React.useState<string>('150');
  const [newYLabel, setNewYLabel] = React.useState<string>('Threshold');
  const [newYColor, setNewYColor] = React.useState<string>('#EF4444');

  const [newXVal, setNewXVal] = React.useState<string>('');
  const [newXLabel, setNewXLabel] = React.useState<string>('Event Note');
  const [newXColor, setNewXColor] = React.useState<string>('#3B82F6');

  const handleCurveChange = (curve: CurveStyle) => {
    setOptions((prev) => ({ ...prev, curve }));
  };

  const handleFillChange = (fillType: FillType) => {
    setOptions((prev) => ({ ...prev, fillType }));
  };

  const handleAddY = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(newYVal);
    if (!isNaN(val) && newYLabel.trim()) {
      onAddYAnnotation(val, newYLabel.trim(), newYColor);
      setNewYLabel('Target Level');
    }
  };

  const handleAddX = (e: React.FormEvent) => {
    e.preventDefault();
    if (newXVal.trim() && newXLabel.trim()) {
      onAddXAnnotation(newXVal.trim(), newXLabel.trim(), newXColor);
      setNewXVal('');
    }
  };

  return (
    <div className="w-80 shrink-0 bg-slate-900 border-l border-slate-800 p-4 overflow-y-auto max-h-[calc(100vh-125px)] text-xs space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-indigo-400" />
          <h2 className="text-sm font-semibold text-white">Chart Customizer</h2>
        </div>
        <span className="text-[11px] text-slate-500">Live Engine</span>
      </div>

      {/* Advanced Statistical Overlays Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-slate-300 font-semibold">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          <span>Technical & Statistical Overlays</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Dynamic mathematical calculations computed across active series.
        </p>

        <div className="space-y-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
          <label className="flex items-center justify-between cursor-pointer text-slate-300 hover:text-white">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>7-Period SMA (Short-term)</span>
            </span>
            <input
              type="checkbox"
              checked={options.showSMA7}
              onChange={(e) => setOptions((p) => ({ ...p, showSMA7: e.target.checked }))}
              className="rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-0 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer text-slate-300 hover:text-white">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>20-Period SMA (Baseline)</span>
            </span>
            <input
              type="checkbox"
              checked={options.showSMA20}
              onChange={(e) => setOptions((p) => ({ ...p, showSMA20: e.target.checked }))}
              className="rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-0 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer text-slate-300 hover:text-white">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <span>Bollinger Bands (2σ Bands)</span>
            </span>
            <input
              type="checkbox"
              checked={options.showBollingerBands}
              onChange={(e) => setOptions((p) => ({ ...p, showBollingerBands: e.target.checked }))}
              className="rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-0 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer text-slate-300 hover:text-white">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span>Linear Regression Trendline</span>
            </span>
            <input
              type="checkbox"
              checked={options.showTrendline}
              onChange={(e) => setOptions((p) => ({ ...p, showTrendline: e.target.checked }))}
              className="rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-0 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer text-slate-300 hover:text-white">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Min / Max / Mean Level Lines</span>
            </span>
            <input
              type="checkbox"
              checked={options.showMinMaxLines}
              onChange={(e) => setOptions((p) => ({ ...p, showMinMaxLines: e.target.checked }))}
              className="rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-0 cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* Curve and Stroke Geometry */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-slate-300 font-semibold">
          <Activity className="w-3.5 h-3.5 text-indigo-400" />
          <span>Stroke & Line Geometry</span>
        </div>

        {/* Curve Mode */}
        <div className="space-y-1">
          <label className="text-slate-400 text-[11px]">Interpolation Curve</label>
          <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            {(['smooth', 'straight', 'stepline'] as CurveStyle[]).map((c) => (
              <button
                key={c}
                onClick={() => handleCurveChange(c)}
                className={`py-1 text-center rounded capitalize transition-colors ${
                  options.curve === c
                    ? 'bg-indigo-600 text-white font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Stroke Width */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>Stroke Width</span>
            <span className="font-mono text-slate-200">{options.strokeWidth}px</span>
          </div>
          <input
            type="range"
            min={1}
            max={6}
            step={1}
            value={options.strokeWidth}
            onChange={(e) =>
              setOptions((p) => ({ ...p, strokeWidth: parseInt(e.target.value) }))
            }
            className="w-full accent-indigo-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Fill Options */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-slate-300 font-semibold">
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          <span>Surface & Fill Styling</span>
        </div>

        <div className="space-y-1">
          <label className="text-slate-400 text-[11px]">Fill Type</label>
          <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            {(['gradient', 'solid', 'pattern'] as FillType[]).map((f) => (
              <button
                key={f}
                onClick={() => handleFillChange(f)}
                className={`py-1 text-center rounded capitalize transition-colors ${
                  options.fillType === f
                    ? 'bg-indigo-600 text-white font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Fill Opacity */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>Fill Opacity</span>
            <span className="font-mono text-slate-200">{Math.round(options.fillOpacity * 100)}%</span>
          </div>
          <input
            type="range"
            min={0.05}
            max={1}
            step={0.05}
            value={options.fillOpacity}
            onChange={(e) =>
              setOptions((p) => ({ ...p, fillOpacity: parseFloat(e.target.value) }))
            }
            className="w-full accent-indigo-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Axis & Display Elements */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-slate-300 font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Elements & Formatting</span>
        </div>

        <div className="space-y-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
          <label className="flex items-center justify-between cursor-pointer text-slate-300 hover:text-white">
            <span>Data Point Labels</span>
            <input
              type="checkbox"
              checked={options.showDataLabels}
              onChange={(e) =>
                setOptions((p) => ({ ...p, showDataLabels: e.target.checked }))
              }
              className="rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-0 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer text-slate-300 hover:text-white">
            <span>Point Markers</span>
            <input
              type="checkbox"
              checked={options.showMarkers}
              onChange={(e) =>
                setOptions((p) => ({ ...p, showMarkers: e.target.checked }))
              }
              className="rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-0 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer text-slate-300 hover:text-white">
            <span>Background Grid</span>
            <input
              type="checkbox"
              checked={options.showGrid}
              onChange={(e) =>
                setOptions((p) => ({ ...p, showGrid: e.target.checked }))
              }
              className="rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-0 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer text-slate-300 hover:text-white">
            <span>Dashed Gridlines</span>
            <input
              type="checkbox"
              checked={options.gridDashed}
              onChange={(e) =>
                setOptions((p) => ({ ...p, gridDashed: e.target.checked }))
              }
              className="rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-0 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer text-slate-300 hover:text-white">
            <span>Dual Y-Axis Scaling</span>
            <input
              type="checkbox"
              checked={options.dualYAxis}
              onChange={(e) =>
                setOptions((p) => ({ ...p, dualYAxis: e.target.checked }))
              }
              className="rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-0 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer text-slate-300 hover:text-white">
            <span>Synchronized Crosshairs</span>
            <input
              type="checkbox"
              checked={options.showTooltipCrosshairs}
              onChange={(e) =>
                setOptions((p) => ({ ...p, showTooltipCrosshairs: e.target.checked }))
              }
              className="rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-0 cursor-pointer"
            />
          </label>
        </div>

        {/* Legend Position */}
        <div className="space-y-1">
          <label className="text-slate-400 text-[11px]">Legend Alignment</label>
          <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            {(['top', 'bottom', 'right'] as const).map((pos) => (
              <button
                key={pos}
                onClick={() => setOptions((p) => ({ ...p, legendPosition: pos }))}
                className={`py-1 text-center rounded capitalize transition-colors ${
                  options.legendPosition === pos
                    ? 'bg-indigo-600 text-white font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {pos}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dynamic Annotations Studio */}
      <div className="space-y-3 pt-3 border-t border-slate-800">
        <div className="flex items-center gap-2 text-slate-300 font-semibold">
          <BookmarkPlus className="w-3.5 h-3.5 text-indigo-400" />
          <span>Chart Annotations Studio</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Inject threshold lines and event markers with custom alerts.
        </p>

        {/* Add Y-Axis Annotation Form */}
        <form onSubmit={handleAddY} className="space-y-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-300 block">
            Add Y-Axis Threshold Line
          </span>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Value (e.g. 200)"
              value={newYVal}
              onChange={(e) => setNewYVal(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 font-mono"
            />
            <input
              type="text"
              placeholder="Label"
              value={newYLabel}
              onChange={(e) => setNewYLabel(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 text-[10px]">Color:</span>
              <input
                type="color"
                value={newYColor}
                onChange={(e) => setNewYColor(e.target.value)}
                className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
              />
            </div>
            <button
              type="submit"
              className="flex items-center gap-1 px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium text-[11px] transition-colors"
            >
              <Plus className="w-3 h-3" />
              <span>Add Line</span>
            </button>
          </div>
        </form>

        {/* Current Annotations List */}
        <div className="space-y-1.5">
          <span className="text-[11px] text-slate-400 font-medium">Active Annotations</span>
          {annotations.yAxis.length === 0 && (
            <p className="text-[11px] text-slate-600 italic">No Y-axis annotations active.</p>
          )}
          {annotations.yAxis.map((ann) => (
            <div
              key={ann.id}
              className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800 text-[11px]"
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: ann.borderColor }}
                />
                <span className="font-medium text-slate-200">{ann.label}</span>
                <span className="font-mono text-slate-400">({ann.y})</span>
              </div>
              <button
                onClick={() => onRemoveYAnnotation(ann.id)}
                className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                title="Remove annotation"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
