import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  BarChart3, 
  Building2, 
  FolderKanban, 
  Database,
  AlertTriangle,
  Map,
  HeadphonesIcon,
  FileText
} from 'lucide-react';
import { companies, alerts, supportTickets, readings } from '../data/mockData';
import { useReportStore } from '../store/reportStore';

export default function Home() {
  const { reports } = useReportStore();
  
  const stats = {
    companies: companies.length,
    projects: companies.reduce((acc, company) => acc + company.projects.length, 0),
    dataloggers: companies.reduce((acc, company) => 
      acc + company.projects.reduce((pacc, project) => 
        pacc + project.dataloggers.length, 0), 0),
    reports: reports.length,
    openAlerts: alerts.filter(a => !a.resolved).length,
    openTickets: supportTickets.filter(t => t.status === 'open').length,
    totalReadings: readings.length
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <Activity className="h-12 w-12 text-primary mx-auto" />
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900">
          Intelety
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Link 
          to="/companies"
          className="bg-white overflow-hidden shadow-lg rounded-lg transition-all hover:scale-105 hover:shadow-xl"
        >
          <div className="p-5">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Companies</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.companies}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <span className="text-sm font-medium text-primary">View all companies →</span>
          </div>
        </Link>

        <Link 
          to="/projects"
          className="bg-white overflow-hidden shadow-lg rounded-lg transition-all hover:scale-105 hover:shadow-xl"
        >
          <div className="p-5">
            <div className="flex items-center">
              <FolderKanban className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Projects</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.projects}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <span className="text-sm font-medium text-primary">View all projects →</span>
          </div>
        </Link>

        <Link 
          to="/dataloggers"
          className="bg-white overflow-hidden shadow-lg rounded-lg transition-all hover:scale-105 hover:shadow-xl"
        >
          <div className="p-5">
            <div className="flex items-center">
              <Database className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Dataloggers</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.dataloggers}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <span className="text-sm font-medium text-primary">View all dataloggers →</span>
          </div>
        </Link>

        <Link 
          to="/reports"
          className="bg-white overflow-hidden shadow-lg rounded-lg transition-all hover:scale-105 hover:shadow-xl"
        >
          <div className="p-5">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Reports</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.reports}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <span className="text-sm font-medium text-primary">View all reports →</span>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link 
          to="/map"
          className="bg-white overflow-hidden shadow-lg rounded-lg transition-all hover:scale-105 hover:shadow-xl"
        >
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Map className="h-10 w-10 text-primary" />
                <h3 className="ml-4 text-lg font-medium text-gray-900">Interactive Map</h3>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                {stats.dataloggers} Stations
              </span>
            </div>
            <p className="mt-3 text-sm text-gray-500">
              View all monitoring stations on an interactive map with real-time data.
            </p>
          </div>
        </Link>

        <Link 
          to="/alerts"
          className="bg-white overflow-hidden shadow-lg rounded-lg transition-all hover:scale-105 hover:shadow-xl"
        >
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertTriangle className="h-10 w-10 text-orange-500" />
                <h3 className="ml-4 text-lg font-medium text-gray-900">Active Alerts</h3>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                {stats.openAlerts} Open
              </span>
            </div>
            <p className="mt-3 text-sm text-gray-500">
              Review and manage active alerts from all monitoring stations.
            </p>
          </div>
        </Link>

        <Link 
          to="/support"
          className="bg-white overflow-hidden shadow-lg rounded-lg transition-all hover:scale-105 hover:shadow-xl"
        >
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <HeadphonesIcon className="h-10 w-10 text-primary" />
                <h3 className="ml-4 text-lg font-medium text-gray-900">Support Tickets</h3>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                {stats.openTickets} Open
              </span>
            </div>
            <p className="mt-3 text-sm text-gray-500">
              View and manage support tickets and technical assistance requests.
            </p>
          </div>
        </Link>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900">Quick Stats</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center">
                <Activity className="h-6 w-6 text-primary" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Total Readings</p>
                  <p className="text-xl font-semibold text-gray-900">{stats.totalReadings.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center">
                <BarChart3 className="h-6 w-6 text-primary" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Generated Reports</p>
                  <p className="text-xl font-semibold text-gray-900">{stats.reports}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}