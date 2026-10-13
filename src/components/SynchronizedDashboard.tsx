import React, { useState } from 'react';
import { ApexChartWrapper } from './ApexChartWrapper';
import { PaletteName } from '../types/chart';
import { COLOR_PALETTES } from '../utils/presets';
import { Activity, Cpu, HardDrive, Wifi, Sliders, Info } from 'lucide-react';

interface SynchronizedDashboardProps {
  palette: PaletteName;
  themeMode: 'dark' | 'light';
}

export const SynchronizedDashboard: React.FC<SynchronizedDashboardProps> = ({
  palette,
  themeMode,
}) => {
  const [selectedScenario, setSelectedScenario] = useState<'financial' | 'telemetry'>('financial');
  const colors = COLOR_PALETTES[palette];

  // Base timestamps for synchronized timeline (24 hours or 20 trading days)
  const timestamps = [
    '09:30', '10:00', '10:30', '11:00', '11:30', '12:00',
    '12:30', '13:00', '13:30', '14:00', '14:30', '15:00',
    '15:30', '16:00'
  ];

  // Financial scenario data
  const finPriceSeries = [
    {
      name: 'Asset Price ($USD)',
      data: [142.5, 143.8, 142.1, 145.4, 147.2, 146.0, 148.9, 151.2, 149.8, 153.4, 155.0, 154.2, 157.6, 159.2],
    },
  ];

  const finVolumeSeries = [
    {
      name: 'Trading Volume (k shares)',
      data: [450, 380, 520, 890, 740, 420, 610, 950, 780, 1120, 840, 690, 1340, 1680],
    },
  ];

  const finRsiSeries = [
    {
      name: 'RSI Momentum (14)',
      data: [48, 52, 45, 59, 64, 61, 68, 74, 71, 79, 81, 77, 85, 88],
    },
  ];

  // Telemetry scenario data
  const telCpuSeries = [
    {
      name: 'CPU Cluster Load (%)',
      data: [28, 34, 45, 78, 89, 82, 75, 88, 92, 95, 84, 70, 62, 45],
    },
  ];

  const telRamSeries = [
    {
      name: 'RAM Consumption (GB)',
      data: [32, 34, 38, 48, 58, 62, 64, 68, 71, 74, 72, 68, 60, 48],
    },
  ];

  const telNetSeries = [
    {
      name: 'Network Throughput (Gbps)',
      data: [1.2, 1.8, 2.5, 6.8, 8.4, 7.9, 7.2, 8.9, 9.4, 9.8, 8.1, 6.2, 4.5, 2.8],
    },
  ];

  const currentScenario = selectedScenario === 'financial' ? {
    chart1: { title: '1. Asset Price Execution', unit: '$', series: finPriceSeries, color: colors[0], type: 'area' },
    chart2: { title: '2. Synchronized Volume Distribution', unit: 'k', series: finVolumeSeries, color: colors[1], type: 'bar' },
    chart3: { title: '3. Technical Momentum Indicator (RSI)', unit: 'pts', series: finRsiSeries, color: colors[2], type: 'line' },
  } : {
    chart1: { title: '1. Kubernetes Node CPU Cluster Load', unit: '%', series: telCpuSeries, color: colors[0], type: 'area' },
    chart2: { title: '2. Resident Memory Allocation (RAM)', unit: 'GB', series: telRamSeries, color: colors[1], type: 'area' },
    chart3: { title: '3. Inbound / Outbound Network Throughput', unit: 'Gbps', series: telNetSeries, color: colors[3], type: 'line' },
  };

  // Base shared options for synchronization
  const createSyncOptions = (id: string, color: string, type: string, yTitle: string, unit: string) => ({
    chart: {
      id: id,
      group: 'apex-sync-group',
      type: type,
      height: 190,
      background: 'transparent',
      toolbar: { show: false },
      animations: { enabled: true, easing: 'easeinout', speed: 500 },
    },
    colors: [color],
    stroke: {
      curve: 'smooth',
      width: type === 'bar' ? 0 : 2.5,
    },
    fill: {
      type: type === 'area' ? 'gradient' : 'solid',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.55,
        opacityTo: 0.05,
        stops: [0, 95, 100],
      },
    },
    dataLabels: { enabled: false },
    grid: {
      borderColor: themeMode === 'dark' ? '#1e293b' : '#e2e8f0',
      strokeDashArray: 3,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: true } },
    },
    theme: { mode: themeMode },
    xaxis: {
      categories: timestamps,
      crosshairs: {
        show: true,
        width: 1,
        stroke: { color: '#6366f1', width: 1, dashArray: 2 },
      },
      labels: {
        style: { colors: themeMode === 'dark' ? '#64748b' : '#94a3b8', fontSize: '11px' },
      },
    },
    yaxis: {
      title: {
        text: yTitle,
        style: { color: themeMode === 'dark' ? '#94a3b8' : '#64748b', fontSize: '11px' },
      },
      labels: {
        formatter: (val: number) => `${val}${unit}`,
        style: { colors: themeMode === 'dark' ? '#64748b' : '#94a3b8', fontSize: '10px' },
      },
    },
    tooltip: {
      theme: themeMode,
      shared: true,
      x: { show: true },
      y: {
        formatter: (val: number) => `${val} ${unit}`,
      },
    },
  });

  return (
    <div className="space-y-5">
      {/* Synchronized Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              Apex Synchronized Crosshair Hub
            </h3>
            <p className="text-slate-400 text-[11px]">
              Hover over any chart to see coordinated cursor tracking and time alignment across all charts.
            </p>
          </div>
        </div>

        {/* Scenario Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">Scenario:</span>
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setSelectedScenario('financial')}
              className={`px-3 py-1 rounded transition-colors ${
                selectedScenario === 'financial'
                  ? 'bg-indigo-600 text-white font-medium'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Market Execution (Price / Vol / RSI)
            </button>
            <button
              onClick={() => setSelectedScenario('telemetry')}
              className={`px-3 py-1 rounded transition-colors ${
                selectedScenario === 'telemetry'
                  ? 'bg-indigo-600 text-white font-medium'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              System Cluster (CPU / RAM / Net)
            </button>
          </div>
        </div>
      </div>

      {/* Synchronized Chart Trio */}
      <div className="space-y-4">
        {/* Chart 1 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-slate-200 text-xs">
              {currentScenario.chart1.title}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">sync-id: chart-primary</span>
          </div>
          <ApexChartWrapper
            type={currentScenario.chart1.type}
            series={currentScenario.chart1.series}
            options={createSyncOptions(
              'chart-primary',
              currentScenario.chart1.color,
              currentScenario.chart1.type,
              currentScenario.chart1.unit,
              currentScenario.chart1.unit
            )}
            height={200}
          />
        </div>

        {/* Chart 2 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-slate-200 text-xs">
              {currentScenario.chart2.title}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">sync-id: chart-secondary</span>
          </div>
          <ApexChartWrapper
            type={currentScenario.chart2.type}
            series={currentScenario.chart2.series}
            options={createSyncOptions(
              'chart-secondary',
              currentScenario.chart2.color,
              currentScenario.chart2.type,
              currentScenario.chart2.unit,
              currentScenario.chart2.unit
            )}
            height={190}
          />
        </div>

        {/* Chart 3 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-slate-200 text-xs">
              {currentScenario.chart3.title}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">sync-id: chart-tertiary</span>
          </div>
          <ApexChartWrapper
            type={currentScenario.chart3.type}
            series={currentScenario.chart3.series}
            options={createSyncOptions(
              'chart-tertiary',
              currentScenario.chart3.color,
              currentScenario.chart3.type,
              currentScenario.chart3.unit,
              currentScenario.chart3.unit
            )}
            height={190}
          />
        </div>
      </div>
    </div>
  );
};
