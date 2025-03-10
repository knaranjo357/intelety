import React from 'react';
import { readings } from '../../data/mockData';

interface StatisticsTableProps {
  dataloggerIds: string[];
  variables: string[];
  timeRange: string;
}

export default function StatisticsTable({ dataloggerIds, variables, timeRange }: StatisticsTableProps) {
  const calculateStats = (dataloggerId: string, variable: string) => {
    const data = readings
      .filter(r => r.dataloggerId === dataloggerId)
      .map(r => r.variables[variable] || 0);

    if (data.length === 0) return { min: 0, max: 0, avg: 0, stdDev: 0 };

    const min = Math.min(...data);
    const max = Math.max(...data);
    const avg = data.reduce((a, b) => a + b, 0) / data.length;
    const variance = data.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / data.length;
    const stdDev = Math.sqrt(variance);

    return {
      min: Number(min.toFixed(2)),
      max: Number(max.toFixed(2)),
      avg: Number(avg.toFixed(2)),
      stdDev: Number(stdDev.toFixed(2))
    };
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Variable
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Min
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Max
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Average
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Std Dev
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {variables.map(variable => (
            <tr key={variable}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {variable}
              </td>
              {dataloggerIds.map(dataloggerId => {
                const stats = calculateStats(dataloggerId, variable);
                return (
                  <React.Fragment key={`${variable}-${dataloggerId}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {stats.min}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {stats.max}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {stats.avg}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {stats.stdDev}
                    </td>
                  </React.Fragment>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}