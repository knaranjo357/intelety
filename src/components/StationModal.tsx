import React, { useState } from 'react';
import { format } from 'date-fns';
import { X, Download, MapPin, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { readings } from '../data/mockData';

interface StationModalProps {
  isOpen: boolean;
  onClose: () => void;
  datalogger: any;
  timestamp: string;
}

export default function StationModal({ isOpen, onClose, datalogger, timestamp }: StationModalProps) {
  const [selectedVariable, setSelectedVariable] = useState(datalogger.variables[0]);
  const [dateRange, setDateRange] = useState({
    start: format(new Date().setDate(new Date().getDate() - 7), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd')
  });

  if (!isOpen) return null;

  const filteredReadings = readings
    .filter(r => r.dataloggerId === datalogger.id)
    .map(reading => ({
      time: format(new Date(reading.timestamp), 'HH:mm'),
      value: reading.variables[selectedVariable] || 0
    }))
    .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

  const currentReading = readings.find(r => 
    r.dataloggerId === datalogger.id && 
    r.timestamp === timestamp
  );

  const handleDownload = () => {
    const csvContent = [
      ['Timestamp', selectedVariable],
      ...filteredReadings.map(r => [r.time, r.value])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${datalogger.name}_${selectedVariable}_${dateRange.start}_${dateRange.end}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg w-full max-w-4xl mx-4 shadow-xl">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                {datalogger.name}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Station Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Station Details</h4>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Serial:</span> {datalogger.serial}
                  </p>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-1 text-primary/60" />
                    {datalogger.location.name} ({datalogger.location.latitude}, {datalogger.location.longitude})
                  </div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Last Activity:</span> {format(new Date(datalogger.lastActivity), 'PPp')}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Current Readings</h4>
                <div className="grid grid-cols-2 gap-2">
                  {datalogger.variables.map(variable => {
                    const value = currentReading?.variables[variable] || 0;
                    return (
                      <button
                        key={variable}
                        onClick={() => setSelectedVariable(variable)}
                        className={`p-2 rounded-lg transition-colors ${
                          selectedVariable === variable 
                            ? 'bg-primary text-white' 
                            : 'bg-primary/10 hover:bg-primary/20'
                        }`}
                      >
                        <span className="text-sm font-medium">{variable}:</span>
                        <span className="ml-2 font-bold">{value.toFixed(1)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Data Visualization */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-500">Historical Data - {selectedVariable}</h4>
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center px-3 py-1 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download Data
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="date"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="date"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  />
                </div>
              </div>

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={filteredReadings}>
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
                      name={selectedVariable}
                      stroke="#0197D6"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}