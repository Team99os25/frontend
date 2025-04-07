"use client";

import { PieChart, Pie, Tooltip, Cell, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Score 1', value: 5 },
  { name: 'Score 2', value: 15 },
  { name: 'Score 3', value: 25 },
  { name: 'Score 4', value: 45 },
];

const COLORS = ['#fecaca', '#fca5a5', '#f87171', '#ef4444'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium text-gray-600">{payload[0].name}</p>
        <p className="text-sm font-semibold text-red-600">
          {`${payload[0].value}%`}
        </p>
      </div>
    );
  }
  return null;
};

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      className="text-xs font-medium"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const MyChart = () => {
  return (
    <div className="w-full h-[250px] p-2 rounded-lg overflow-hidden">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            innerRadius={40}
            paddingAngle={3}
            labelLine={false}
            label={renderCustomizedLabel}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]}
                className="hover:opacity-80 transition-opacity duration-300"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value: string) => (
              <span className="text-sm text-gray-600">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MyChart;









































// "use client"; // Ensures it's only rendered on the client

// import { PieChart, Pie, Tooltip, Cell } from 'recharts';

// const data = [
//   { name: 'Score 1', value: 5, color: '#CDB4DB' },
//   { name: 'Score 2', value: 15, color: '#FFC8DD' },
//   { name: 'Score 3', value: 25, color: '#FFAFCC' },
//   { name: 'Score 4', value: 45, color: '#BDE0FE' },
//   { name: 'Score 5', value: 10, color: '#A2D2FF' },
// ];

// const MyChart = () => {
//   return (
//     <PieChart width={400} height={200}>
//       <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={95}>
//       {data.map((entry, index) => (
//           <Cell key={`cell-${index}`} fill={entry.color} />
//         ))}
//       </Pie>
//       <Tooltip />
//     </PieChart>
//   );
// };

// export default MyChart; // Use default export
