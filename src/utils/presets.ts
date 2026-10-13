import { PresetDataset } from '../types/chart';

export const COLOR_PALETTES = {
  classic: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0', '#3F51B5', '#546E7A'],
  emerald: ['#10B981', '#06B6D4', '#3B82F6', '#8B5CF6', '#F59E0B', '#EC4899', '#64748B'],
  cyberpunk: ['#F43F5E', '#A855F7', '#06B6D4', '#10B981', '#EAB308', '#FB923C', '#6366F1'],
  bloomberg: ['#F59E0B', '#3B82F6', '#10B981', '#EF4444', '#8B5CF6', '#EC4899', '#94A3B8'],
  nordic: ['#38BDF8', '#34D399', '#FBBF24', '#F87171', '#A78BFA', '#94A3B8', '#FB7185'],
};

export const PRESET_DATASETS: PresetDataset[] = [
  {
    id: 'saas-revenue',
    title: 'SaaS ARR & Customer Acquisition',
    category: 'SaaS Metrics',
    description: 'Monthly recurring revenue, customer additions, and churn rate breakdown with dual Y-axis scaling.',
    defaultChartType: 'mixed',
    categories: [
      'Jan 2026', 'Feb 2026', 'Mar 2026', 'Apr 2026', 'May 2026', 'Jun 2026',
      'Jul 2026', 'Aug 2026', 'Sep 2026', 'Oct 2026', 'Nov 2026', 'Dec 2026'
    ],
    series: [
      {
        name: 'New ARR ($k)',
        type: 'column',
        data: [142, 168, 195, 210, 248, 280, 312, 345, 390, 420, 465, 510],
      },
      {
        name: 'Expansion ARR ($k)',
        type: 'column',
        data: [45, 52, 60, 75, 88, 95, 110, 125, 140, 160, 175, 190],
      },
      {
        name: 'Net Retention Rate (%)',
        type: 'line',
        data: [108, 110, 112, 115, 118, 121, 122, 125, 128, 131, 133, 136],
      },
      {
        name: 'Active Subscribers (Total)',
        type: 'line',
        data: [1200, 1350, 1540, 1760, 2010, 2300, 2640, 3020, 3450, 3910, 4420, 4980],
      }
    ],
    yAxisTitle: 'ARR ($ in Thousands)',
    secondaryYAxisTitle: 'Retention Rate (%)',
    unitPrefix: '$',
    defaultAnnotations: {
      yAxis: [
        {
          id: 'arr-target',
          y: 400,
          label: 'Q4 Target ($400k)',
          borderColor: '#10B981',
          labelBgColor: '#10B981',
          labelTextColor: '#ffffff',
          strokeDashArray: 4,
        },
      ],
      xAxis: [
        {
          id: 'v2-launch',
          x: 'Jun 2026',
          label: 'Platform v2.0 Launch',
          borderColor: '#8B5CF6',
          labelBgColor: '#8B5CF6',
          labelTextColor: '#ffffff',
          strokeDashArray: 3,
        },
      ],
      point: [
        {
          id: 'peak-milestone',
          x: 'Sep 2026',
          y: 390,
          label: 'Series B Milestone',
          markerFill: '#F59E0B',
        },
      ],
    },
  },
  {
    id: 'financial-ohlc',
    title: 'NVDA Equity Candlestick & Volume',
    category: 'Financial',
    description: 'High-frequency daily open-high-low-close candlestick action with volume integration and technical indicators.',
    defaultChartType: 'candlestick',
    series: [
      {
        name: 'NVDA Stock (OHLC)',
        data: [
          { x: '2026-09-01', y: [118.5, 122.3, 117.8, 121.4] },
          { x: '2026-09-02', y: [121.4, 125.0, 120.1, 124.6] },
          { x: '2026-09-03', y: [124.6, 126.8, 122.5, 123.1] },
          { x: '2026-09-04', y: [123.1, 125.4, 119.2, 120.8] },
          { x: '2026-09-07', y: [120.8, 124.1, 119.8, 123.5] },
          { x: '2026-09-08', y: [123.5, 128.0, 122.9, 127.2] },
          { x: '2026-09-09', y: [127.2, 131.5, 126.4, 130.8] },
          { x: '2026-09-10', y: [130.8, 132.2, 128.5, 129.4] },
          { x: '2026-09-11', y: [129.4, 134.0, 129.0, 133.7] },
          { x: '2026-09-14', y: [133.7, 136.8, 132.1, 135.2] },
          { x: '2026-09-15', y: [135.2, 138.4, 134.0, 137.9] },
          { x: '2026-09-16', y: [137.9, 139.5, 136.2, 138.8] },
          { x: '2026-09-17', y: [138.8, 142.1, 137.5, 141.6] },
          { x: '2026-09-18', y: [141.6, 144.0, 140.2, 143.5] },
          { x: '2026-09-21', y: [143.5, 146.2, 142.0, 145.8] },
          { x: '2026-09-22', y: [145.8, 148.5, 144.3, 147.2] },
          { x: '2026-09-23', y: [147.2, 149.0, 145.6, 146.4] },
          { x: '2026-09-24', y: [146.4, 151.2, 146.0, 150.3] },
          { x: '2026-09-25', y: [150.3, 154.6, 149.8, 153.9] },
          { x: '2026-09-28', y: [153.9, 158.2, 153.1, 157.4] },
        ],
      },
    ],
    yAxisTitle: 'Share Price ($ USD)',
    unitPrefix: '$',
    defaultAnnotations: {
      yAxis: [
        {
          id: 'res-line',
          y: 150,
          label: 'Resistance Breakout ($150)',
          borderColor: '#EF4444',
          labelBgColor: '#EF4444',
          labelTextColor: '#ffffff',
          strokeDashArray: 2,
        },
        {
          id: 'sup-line',
          y: 125,
          label: 'Key Support ($125)',
          borderColor: '#10B981',
          labelBgColor: '#10B981',
          labelTextColor: '#ffffff',
          strokeDashArray: 2,
        },
      ],
      xAxis: [
        {
          id: 'earnings-event',
          x: '2026-09-16',
          label: 'Earnings Report Exceeds Expectations',
          borderColor: '#F59E0B',
          labelBgColor: '#F59E0B',
          labelTextColor: '#000000',
          strokeDashArray: 3,
        },
      ],
    },
  },
  {
    id: 'cloud-telemetry',
    title: 'Cloud Node Cluster Utilization',
    category: 'Infrastructure',
    description: 'Time-series area monitoring CPU cores, RAM consumption, and network I/O bandwidth across Kubernetes nodes.',
    defaultChartType: 'area',
    categories: [
      '00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00',
      '14:00', '16:00', '18:00', '20:00', '22:00'
    ],
    series: [
      {
        name: 'CPU Load (%)',
        data: [32, 28, 24, 38, 64, 78, 85, 82, 79, 74, 61, 45],
      },
      {
        name: 'Memory Usage (%)',
        data: [48, 48, 47, 52, 68, 74, 80, 81, 77, 72, 65, 56],
      },
      {
        name: 'Disk I/O IOPS (x100)',
        data: [15, 12, 10, 22, 45, 59, 63, 61, 55, 49, 36, 22],
      },
    ],
    yAxisTitle: 'Resource Utilization (%)',
    unitSuffix: '%',
    defaultAnnotations: {
      yAxis: [
        {
          id: 'cpu-alarm',
          y: 80,
          label: 'SLA Auto-Scale Threshold (80%)',
          borderColor: '#DC2626',
          labelBgColor: '#DC2626',
          labelTextColor: '#ffffff',
          strokeDashArray: 4,
        },
      ],
    },
  },
  {
    id: 'weekly-heatmap',
    title: 'API Request Load Distribution',
    category: 'Infrastructure',
    description: '2D matrix heatmap showing request throughput by hour and weekday.',
    defaultChartType: 'heatmap',
    categories: ['00h-04h', '04h-08h', '08h-12h', '12h-16h', '16h-20h', '20h-24h'],
    series: [
      { name: 'Monday', data: [12, 18, 75, 92, 68, 25] },
      { name: 'Tuesday', data: [15, 22, 88, 98, 72, 30] },
      { name: 'Wednesday', data: [14, 25, 94, 105, 80, 32] },
      { name: 'Thursday', data: [16, 24, 91, 102, 78, 28] },
      { name: 'Friday', data: [18, 26, 85, 96, 60, 22] },
      { name: 'Saturday', data: [8, 12, 35, 48, 40, 19] },
      { name: 'Sunday', data: [6, 9, 28, 41, 34, 15] },
    ],
    yAxisTitle: 'Weekday',
  },
  {
    id: 'system-radar',
    title: 'Distributed System Health Scorecard',
    category: 'Product Analytics',
    description: 'Multi-attribute radar benchmark comparing Production Cluster A vs Staging Cluster B across 6 dimensions.',
    defaultChartType: 'radar',
    categories: [
      'Latency (p99)',
      'Throughput',
      'Availability',
      'Security Compliance',
      'Resource Efficiency',
      'Error Resilience'
    ],
    series: [
      {
        name: 'Production Cluster',
        data: [92, 88, 99, 95, 84, 96],
      },
      {
        name: 'Staging Cluster',
        data: [78, 74, 92, 86, 72, 85],
      },
    ],
  },
  {
    id: 'kpi-radial',
    title: 'Annual Enterprise SLA & Objectives',
    category: 'Product Analytics',
    description: 'Multi-ring circular gauge visualizing progress towards annual strategic goals.',
    defaultChartType: 'radialBar',
    categories: ['Uptime SLA', 'Customer CSAT', 'Security Audit', 'Carbon Neutrality'],
    series: [
      {
        name: 'Metrics',
        data: [99.4, 94.2, 88.0, 76.5],
      },
    ],
  },
  {
    id: 'market-breakdown',
    title: 'Global Cloud Market Share',
    category: 'Product Analytics',
    description: 'Interactive donut breakdown with gradient sectors and center aggregation metric.',
    defaultChartType: 'donut',
    categories: ['AWS', 'Microsoft Azure', 'Google Cloud', 'Oracle Cloud', 'Alibaba Cloud', 'Others'],
    series: [
      {
        name: 'Market Share (%)',
        data: [32, 23, 12, 4, 4, 25],
      },
    ],
  },
];
