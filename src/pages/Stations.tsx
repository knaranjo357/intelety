import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Plus, Search, MoreVertical } from 'lucide-react';
import { stations } from '../data/mockData';

export default function Stations() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStations = stations.filter(station => 
    station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    station.serial.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Stations</h1>
        <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Station
        </button>
      </div>

      <div className="flex items-center px-4 py-2 bg-white rounded-md shadow-sm">
        <Search className="h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search stations..."
          className="ml-2 flex-1 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Station
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Serial
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Variables
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Activity
              </th>
              <th className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStations.map((station) => (
              <tr key={station.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link to={`/stations/${station.id}`} className="text-emerald-600 hover:text-emerald-900">
                    {station.name}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {station.serial}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {station.location.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {station.variables.join(', ')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(station.lastActivity), 'PPp')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-gray-400 hover:text-gray-500">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}