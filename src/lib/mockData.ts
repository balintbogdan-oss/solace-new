interface GenerateMockDataOptions {
  baseValue: number;
  months: number;
  volatility: number; // Factor controlling the range of random variation
}

export function generateMockData({ baseValue, months, volatility }: GenerateMockDataOptions) {
  const pointsPerMonth = 30; // Generate 30 points per month
  const totalPoints = months * pointsPerMonth;

  // Define volatility scale and drift
  const stepVolatility = volatility * 0.1; // Use volatility more directly, scaled slightly
  const stepDrift = 0.0005; // Small positive drift per step

  // Calculate time duration and step
  const nowMs = Date.now();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);
  const startMs = startDate.getTime();
  const totalDurationMs = nowMs - startMs;
  const timeStepMs = totalDurationMs / totalPoints;

  const data = [];
  let previousValue = baseValue;
  let previousNetDeposit = baseValue * 0.9; // Start netDeposit at 90% of baseValue

  for (let i = 0; i < totalPoints; i++) {
    const pointTimeMs = startMs + (i * timeStepMs);
    const date = new Date(pointTimeMs);

    // Simulate random walk step for value
    const randomFactorValue = (Math.random() - 0.5) * 2; // Between -1 and 1
    const changeValue = previousValue * (stepDrift + stepVolatility * randomFactorValue);
    const currentValue = previousValue + changeValue;

    // Simulate random walk step for netDeposit (slightly different random factor)
    const randomFactorNetDeposit = (Math.random() - 0.5) * 2; // Between -1 and 1
    // Use slightly lower volatility/drift for the second line for visual distinction
    const changeNetDeposit = previousNetDeposit * (stepDrift * 0.8 + stepVolatility * 0.8 * randomFactorNetDeposit);
    const currentNetDeposit = previousNetDeposit + changeNetDeposit;

    data.push({
      date: date.toISOString(), // Use full ISO string for better time resolution
      timestamp: pointTimeMs, // Add numeric timestamp
      value: Math.max(0, Math.round(currentValue)), // Ensure value doesn't go below 0
      netDeposit: Math.max(0, Math.round(currentNetDeposit)) // Ensure netDeposit doesn't go below 0
    });

    previousValue = currentValue;
    previousNetDeposit = currentNetDeposit;
  }

  return data;
} 