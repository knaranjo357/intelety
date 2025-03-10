import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { readings, companies } from '../../data/mockData';
import { format } from 'date-fns';

interface ComponentProps {
  config: any;
  data?: any;
}

export const TextComponent: React.FC<ComponentProps> = ({ config }) => {
  return (
    <div className="p-4">
      <h3 className="text-lg font-medium text-gray-900">{config.title}</h3>
      <p className="mt-2 text-gray-600">{config.content}</p>
    </div>
  );
};

export const ChartComponent: React.FC<ComponentProps> = ({ config }) => {
  const chartData = readings
    .filter(r => r.dataloggerId === config.dataloggerId)
    .map(reading => ({
      time: format(new Date(reading.timestamp), 'HH:mm'),
      value: reading.variables[config.variable] || 0
    }))
    .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

  return (
    <div className="p-4 h-full">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{config.title}</h3>
      <div className="h-[calc(100%-2rem)]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="time" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              name={config.variable}
              stroke="#0197D6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const TableComponent: React.FC<ComponentProps> = ({ config }) => {
  const data = readings
    .filter(r => r.dataloggerId === config.dataloggerId)
    .slice(-10)
    .map(reading => ({
      timestamp: format(new Date(reading.timestamp), 'PPp'),
      value: reading.variables[config.variable] || 0
    }))
    .reverse();

  return (
    <div className="p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{config.title}</h3>
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Timestamp</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {data.map((row, idx) => (
              <tr key={idx}>
                <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500">{row.timestamp}</td>
                <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const StatComponent: React.FC<ComponentProps> = ({ config }) => {
  const latestReading = readings
    .filter(r => r.dataloggerId === config.dataloggerId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

  const value = latestReading?.variables[config.variable] || 0;

  return (
    <div className="p-4">
      <h3 className="text-sm font-medium text-gray-500">{config.title}</h3>
      <div className="mt-1 flex items-baseline">
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        <p className="ml-2 text-sm font-medium text-gray-500">{config.unit}</p>
      </div>
    </div>
  );
};

export const ImageComponent: React.FC<ComponentProps> = ({ config }) => {
  return (
    <div className="p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{config.title}</h3>
      <img
        src={config.url}
        alt={config.title}
        className="w-full h-auto rounded-lg object-cover"
      />
    </div>
  );
};