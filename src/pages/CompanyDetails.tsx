import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { FolderKanban, Activity } from 'lucide-react';
import { companies } from '../data/mockData';

export default function CompanyDetails() {
  const { id } = useParams();
  const company = companies.find(c => c.id === id);

  if (!company) {
    return <div>Company not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <Link to="/companies" className="hover:text-primary">Companies</Link>
        <span>/</span>
        <span>{company.name}</span>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
            <p className="mt-2 text-gray-500">{company.description}</p>
          </div>
          <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark">
            Add Project
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-lg font-medium text-gray-900">Projects</h2>
        <div className="grid grid-cols-1 gap-6">
          {company.projects.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="bg-white shadow-sm rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FolderKanban className="h-6 w-6 text-primary" />
                    <h3 className="ml-3 text-lg font-medium text-gray-900">
                      {project.name}
                    </h3>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                    <Activity className="h-4 w-4 mr-1" />
                    {project.dataloggers.length} Dataloggers
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-500">{project.description}</p>
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {project.type}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}