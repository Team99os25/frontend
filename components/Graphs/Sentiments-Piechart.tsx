/* "use client"

import { PieChart, Pie, Tooltip } from 'recharts';

interface DataType {
  name: string;
  value: number;
}

const data: DataType[] = [
  { name: 'A', value: 40 },
  { name: 'B', value: 60 },
];

export default MyChart = () => (
  <PieChart width={400} height={400}>
    <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} />
    <Tooltip />
  </PieChart>
); */

"use client"; // Ensures it's only rendered on the client

import { PieChart, Pie, Tooltip, Cell } from 'recharts';

const data = [
  { name: 'Score 1', value: 5, color: '#CDB4DB' },
  { name: 'Score 2', value: 15, color: '#FFC8DD' },
  { name: 'Score 3', value: 25, color: '#FFAFCC' },
  { name: 'Score 4', value: 45, color: '#BDE0FE' },
  { name: 'Score 5', value: 10, color: '#A2D2FF' },
];

const MyChart = () => {
  return (
    <PieChart width={400} height={200}>
      <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={95}>
      {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
};

export default MyChart; // Use default export
