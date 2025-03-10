import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Activity, MapPin, List, Clock, Pencil, Trash2, Plus, X } from 'lucide-react';
import { companies } from '../data/mockData';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: NonNullable<ReturnType<typeof useProject>>;
  company: NonNullable<ReturnType<typeof useCompany>>;
}

function ProjectModal({ isOpen, onClose, project, company }: ProjectModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg max-w-lg w-full mx-4 sm:mx-auto shadow-xl">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Edit Project</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <form className="px-6 py-4">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Project Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  defaultValue={project.name}
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <select
                  id="type"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  defaultValue={project.type}
                >
                  <option value="air">Air Quality</option>
                  <option value="water">Water Quality</option>
                  <option value="noise">Noise</option>
                  <option value="multiple">Multiple Parameters</option>
                </select>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  defaultValue={project.description}
                />
              </div>
            </div>
          </form>

          <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-md"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const useProject = () => {
  const { id } = useParams();
  return companies.find(c => c.projects.some(p => p.id === id))?.projects.find(p => p.id === id);
};

const useCompany = () => {
  const { id } = useParams();
  return companies.find(c => c.projects.some(p => p.id === id));
};

export default function ProjectDetails() {
  const [modalOpen, setModalOpen] = useState(false);
  const project = useProject();
  const company = useCompany();

  if (!project || !company) {
    return <div>Project not found</div>;
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      // Handle delete
      console.log('Delete project:', project.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <Link to="/companies" className="hover:text-primary">Companies</Link>
        <span>/</span>
        <Link to={`/companies/${company.id}`} className="hover:text-primary">{company.name}</Link>
        <span>/</span>
        <span>{project.name}</span>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
            <p className="mt-2 text-gray-500">{project.description}</p>
            <div className="mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {project.type}
              </span>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </button>
            <button
              className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Datalogger
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Dataloggers</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {project.dataloggers.map((datalogger) => (
            <div key={datalogger.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{datalogger.name}</h3>
                    <p className="text-sm text-gray-500">Serial: {datalogger.serial}</p>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-primary/60" />
                      Last Activity: {format(new Date(datalogger.lastActivity), 'PPp')}
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-primary/60" />
                      Location: {datalogger.location.name} ({datalogger.location.latitude}, {datalogger.location.longitude})
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-500">
                      <List className="h-4 w-4 mr-1 text-primary/60" />
                      Variables ({datalogger.variables.length}):
                    </div>
                    <div className="flex flex-wrap gap-2">
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

                <div className="flex space-x-2">
                  <button className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </button>
                  <button className="inline-flex items-center px-3 py-1 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark transition-colors">
                    View Data
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ProjectModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        project={project}
        company={company}
      />
    </div>
  );
}