/**
 * Shared formatting helpers for goal progress, percent-to-goal,
 * and graceful display of missing/hidden targets.
 */

/**
 * Format a number as currency
 */
export function formatCurrency(value: number | undefined): string {
  if (value === undefined || value === null) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format a number with commas
 */
export function formatNumber(value: number | undefined): string {
  if (value === undefined || value === null) return '—';
  return new Intl.NumberFormat('en-US').format(value);
}

/**
 * Format percentage
 */
export function formatPercent(value: number | undefined, decimals: number = 1): string {
  if (value === undefined || value === null || isNaN(value)) return '—';
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format goal progress
 */
export function formatGoalProgress(current: number, target: number): string {
  if (!target || target === 0) return '—';
  const percent = (current / target) * 100;
  return formatPercent(percent, 0);
}

/**
 * Calculate progress percentage
 */
export function calculateProgress(current: number, target: number): number {
  if (!target || target === 0) return 0;
  return Math.min((current / target) * 100, 100);
}

/**
 * Format division with graceful zero handling
 */
export function safeDivide(numerator: number, denominator: number, decimals: number = 1): string {
  if (!denominator || denominator === 0) return '—';
  return (numerator / denominator).toFixed(decimals);
}

/**
 * Format hours
 */
export function formatHours(hours: number | undefined): string {
  if (hours === undefined || hours === null) return '—';
  return `${hours.toFixed(1)}h`;
}

/**
 * Format duration in seconds to readable format
 */
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}
