import React, { useState, useMemo, useCallback } from 'react';
import { Header, ActiveView } from './components/Header';
import { Toolbar } from './components/Toolbar';
import { StudioControls } from './components/StudioControls';
import { DataTableModal } from './components/DataTableModal';
import { SynchronizedDashboard } from './components/SynchronizedDashboard';
import { LiveStreamingChart } from './components/LiveStreamingChart';
import { CodeExportModal } from './components/CodeExportModal';
import { ApexChartWrapper } from './components/ApexChartWrapper';
import {
  ChartType,
  ChartCustomizationOptions,
  YAxisAnnotation,
  XAxisAnnotation,
  PointAnnotation,
  ChartSeriesItem,
  PaletteName,
} from './types/chart';
import { PRESET_DATASETS, COLOR_PALETTES } from './utils/presets';
import {
  calculateSMA,
  calculateBollingerBands,
  calculateTrendline,
  calculateStatistics,
} from './utils/analytics';
import { generateApexCode } from './utils/codeGenerator';
import {
  TrendingUp,
  Activity,
  Layers,
  Sparkles,
  Maximize2,
  Info,
  CheckCircle2,
} from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('studio');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('saas-revenue');
  const defaultPreset = PRESET_DATASETS.find((p) => p.id === 'saas-revenue')!;

  const [currentChartType, setCurrentChartType] = useState<ChartType>(defaultPreset.defaultChartType);
  const [categories, setCategories] = useState<string[] | undefined>(defaultPreset.categories);
  const [series, setSeries] = useState<ChartSeriesItem[]>(defaultPreset.series);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [chartKey, setChartKey] = useState<number>(1);
  const [notification, setNotification] = useState<string | null>(null);

  // Customization Options
  const [options, setOptions] = useState<ChartCustomizationOptions>({
    themeMode: 'dark',
    palette: 'classic',
    curve: 'smooth',
    strokeWidth: 3,
    fillType: 'gradient',
    fillOpacity: 0.6,
    showDataLabels: false,
    showGrid: true,
    gridDashed: true,
    showMarkers: false,
    markerSize: 4,
    stacked: false,
    stackType100: false,
    showLegend: true,
    legendPosition: 'bottom',
    dualYAxis: false,
    showTooltipCrosshairs: true,
    showSMA7: false,
    showSMA20: false,
    showBollingerBands: false,
    showTrendline: false,
    showMinMaxLines: false,
  });

  // Dynamic Annotations State
  const [annotations, setAnnotations] = useState<{
    yAxis: YAxisAnnotation[];
    xAxis: XAxisAnnotation[];
    point: PointAnnotation[];
  }>({
    yAxis: defaultPreset.defaultAnnotations?.yAxis || [],
    xAxis: defaultPreset.defaultAnnotations?.xAxis || [],
    point: defaultPreset.defaultAnnotations?.point || [],
  });

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Switch Preset Handler
  const handleSelectPreset = (presetId: string) => {
    const preset = PRESET_DATASETS.find((p) => p.id === presetId);
    if (!preset) return;

    setSelectedPresetId(presetId);
    setCurrentChartType(preset.defaultChartType);
    setCategories(preset.categories);
    setSeries(preset.series);
    setAnnotations({
      yAxis: preset.defaultAnnotations?.yAxis || [],
      xAxis: preset.defaultAnnotations?.xAxis || [],
      point: preset.defaultAnnotations?.point || [],
    });
    setChartKey((k) => k + 1);
  };

  // Chart Type Selection Handler
  const handleSelectChartType = (type: ChartType) => {
    setCurrentChartType(type);
    setChartKey((k) => k + 1);
  };

  // Reset Zoom
  const handleResetZoom = () => {
    setChartKey((k) => k + 1);
    showNotification('Chart zoom reset to default state');
  };

  // Annotation Actions
  const handleAddYAnnotation = (y: number, label: string, color: string) => {
    const newAnn: YAxisAnnotation = {
      id: `y-${Date.now()}`,
      y,
      label,
      borderColor: color,
      labelBgColor: color,
      labelTextColor: '#ffffff',
      strokeDashArray: 3,
    };
    setAnnotations((prev) => ({
      ...prev,
      yAxis: [...prev.yAxis, newAnn],
    }));
    showNotification(`Added Y-Axis annotation "${label}" at ${y}`);
  };

  const handleRemoveYAnnotation = (id: string) => {
    setAnnotations((prev) => ({
      ...prev,
      yAxis: prev.yAxis.filter((a) => a.id !== id),
    }));
  };

  const handleAddXAnnotation = (x: string, label: string, color: string) => {
    const newAnn: XAxisAnnotation = {
      id: `x-${Date.now()}`,
      x,
      label,
      borderColor: color,
      labelBgColor: color,
      labelTextColor: '#ffffff',
      strokeDashArray: 3,
    };
    setAnnotations((prev) => ({
      ...prev,
      xAxis: [...prev.xAxis, newAnn],
    }));
    showNotification(`Added event marker "${label}"`);
  };

  const handleRemoveXAnnotation = (id: string) => {
    setAnnotations((prev) => ({
      ...prev,
      xAxis: prev.xAxis.filter((a) => a.id !== id),
    }));
  };

  // Randomize / Jitter Data Handler
  const handleRandomizeData = () => {
    const jittered = series.map((s) => {
      const isCandle = s.data.length > 0 && typeof s.data[0] === 'object' && s.data[0]?.y;
      if (isCandle) {
        return {
          ...s,
          data: s.data.map((item: any) => {
            const delta = (Math.random() - 0.48) * 3;
            if (Array.isArray(item.y)) {
              return {
                ...item,
                y: item.y.map((v: number) => Number((v + delta).toFixed(2))),
              };
            }
            return item;
          }),
        };
      }

      return {
        ...s,
        data: s.data.map((val: any) => {
          if (typeof val === 'number') {
            const delta = (Math.random() - 0.48) * (val * 0.12);
            return Math.max(5, Math.round((val + delta) * 10) / 10);
          }
          return val;
        }),
      };
    });

    setSeries(jittered);
    showNotification('Dataset values updated with natural variance');
  };

  // Export handlers
  const handleExportJSON = () => {
    const exportData = {
      chartType: currentChartType,
      options,
      annotations,
      categories,
      series,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `apex_chart_config_${Date.now()}.json`;
    link.click();
    showNotification('JSON Configuration downloaded');
  };

  const handleExportCSV = () => {
    let csv = 'Index,Category,' + series.map((s) => `"${s.name}"`).join(',') + '\n';
    const length = categories?.length || series[0]?.data.length || 0;
    for (let i = 0; i < length; i++) {
      const cat = categories?.[i] || `Point ${i + 1}`;
      const vals = series.map((s) => {
        const item = s.data[i];
        if (typeof item === 'object' && item?.y) {
          return Array.isArray(item.y) ? item.y.join(';') : item.y;
        }
        return item ?? '';
      });
      csv += `${i + 1},"${cat}",${vals.join(',')}\n`;
    }
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `apex_chart_dataset_${Date.now()}.csv`;
    link.click();
    showNotification('CSV Dataset downloaded');
  };

  const handleExportPNG = () => {
    // ApexCharts provides built-in menu download, or we can notify user
    showNotification('Use the top-right chart menu (hamburger icon) for native PNG/SVG capture or JSON export');
  };

  const handleExportSVG = () => {
    showNotification('ApexCharts SVG download is available in the chart toolbar header');
  };

  // Compute Primary Numeric Data for Statistical Indicators
  const primaryNumbers: number[] = useMemo(() => {
    if (series.length === 0 || !Array.isArray(series[0].data)) return [];
    const firstData = series[0].data;
    if (typeof firstData[0] === 'number') {
      return firstData as number[];
    }
    if (typeof firstData[0] === 'object' && firstData[0]?.y) {
      if (Array.isArray(firstData[0].y)) {
        // OHLC close price
        return firstData.map((d: any) => d.y[3]);
      }
      return firstData.map((d: any) => Number(d.y));
    }
    return [];
  }, [series]);

  // Derived Summary Statistics
  const statistics = useMemo(() => {
    return calculateStatistics(primaryNumbers);
  }, [primaryNumbers]);

  // Compute Active Series with Statistical Indicator Overlays
  const augmentedSeries: ChartSeriesItem[] = useMemo(() => {
    const list: ChartSeriesItem[] = [...series];

    if (primaryNumbers.length === 0) return list;

    // 7-Period SMA
    if (options.showSMA7) {
      list.push({
        name: 'SMA (7)',
        type: 'line',
        data: calculateSMA(primaryNumbers, 7),
      });
    }

    // 20-Period SMA
    if (options.showSMA20) {
      list.push({
        name: 'SMA (20)',
        type: 'line',
        data: calculateSMA(primaryNumbers, 20),
      });
    }

    // Bollinger Bands
    if (options.showBollingerBands) {
      const bb = calculateBollingerBands(primaryNumbers, 10, 2);
      list.push({
        name: 'BB Upper (2σ)',
        type: 'line',
        data: bb.upper,
      });
      list.push({
        name: 'BB Lower (2σ)',
        type: 'line',
        data: bb.lower,
      });
    }

    // Linear Trendline
    if (options.showTrendline) {
      list.push({
        name: 'Linear Trendline',
        type: 'line',
        data: calculateTrendline(primaryNumbers),
      });
    }

    return list;
  }, [
    series,
    primaryNumbers,
    options.showSMA7,
    options.showSMA20,
    options.showBollingerBands,
    options.showTrendline,
  ]);

  // Active Palettes & Colors
  const activeColors = useMemo(() => {
    const base = COLOR_PALETTES[options.palette];
    // Add additional distinct colors if indicators are active
    return [
      ...base,
      '#06B6D4', // Cyan for SMA 7
      '#F59E0B', // Amber for SMA 20
      '#A855F7', // Purple for BB Upper
      '#EC4899', // Pink for BB Lower
      '#F43F5E', // Rose for Trendline
    ];
  }, [options.palette]);

  // Build ApexCharts Options Object
  const chartOptions = useMemo(() => {
    const isDark = options.themeMode === 'dark';
    const bgBorder = isDark ? '#334155' : '#e2e8f0';
    const textColor = isDark ? '#94a3b8' : '#64748b';

    // Min / Max / Mean annotations if enabled
    const extraYAnnotations = options.showMinMaxLines && primaryNumbers.length > 0 ? [
      {
        y: statistics.max,
        borderColor: '#EF4444',
        label: {
          text: `Max: ${statistics.max}`,
          style: { color: '#ffffff', background: '#EF4444' },
        },
      },
      {
        y: statistics.mean,
        borderColor: '#10B981',
        label: {
          text: `Mean: ${statistics.mean}`,
          style: { color: '#ffffff', background: '#10B981' },
        },
      },
      {
        y: statistics.min,
        borderColor: '#3B82F6',
        label: {
          text: `Min: ${statistics.min}`,
          style: { color: '#ffffff', background: '#3B82F6' },
        },
      },
    ] : [];

    const isCandle = currentChartType === 'candlestick';
    const isDonut = currentChartType === 'donut';
    const isRadial = currentChartType === 'radialBar';

    return {
      chart: {
        id: `apex-studio-chart-${chartKey}`,
        type: currentChartType === 'mixed' ? 'line' : currentChartType,
        height: 440,
        background: 'transparent',
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true,
          },
        },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 600,
          dynamicAnimation: {
            enabled: true,
            speed: 400,
          },
        },
        stacked: options.stacked,
        stackType: options.stackType100 ? '100%' : 'normal',
      },
      colors: activeColors,
      stroke: {
        curve: options.curve,
        width: isDonut || isRadial ? 0 : options.strokeWidth,
        dashArray: options.showSMA7 || options.showTrendline ? [0, 0, 3, 2, 0] : 0,
      },
      fill: {
        type: options.fillType,
        opacity: currentChartType === 'line' ? 1 : options.fillOpacity,
        gradient: {
          shadeIntensity: 1,
          opacityFrom: options.fillOpacity,
          opacityTo: 0.1,
          stops: [0, 90, 100],
        },
      },
      dataLabels: {
        enabled: options.showDataLabels,
        style: {
          fontSize: '11px',
          fontFamily: 'Plus Jakarta Sans',
        },
      },
      grid: {
        show: options.showGrid,
        borderColor: bgBorder,
        strokeDashArray: options.gridDashed ? 4 : 0,
      },
      markers: {
        size: options.showMarkers ? options.markerSize : 0,
        hover: { sizeOffset: 3 },
      },
      theme: {
        mode: options.themeMode,
      },
      xaxis: categories && !isDonut && !isRadial ? {
        categories: categories,
        crosshairs: { show: options.showTooltipCrosshairs },
        labels: {
          style: { colors: textColor, fontSize: '11px' },
        },
      } : {
        type: isCandle ? 'datetime' : 'category',
        labels: {
          style: { colors: textColor, fontSize: '11px' },
        },
      },
      yaxis: options.dualYAxis && !isDonut && !isRadial
        ? [
            {
              title: { text: 'Primary Metric', style: { color: textColor } },
              labels: { style: { colors: textColor, fontSize: '11px' } },
            },
            {
              opposite: true,
              title: { text: 'Secondary / Indicator', style: { color: textColor } },
              labels: { style: { colors: textColor, fontSize: '11px' } },
            },
          ]
        : {
            labels: {
              style: { colors: textColor, fontSize: '11px' },
            },
          },
      legend: {
        show: options.showLegend,
        position: options.legendPosition,
        labels: {
          colors: isDark ? '#e2e8f0' : '#1e293b',
        },
      },
      tooltip: {
        theme: options.themeMode,
        shared: true,
        intersect: false,
      },
      annotations: {
        yaxis: [
          ...annotations.yAxis.map((a) => ({
            y: a.y,
            borderColor: a.borderColor,
            label: {
              text: a.label,
              style: {
                color: a.labelTextColor,
                background: a.labelBgColor,
              },
            },
          })),
          ...extraYAnnotations,
        ],
        xaxis: annotations.xAxis.map((a) => ({
          x: a.x,
          borderColor: a.borderColor,
          label: {
            text: a.label,
            style: {
              color: a.labelTextColor,
              background: a.labelBgColor,
            },
          },
        })),
      },
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 4,
          columnWidth: '55%',
        },
        radialBar: {
          dataLabels: {
            total: {
              show: true,
              label: 'Overall Progress',
              formatter: () => '89.5%',
            },
          },
        },
        pie: {
          donut: {
            size: '65%',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Global Share',
                formatter: () => '100%',
              },
            },
          },
        },
      },
    };
  }, [
    chartKey,
    currentChartType,
    options,
    activeColors,
    categories,
    annotations,
    primaryNumbers,
    statistics,
  ]);

  // Code Generation for Export Modal
  const { reactCode, vanillaCode } = useMemo(() => {
    return generateApexCode(
      currentChartType,
      augmentedSeries,
      categories,
      options,
      annotations,
      activeColors
    );
  }, [currentChartType, augmentedSeries, categories, options, annotations, activeColors]);

  const activePreset = PRESET_DATASETS.find((p) => p.id === selectedPresetId);

  return (
    <div className={`min-h-screen ${options.themeMode === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} flex flex-col font-sans transition-colors duration-200`}>
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 border border-indigo-500/50 text-slate-100 px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Bar Contract (3 Zones) */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        onExportPNG={handleExportPNG}
        onExportSVG={handleExportSVG}
        onExportCSV={handleExportCSV}
        onExportJSON={handleExportJSON}
      />

      {/* Main Studio Toolbar */}
      <Toolbar
        currentChartType={currentChartType}
        onSelectChartType={handleSelectChartType}
        selectedPresetId={selectedPresetId}
        onSelectPreset={handleSelectPreset}
        palette={options.palette}
        onSelectPalette={(palette) => setOptions((p) => ({ ...p, palette }))}
        themeMode={options.themeMode}
        onToggleTheme={() =>
          setOptions((p) => ({ ...p, themeMode: p.themeMode === 'dark' ? 'light' : 'dark' }))
        }
        onResetZoom={handleResetZoom}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Viewport Workspace */}
      <main className="flex-1 flex overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 p-5 overflow-y-auto space-y-5">
          {/* Active View Router */}
          {activeView === 'studio' && (
            <div className="space-y-5">
              {/* Contextual Metric Banner */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-white tracking-tight">
                      {activePreset?.title}
                    </h2>
                    <span className="text-[11px] text-slate-400">· {activePreset?.category}</span>
                  </div>
                  <p className="text-xs text-slate-400 max-w-2xl">
                    {activePreset?.description}
                  </p>
                </div>

                {/* Analytical Stats Strip */}
                {primaryNumbers.length > 0 && (
                  <div className="flex items-center gap-4 text-xs font-mono tabular-nums">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 uppercase block">High</span>
                      <span className="font-semibold text-emerald-400">
                        {statistics.max}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 uppercase block">Mean</span>
                      <span className="font-semibold text-indigo-400">
                        {statistics.mean}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 uppercase block">Low</span>
                      <span className="font-semibold text-rose-400">
                        {statistics.min}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Main Chart Canvas Container */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative min-h-[460px]">
                <ApexChartWrapper
                  key={chartKey}
                  type={currentChartType === 'mixed' ? 'line' : currentChartType}
                  series={augmentedSeries}
                  options={chartOptions}
                  height={440}
                />
              </div>

              {/* Bottom Quick-Action Panel */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 text-indigo-400 font-semibold">
                    <TrendingUp className="w-4 h-4" />
                    <span>Technical Indicators</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Toggle moving averages (SMA 7/20), Bollinger 2σ bands, and trendlines in the Chart Studio panel to see dynamic overlays.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                    <Activity className="w-4 h-4" />
                    <span>Crosshair & Drilldown</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Use selection zoom, pan drag, or click legend series pills to isolate specific data channels on the canvas.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 text-amber-400 font-semibold">
                    <Layers className="w-4 h-4" />
                    <span>Developer Integration</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    All visual changes immediately reflect in the Code Export tab, ready for copy-pasting directly into production.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeView === 'sync' && (
            <SynchronizedDashboard
              palette={options.palette}
              themeMode={options.themeMode}
            />
          )}

          {activeView === 'streaming' && (
            <LiveStreamingChart
              palette={options.palette}
              themeMode={options.themeMode}
            />
          )}

          {activeView === 'data' && (
            <DataTableModal
              categories={categories}
              series={series}
              onUpdateData={(newCats, newSeries) => {
                setCategories(newCats);
                setSeries(newSeries);
                setChartKey((k) => k + 1);
                showNotification('Dataset updated');
              }}
              onRandomizeData={handleRandomizeData}
            />
          )}

          {activeView === 'code' && (
            <CodeExportModal
              reactCode={reactCode}
              vanillaCode={vanillaCode}
            />
          )}
        </div>

        {/* Right Sidebar Customizer Drawer (Visible in Studio Mode) */}
        {activeView === 'studio' && isSidebarOpen && (
          <StudioControls
            options={options}
            setOptions={setOptions}
            annotations={annotations}
            onAddYAnnotation={handleAddYAnnotation}
            onRemoveYAnnotation={handleRemoveYAnnotation}
            onAddXAnnotation={handleAddXAnnotation}
            onRemoveXAnnotation={handleRemoveXAnnotation}
            isCandlestickOrCategorical={currentChartType === 'candlestick'}
          />
        )}
      </main>
    </div>
  );
}
