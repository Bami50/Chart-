/**
 * Computes Simple Moving Average (SMA)
 */
export function calculateSMA(data: number[], windowSize: number): (number | null)[] {
  const result: (number | null)[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < windowSize - 1) {
      result.push(null);
    } else {
      let sum = 0;
      for (let j = 0; j < windowSize; j++) {
        sum += data[i - j];
      }
      result.push(Number((sum / windowSize).toFixed(2)));
    }
  }
  return result;
}

/**
 * Computes Bollinger Bands (Middle SMA, Upper band, Lower band)
 * Standard is 20-period SMA with 2 standard deviations
 */
export function calculateBollingerBands(
  data: number[],
  period: number = 20,
  stdDevMultiplier: number = 2
): {
  upper: (number | null)[];
  middle: (number | null)[];
  lower: (number | null)[];
} {
  const middle = calculateSMA(data, period);
  const upper: (number | null)[] = [];
  const lower: (number | null)[] = [];

  for (let i = 0; i < data.length; i++) {
    const mid = middle[i];
    if (mid === null || i < period - 1) {
      upper.push(null);
      lower.push(null);
      continue;
    }

    // calculate standard deviation
    let varianceSum = 0;
    for (let j = 0; j < period; j++) {
      varianceSum += Math.pow(data[i - j] - mid, 2);
    }
    const stdDev = Math.sqrt(varianceSum / period);
    upper.push(Number((mid + stdDevMultiplier * stdDev).toFixed(2)));
    lower.push(Number((mid - stdDevMultiplier * stdDev).toFixed(2)));
  }

  return { upper, middle, lower };
}

/**
 * Computes linear regression trendline (y = mx + b)
 */
export function calculateTrendline(data: number[]): number[] {
  const n = data.length;
  if (n <= 1) return [...data];

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;

  for (let i = 0; i < n; i++) {
    const x = i;
    const y = data[i];
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumX2 += x * x;
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return data.map((_, i) => Number((slope * i + intercept).toFixed(2)));
}

/**
 * Computes basic statistical summaries (min, max, mean, median)
 */
export function calculateStatistics(data: number[]) {
  if (data.length === 0) return { min: 0, max: 0, mean: 0, median: 0 };
  const sorted = [...data].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const sum = data.reduce((acc, v) => acc + v, 0);
  const mean = Number((sum / data.length).toFixed(2));
  const midIndex = Math.floor(sorted.length / 2);
  const median =
    sorted.length % 2 !== 0
      ? sorted[midIndex]
      : Number(((sorted[midIndex - 1] + sorted[midIndex]) / 2).toFixed(2));

  return { min, max, mean, median };
}
