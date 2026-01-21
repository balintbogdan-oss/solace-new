import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

interface DataPoint {
  date: string;
  value: number;
}

interface LineChartWidgetProps {
  data: DataPoint[];
  color?: string;
  height?: number;
  showAxes?: boolean;
  formatValue?: (value: number) => string;
}

export function LineChartWidget({ 
  data, 
  color = '#6366f1', 
  height = 100,
  showAxes = false,
  formatValue = (value) => value.toString()
}: LineChartWidgetProps) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          {showAxes && (
            <>
              <XAxis 
                dataKey="date"
                fontSize={12}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
                }}
                axisLine={false}
                tickLine={false}
                className="text-gray-600 dark:text-gray-400"
              />
              <YAxis 
                fontSize={12}
                tickFormatter={formatValue}
                axisLine={false}
                tickLine={false}
                className="text-gray-600 dark:text-gray-400"
              />
            </>
          )}
          <Tooltip
            formatter={(value: number) => [formatValue(value), 'Value']}
            labelFormatter={(label) => {
              const date = new Date(label);
              return date.toLocaleDateString('en-US', { 
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
} 