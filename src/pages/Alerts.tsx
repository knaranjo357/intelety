import React, { useState } from 'react';
import { format } from 'date-fns';
import { AlertTriangle, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { alerts, companies } from '../data/mockData';

const severityConfig = {
  minor: { icon: AlertCircle, className: 'text-yellow-500' },
  major: { icon: AlertTriangle, className: 'text-orange-500' },
  critical: { icon: XCircle, className: 'text-red-500' }
};

const getDataloggerInfo = (dataloggerId: string) => {
  for (const company of companies) {
    for (const project of company.projects) {
      const datalogger = project.dataloggers.find(d => d.id === dataloggerId);
      if (datalogger) {
        return {
          datalogger,
          project,
          company
        };
      }
    }
  }
  return null;
};

export default function Alerts() {
  const [filter, setFilter] = useState('all');

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    if (filter === 'resolved') return alert.resolved;
    if (filter === 'unresolved') return !alert.resolved;
    return alert.severity === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Alerts</h1>
        <div className="flex space-x-2">
          <select
            className="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Alerts</option>
            <option value="critical">Critical</option>
            <option value="major">Major</option>
            <option value="minor">Minor</option>
            <option value="resolved">Resolved</option>
            <option value="unresolved">Unresolved</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="divide-y divide-gray-200">
          {filteredAlerts.map((alert) => {
            const info = getDataloggerInfo(alert.dataloggerId);
            const SeverityIcon = severityConfig[alert.severity].icon;
            
            if (!info) return null;
            
            return (
              <div key={alert.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <SeverityIcon className={`h-6 w-6 ${severityConfig[alert.severity].className}`} />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {info.datalogger.name} - {alert.variable} Alert
                      </h3>
                      <p className="text-sm text-gray-500">
                        Value: {alert.value} • {format(new Date(alert.timestamp), 'PPp')}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {info.company.name} - {info.project.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {alert.resolved ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Resolved
                      </span>
                    ) : (
                      <button className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-primary hover:bg-primary-dark">
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}