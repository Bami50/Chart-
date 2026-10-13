import React, { useState, useEffect, useRef } from 'react';
import { ApexChartWrapper } from './ApexChartWrapper';
import { PaletteName } from '../types/chart';
import { COLOR_PALETTES } from '../utils/presets';
import { Play, Pause, Zap, RefreshCw, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface LiveStreamingChartProps {
  palette: PaletteName;
  themeMode: 'dark' | 'light';
}

export const LiveStreamingChart: React.FC<LiveStreamingChartProps> = ({
  palette,
  themeMode,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speedMs, setSpeedMs] = useState<number>(600);
  const [bufferSize, setBufferSize] = useState<number>(30);
  const [tickCount, setTickCount] = useState<number>(0);

  // Initialize initial points
  const initialPoints = useRef(
    Array.from({ length: 25 }, (_, i) => {
      const now = new Date(Date.now() - (25 - i) * 1000);
      const timeStr = now.toTimeString().split(' ')[0];
      const val = 120 + Math.round(Math.sin(i * 0.5) * 30 + (Math.random() * 20 - 10));
      return { x: timeStr, y: val };
    })
  );

  const [dataPoints, setDataPoints] = useState<{ x: string; y: number }[]>(initialPoints.current);

  const colors = COLOR_PALETTES[palette];

  // Streaming interval
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setDataPoints((prev) => {
        const lastVal = prev.length > 0 ? prev[prev.length - 1].y : 130;
        // Natural random walk with mean reversion towards 140
        const reversion = (140 - lastVal) * 0.08;
        const noise = (Math.random() - 0.49) * 16;
        const nextVal = Math.max(30, Math.round(lastVal + reversion + noise));

        const now = new Date();
        const timeStr = now.toTimeString().split(' ')[0];

        const updated = [...prev, { x: timeStr, y: nextVal }];
        return updated.length > bufferSize ? updated.slice(updated.length - bufferSize) : updated;
      });

      setTickCount((c) => c + 1);
    }, speedMs);

    return () => clearInterval(interval);
  }, [isPlaying, speedMs, bufferSize]);

  // Inject manual anomaly spike
  const handleInjectSpike = (direction: 'up' | 'down') => {
    setDataPoints((prev) => {
      const lastVal = prev.length > 0 ? prev[prev.length - 1].y : 130;
      const spikeVal = direction === 'up' ? lastVal + 95 : Math.max(20, lastVal - 85);
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];

      const updated = [...prev, { x: timeStr, y: spikeVal }];
      return updated.length > bufferSize ? updated.slice(updated.length - bufferSize) : updated;
    });
    setTickCount((c) => c + 1);
  };

  const handleResetStream = () => {
    const fresh = Array.from({ length: 25 }, (_, i) => {
      const now = new Date(Date.now() - (25 - i) * 1000);
      const timeStr = now.toTimeString().split(' ')[0];
      const val = 120 + Math.round(Math.sin(i * 0.5) * 30 + (Math.random() * 20 - 10));
      return { x: timeStr, y: val };
    });
    setDataPoints(fresh);
    setTickCount(0);
  };

  // Metrics
  const values = dataPoints.map((d) => d.y);
  const currentVal = values.length > 0 ? values[values.length - 1] : 0;
  const prevVal = values.length > 1 ? values[values.length - 2] : currentVal;
  const delta = currentVal - prevVal;
  const maxVal = values.length > 0 ? Math.max(...values) : 0;
  const minVal = values.length > 0 ? Math.min(...values) : 0;
  const avgVal = values.length > 0 ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;

  const chartSeries = [
    {
      name: 'Real-Time IOPS Throughput',
      data: dataPoints.map((d) => ({ x: d.x, y: d.y })),
    },
  ];

  const chartOptions = {
    chart: {
      id: 'live-stream-chart',
      type: 'area',
      height: 380,
      background: 'transparent',
      animations: {
        enabled: true,
        easing: 'linear',
        dynamicAnimation: {
          speed: speedMs,
        },
      },
      toolbar: { show: false },
    },
    colors: [colors[0]],
    stroke: {
      curve: 'smooth',
      width: 2.5,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.5,
        opacityTo: 0.05,
        stops: [0, 90, 100],
      },
    },
    dataLabels: { enabled: false },
    markers: {
      size: 0,
    },
    grid: {
      borderColor: themeMode === 'dark' ? '#1e293b' : '#e2e8f0',
      strokeDashArray: 3,
    },
    theme: { mode: themeMode },
    xaxis: {
      type: 'category',
      range: bufferSize,
      labels: {
        style: { colors: themeMode === 'dark' ? '#64748b' : '#94a3b8', fontSize: '11px' },
      },
    },
    yaxis: {
      labels: {
        formatter: (val: number) => `${Math.round(val)} ops`,
        style: { colors: themeMode === 'dark' ? '#64748b' : '#94a3b8', fontSize: '10px' },
      },
    },
    tooltip: {
      theme: themeMode,
      x: { show: true },
      y: {
        formatter: (val: number) => `${val} req/s`,
      },
    },
  };

  return (
    <div className="space-y-5">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-[11px] text-slate-400 font-medium">Current Throughput</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">
              {currentVal}
            </span>
            <span className="text-xs text-slate-400">ops/sec</span>
            <span
              className={`flex items-center text-[11px] font-mono font-semibold ml-auto ${
                delta >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {delta >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              {Math.abs(delta)}
            </span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-[11px] text-slate-400 font-medium">Peak High</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
              {maxVal}
            </span>
            <span className="text-xs text-slate-400">ops/sec</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-[11px] text-slate-400 font-medium">Rolling Average</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-indigo-400 tabular-nums">
              {avgVal}
            </span>
            <span className="text-xs text-slate-400">ops/sec</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-[11px] text-slate-400 font-medium">Total Ticks Streamed</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-cyan-400 tabular-nums">
              {tickCount}
            </span>
            <span className="text-xs text-slate-400">events</span>
          </div>
        </div>
      </div>

      {/* Main Streaming Canvas */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        {/* Stream Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                isPlaying
                  ? 'bg-amber-600/20 text-amber-300 border border-amber-500/40 hover:bg-amber-600/30'
                  : 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/30'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pause Stream' : 'Resume Stream'}</span>
            </button>

            <button
              onClick={handleResetStream}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset Buffer</span>
            </button>
          </div>

          {/* Anomaly Simulator & Speed */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <span className="text-slate-400 px-1 text-[11px]">Inject:</span>
              <button
                onClick={() => handleInjectSpike('up')}
                className="px-2 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 rounded text-[11px] font-medium transition-colors"
              >
                + Spike (+95)
              </button>
              <button
                onClick={() => handleInjectSpike('down')}
                className="px-2 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 rounded text-[11px] font-medium transition-colors"
              >
                - Dip (-85)
              </button>
            </div>

            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1">
              <span className="text-slate-400 text-[11px]">Interval:</span>
              <select
                value={speedMs}
                onChange={(e) => setSpeedMs(Number(e.target.value))}
                className="bg-transparent text-slate-200 focus:outline-none text-[11px] cursor-pointer"
              >
                <option value={300} className="bg-slate-900">300ms (High Freq)</option>
                <option value={600} className="bg-slate-900">600ms (Normal)</option>
                <option value={1200} className="bg-slate-900">1200ms (Relaxed)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Live Chart */}
        <ApexChartWrapper
          type="area"
          series={chartSeries}
          options={chartOptions}
          height={380}
        />
      </div>
    </div>
  );
};
