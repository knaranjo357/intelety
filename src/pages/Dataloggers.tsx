import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Activity, Search, MapPin, List, Download, Settings, Calendar, X } from 'lucide-react';
import { companies, readings } from '../data/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DataModalProps {
  isOpen: boolean;
  onClose: () => void;
  datalogger: ReturnType<typeof getAllDataloggers>[0];
}

function DataModal({ isOpen, onClose, datalogger }: DataModalProps) {
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
                {datalogger.name} - Data Visualization
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Variable</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  value={selectedVariable}
                  onChange={(e) => setSelectedVariable(e.target.value)}
                >
                  {datalogger.variables.map(variable => (
                    <option key={variable} value={variable}>{variable}</option>
                  ))}
                </select>
              </div>
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

            <div className="h-80 mb-6">
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

            <div className="flex justify-end">
              <button
                onClick={handleDownload}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Get all dataloggers with company and project info
const getAllDataloggers = () => {
  return companies.flatMap(company => 
    company.projects.flatMap(project => 
      project.dataloggers.map(datalogger => ({
        ...datalogger,
        companyName: company.name,
        companyId: company.id,
        projectName: project.name,
        projectId: project.id
      }))
    )
  );
};

export default function Dataloggers() {
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [selectedProject, setSelectedProject] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dataModalOpen, setDataModalOpen] = useState(false);
  const [selectedDatalogger, setSelectedDatalogger] = useState<ReturnType<typeof getAllDataloggers>[0] | null>(null);
  const navigate = useNavigate();

  const allDataloggers = getAllDataloggers();
  
  const filteredDataloggers = allDataloggers.filter(datalogger => {
    const matchesCompany = selectedCompany === 'all' || datalogger.companyId === selectedCompany;
    const matchesProject = selectedProject === 'all' || datalogger.projectId === selectedProject;
    const matchesType = selectedType === 'all' || datalogger.type === selectedType;
    const matchesSearch = datalogger.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         datalogger.serial.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCompany && matchesProject && matchesType && matchesSearch;
  });

  const handleViewData = (datalogger: ReturnType<typeof getAllDataloggers>[0]) => {
    setSelectedDatalogger(datalogger);
    setDataModalOpen(true);
  };

  const handleViewConfig = (dataloggerId: string) => {
    navigate(`/dataloggers/${dataloggerId}/config`);
  };

  const availableProjects = companies
    .find(c => c.id === selectedCompany)?.projects || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dataloggers</h1>
        <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark transition-colors">
          Add Datalogger
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company</label>
            <select
              id="company"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              value={selectedCompany}
              onChange={(e) => {
                setSelectedCompany(e.target.value);
                setSelectedProject('all');
              }}
            >
              <option value="all">All Companies</option>
              {companies.map(company => (
                <option key={company.id} value={company.id}>{company.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="project" className="block text-sm font-medium text-gray-700">Project</label>
            <select
              id="project"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
            >
              <option value="all">All Projects</option>
              {availableProjects.map(project => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
            <select
              id="type"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="airQuality">Air Quality</option>
              <option value="waterQuality">Water Quality</option>
              <option value="noise">Noise</option>
              <option value="multiParameter">Multi Parameter</option>
            </select>
          </div>

          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">Search</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="search"
                className="block w-full pl-10 rounded-md border-gray-300 focus:border-primary focus:ring-primary"
                placeholder="Search dataloggers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Datalogger
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company / Project
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Activity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Variables
              </th>
              <th className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredDataloggers.map((datalogger) => (
              <tr key={datalogger.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <Activity className="h-5 w-5 text-primary mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{datalogger.name}</div>
                      <div className="text-sm text-gray-500">Serial: {datalogger.serial}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <Link to={`/companies/${datalogger.companyId}`} className="font-medium text-gray-900 hover:text-primary">
                      {datalogger.companyName}
                    </Link>
                    <div className="text-gray-500">
                      <Link to={`/projects/${datalogger.projectId}`} className="hover:text-primary">
                        {datalogger.projectName}
                      </Link>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    <div>
                      <div>{datalogger.location.name}</div>
                      <div className="text-xs">
                        {datalogger.location.latitude}, {datalogger.location.longitude}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(datalogger.lastActivity), 'PPp')}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {datalogger.variables.map((variable) => (
                      <span
                        key={variable}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                      >
                        {variable}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleViewData(datalogger)}
                      className="text-primary hover:text-primary-dark transition-colors"
                    >
                      View data
                    </button>
                    <button
                      onClick={() => handleViewConfig(datalogger.id)}
                      className="text-primary hover:text-primary-dark transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedDatalogger && (
        <DataModal
          isOpen={dataModalOpen}
          onClose={() => setDataModalOpen(false)}
          datalogger={selectedDatalogger}
        />
      )}
    </div>
  );
}