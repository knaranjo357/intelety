import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Plus, Search, Pencil, Trash2, Clock } from 'lucide-react';
import { useReportStore } from '../store/reportStore';

export default function Reports() {
  const navigate = useNavigate();
  const { reports, deleteReport } = useReportStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReports = reports.filter(report =>
    report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      deleteReport(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <button
          onClick={() => navigate('/reports/new')}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Report
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-primary sm:text-sm"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <Link
                    to={`/reports/${report.id}`}
                    className="text-lg font-medium text-gray-900 hover:text-primary"
                  >
                    {report.name}
                  </Link>
                  <p className="mt-1 text-sm text-gray-500">{report.description}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-500">
                    <Clock className="h-4 w-4 inline mr-1" />
                    {format(new Date(report.updatedAt), 'PPp')}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => navigate(`/reports/${report.id}/edit`)}
                      className="p-2 text-gray-400 hover:text-primary"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(report.id)}
                      className="p-2 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredReports.length === 0 && (
            <div className="text-center py-12">
              <Plus className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No reports</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new report.</p>
              <div className="mt-6">
                <button
                  onClick={() => navigate('/reports/new')}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Report
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}