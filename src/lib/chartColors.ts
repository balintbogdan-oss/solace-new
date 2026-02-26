/**
 * Utility functions for getting chart colors based on theme
 */

/**
 * Get a chart color by index (1-6)
 * Uses CSS variables: --chart-1 through --chart-6
 */
export function getChartColor(index: number): string {
  if (index < 1 || index > 6) {
    console.warn(`Chart color index must be between 1 and 6, got ${index}`);
    return '#6B7280'; // Fallback gray
  }
  
  // Get the CSS variable value
  if (typeof window !== 'undefined') {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(`--chart-${index}`)
      .trim();
    
    if (value) {
      return value;
    }
  }
  
  // Fallback colors if CSS variable is not available
  const fallbackColors = [
    '#A16207', // chart-1
    '#881337', // chart-2
    '#D97706', // chart-3
    '#1E40AF', // chart-4
    '#7C2D12', // chart-5
    '#7C3AED', // chart-6
  ];
  
  return fallbackColors[index - 1] || '#6B7280';
}

/**
 * Get an array of chart colors (chart-1 through chart-6)
 */
export function getChartColors(count: number = 6): string[] {
  return Array.from({ length: Math.min(count, 6) }, (_, i) => getChartColor(i + 1));
}

/**
 * Get chart color for a specific index, cycling through available colors
 */
export function getChartColorByIndex(index: number): string {
  // Cycle through 1-6
  const colorIndex = ((index - 1) % 6) + 1;
  return getChartColor(colorIndex);
}

