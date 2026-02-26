import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'Equities', value: 45 },
  { name: 'Fixed Income', value: 30 },
  { name: 'Cash', value: 15 },
  { name: 'Alternative', value: 10 },
];

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#8b5cf6'];

export function PortfolioWidget() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        <div className="h-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={({ name, /*value,*/ percent, x, y }) => (
                  <text
                    x={x}
                    y={y}
                    fill="#888888"
                    textAnchor={x > 150 ? 'start' : 'end'}
                    dominantBaseline="central"
                    fontSize="12px"
                  >
                    {`${name} ${(percent * 100).toFixed(0)}%`}
                  </text>
                )}
                labelLine={false}
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value) => <span className="text-sm">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
} 