import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Brain, Settings, LineChart, Database, ArrowRight, Plus } from 'lucide-react';
import { companies } from '../data/mockData';
import ForecastConfig from '../components/forecast/ForecastConfig';

interface DataloggerWithInfo {
  id: string;
  name: string;
  companyName: string;
  projectName: string;
  variables: string[];
  forecastEnabled?: boolean;
}

export default function Forecast() {
  const [selectedDatalogger, setSelectedDatalogger] = useState<DataloggerWithInfo | null>(null);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Get all dataloggers with company and project info
  const dataloggers: DataloggerWithInfo[] = companies.flatMap(company =>
    company.projects.flatMap(project =>
      project.dataloggers.map(datalogger => ({
        ...datalogger,
        companyName: company.name,
        projectName: project.name,
      }))
    )
  );

  const filteredDataloggers = dataloggers.filter(datalogger =>
    datalogger.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    datalogger.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    datalogger.projectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Forecast</h1>
          <p className="mt-1 text-sm text-gray-500">
            Configure and manage AI predictions for your dataloggers
          </p>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1">
            <label htmlFor="search" className="sr-only">Search</label>
            <input
              type="text"
              id="search"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              placeholder="Search dataloggers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDataloggers.map((datalogger) => (
            <div
              key={datalogger.id}
              className="relative bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Database className="h-6 w-6 text-primary" />
                    <h3 className="ml-2 text-lg font-medium text-gray-900">
                      {datalogger.name}
                    </h3>
                  </div>
                  {datalogger.forecastEnabled && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Forecast Enabled
                    </span>
                  )}
                </div>

                <div className="mt-2 text-sm text-gray-500">
                  <p>{datalogger.companyName} - {datalogger.projectName}</p>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700">Variables:</h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {datalogger.variables.map((variable) => (
                      <span
                        key={variable}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                      >
                        {variable}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 bg-gray-50 p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2 text-sm">
                    <Brain className="h-4 w-4 text-primary" />
                    <span className="text-gray-600">
                      {datalogger.forecastEnabled ? 'Forecast Active' : 'No Forecast'}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedDatalogger(datalogger);
                      setConfigModalOpen(true);
                    }}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark shadow-sm"
                  >
                    {datalogger.forecastEnabled ? (
                      <>
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Enable Forecast
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedDatalogger && (
        <ForecastConfig
          isOpen={configModalOpen}
          onClose={() => {
            setConfigModalOpen(false);
            setSelectedDatalogger(null);
          }}
          datalogger={selectedDatalogger}
        />
      )}
    </div>
  );
}