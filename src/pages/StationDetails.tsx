import React from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { stations, readings } from '../data/mockData';
import { MapPin, Clock, Activity } from 'lucide-react';

export default function StationDetails() {
  const { id } = useParams();
  const station = stations.find(s => s.id === id);
  const stationReadings = readings.filter(r => r.stationId === id);

  if (!station) {
    return <div>Station not found</div>;
  }

  const chartData = stationReadings.map(reading => ({
    time: format(new Date(reading.timestamp), 'HH:mm'),
    ...reading.variables
  }));

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{station.name}</h1>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <MapPin className="h-4 w-4 mr-1" />
              {station.location.name}
            </div>
            <div className="mt-1 flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              Last active: {format(new Date(station.lastActivity), 'PPp')}
            </div>
          </div>
          <div className="flex space-x-3">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Edit
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700">
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Readings</h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              {station.variables.map((variable, index) => (
                <Line
                  key={variable}
                  type="monotone"
                  dataKey={variable}
                  stroke={`#${Math.floor(Math.random()*16777215).toString(16)}`}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Latest Readings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(stationReadings[stationReadings.length - 1]?.variables || {}).map(([key, value]) => (
            <div key={key} className="bg-gray-50 p-4 rounded-md">
              <div className="flex items-center">
                <Activity className="h-5 w-5 text-emerald-600" />
                <span className="ml-2 text-sm font-medium text-gray-500">{key}</span>
              </div>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}