import React from 'react';
import ChartComponent from 'react-apexcharts';

// Handle React-ApexCharts export structure safely across bundlers
const Chart: any = (ChartComponent as any).default || ChartComponent;

interface ApexChartWrapperProps {
  type: string;
  series: any[];
  options: any;
  height?: number | string;
  width?: number | string;
}

export const ApexChartWrapper: React.FC<ApexChartWrapperProps> = ({
  type,
  series,
  options,
  height = 420,
  width = '100%',
}) => {
  return (
    <div className="w-full relative min-h-[300px]">
      <Chart
        type={type}
        series={series}
        options={options}
        height={height}
        width={width}
      />
    </div>
  );
};
