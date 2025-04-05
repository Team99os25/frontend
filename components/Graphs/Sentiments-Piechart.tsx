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
  { name: 'A', value: 40, color: '#FF0000' },
  { name: 'B', value: 60, color: '#00FF00' },
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
