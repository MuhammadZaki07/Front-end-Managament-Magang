import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';

const data = [
  { name: 'Perlu Tindakan', value: 84, color: '#2563EB' },
  { name: 'Peserta Aktif', value: 26, color: '#60A5FA' },
  { name: 'Alumni', value: 26, color: '#BFDBFE' }
];

const COLORS = {
  'Perlu Tindakan': '#2563EB',
  'Peserta Aktif': '#60A5FA',
  'Alumni': '#BFDBFE'
};

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
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
      fontSize="12"
      fontWeight="600"
    >
      {`${Math.round(percent * 100)}%`}
    </text>
  );
};

const StatistikPeserta = () => {
  return (
    <div className="card bg-white mt-4 rounded-xl overflow-hidden w-full max-w-2xl mx-auto flex flex-col">
      {/* Header */}
      <div className="px-8 mt-6 mb-2">
        <h3 className="text-xl font-semibold text-gray-900">Status Peserta</h3>
        <p className="text-sm text-gray-500 mt-1">Kelola status peserta magang</p>
      </div>

      {/* Chart */}
      <div className="h-80 px-6 flex items-start justify-between pt-4 mb-6">
        {/* Chart Section */}
        <div className="relative w-1/2 h-full flex items-start justify-center">
          <ResponsiveContainer width={200} height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={90}
                innerRadius={50}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center leading-tight" style={{ transform: 'translateY(-50px)' }}>
            <span className="text-sm font-semibold text-gray-900">Status</span>
            <span className="text-sm font-semibold text-gray-900">Peserta</span>
          </div>
        </div>

        {/* Legend Section */}
        <div className="w-1/2 flex flex-col justify-start gap-6 pl-4 pt-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-600">{item.name}</span>
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {item.value}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatistikPeserta;