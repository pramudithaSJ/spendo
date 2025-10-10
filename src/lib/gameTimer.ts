/**
 * Game Timer Utility
 * Handles time tracking for game scenarios
 */

/**
 * Calculate time spent in seconds between start time and end time
 */
export function calculateTimeSpent(startTime: string, endTime?: string): number {
  const start = new Date(startTime).getTime();
  const end = endTime ? new Date(endTime).getTime() : Date.now();

  return Math.floor((end - start) / 1000); // Convert to seconds
}

/**
 * Format seconds into HH:MM:SS format
 */
export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const pad = (num: number) => num.toString().padStart(2, '0');

  return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
}

/**
 * Format time for display with units
 */
export function formatTimeWithUnits(seconds: number, language: 'en' | 'ta'): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts: string[] = [];

  if (language === 'ta') {
    if (hours > 0) parts.push(`${hours} மணி`);
    if (minutes > 0) parts.push(`${minutes} நிமிடம்`);
    if (secs > 0 || parts.length === 0) parts.push(`${secs} விநாடி`);
  } else {
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);
  }

  return parts.join(' ');
}

/**
 * Get current timestamp in ISO format
 */
export function getCurrentTimestamp(): string {
  return new Date().toISOString();
}
