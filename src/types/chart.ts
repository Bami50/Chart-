export type ChartType =
  | 'area'
  | 'line'
  | 'bar'
  | 'mixed'
  | 'candlestick'
  | 'heatmap'
  | 'radar'
  | 'radialBar'
  | 'donut'
  | 'treemap';

export type CurveStyle = 'smooth' | 'straight' | 'stepline';
export type FillType = 'gradient' | 'solid' | 'pattern';
export type PaletteName = 'classic' | 'emerald' | 'cyberpunk' | 'bloomberg' | 'nordic';

export interface YAxisAnnotation {
  id: string;
  y: number;
  label: string;
  borderColor: string;
  labelBgColor: string;
  labelTextColor: string;
  strokeDashArray: number;
}

export interface XAxisAnnotation {
  id: string;
  x: string | number;
  label: string;
  borderColor: string;
  labelBgColor: string;
  labelTextColor: string;
  strokeDashArray: number;
}

export interface PointAnnotation {
  id: string;
  x: string | number;
  y: number;
  label: string;
  markerFill: string;
}

export interface ChartSeriesItem {
  name: string;
  type?: 'line' | 'column' | 'area' | 'bar';
  data: any[];
}

export interface PresetDataset {
  id: string;
  title: string;
  category: 'Financial' | 'SaaS Metrics' | 'Infrastructure' | 'Product Analytics';
  description: string;
  defaultChartType: ChartType;
  categories?: string[];
  series: ChartSeriesItem[];
  yAxisTitle?: string;
  secondaryYAxisTitle?: string;
  unitPrefix?: string;
  unitSuffix?: string;
  defaultAnnotations?: {
    yAxis?: YAxisAnnotation[];
    xAxis?: XAxisAnnotation[];
    point?: PointAnnotation[];
  };
}

export interface ChartCustomizationOptions {
  themeMode: 'dark' | 'light';
  palette: PaletteName;
  curve: CurveStyle;
  strokeWidth: number;
  fillType: FillType;
  fillOpacity: number;
  showDataLabels: boolean;
  showGrid: boolean;
  gridDashed: boolean;
  showMarkers: boolean;
  markerSize: number;
  stacked: boolean;
  stackType100: boolean;
  showLegend: boolean;
  legendPosition: 'top' | 'right' | 'bottom';
  dualYAxis: boolean;
  showTooltipCrosshairs: boolean;
  // Advanced Statistical / Indicator Overlays
  showSMA7: boolean;
  showSMA20: boolean;
  showBollingerBands: boolean;
  showTrendline: boolean;
  showMinMaxLines: boolean;
}
