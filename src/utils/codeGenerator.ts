import { ChartType, ChartCustomizationOptions, YAxisAnnotation, XAxisAnnotation, PointAnnotation } from '../types/chart';

export function generateApexCode(
  type: ChartType,
  series: any[],
  categories: string[] | undefined,
  options: ChartCustomizationOptions,
  annotations: {
    yAxis: YAxisAnnotation[];
    xAxis: XAxisAnnotation[];
    point: PointAnnotation[];
  },
  colors: string[]
): { reactCode: string; vanillaCode: string } {
  // Format series for display
  const seriesStr = JSON.stringify(series, null, 2);

  // Format options
  const apexOptions = {
    chart: {
      type: type === 'mixed' ? 'line' : type,
      height: 420,
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
      },
    },
    colors: colors,
    stroke: {
      curve: options.curve,
      width: options.strokeWidth,
    },
    fill: {
      type: options.fillType,
      opacity: options.fillOpacity,
    },
    dataLabels: {
      enabled: options.showDataLabels,
    },
    grid: {
      show: options.showGrid,
      borderColor: options.themeMode === 'dark' ? '#334155' : '#e2e8f0',
      strokeDashArray: options.gridDashed ? 4 : 0,
    },
    markers: {
      size: options.showMarkers ? options.markerSize : 0,
      hover: { sizeOffset: 3 },
    },
    theme: {
      mode: options.themeMode,
    },
    xaxis: categories ? {
      categories: categories,
      crosshairs: { show: options.showTooltipCrosshairs },
    } : undefined,
    legend: {
      show: options.showLegend,
      position: options.legendPosition,
    },
    annotations: {
      yaxis: annotations.yAxis.map((a) => ({
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
  };

  const optionsStr = JSON.stringify(apexOptions, null, 2);

  const reactCode = `import React from 'react';
import Chart from 'react-apexcharts';

export function MyApexChart() {
  const series = ${seriesStr};

  const options = ${optionsStr};

  return (
    <div className="w-full bg-slate-900 p-6 rounded-xl border border-slate-800">
      <Chart 
        options={options} 
        series={series} 
        type="${type === 'mixed' ? 'line' : type}" 
        height={420} 
      />
    </div>
  );
}`;

  const vanillaCode = `<!-- HTML Container -->
<div id="chart"></div>

<!-- ApexCharts Script -->
<script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
<script>
  const series = ${seriesStr};
  const options = ${optionsStr};

  const chart = new ApexCharts(document.querySelector("#chart"), options);
  chart.render();
</script>`;

  return { reactCode, vanillaCode };
}
