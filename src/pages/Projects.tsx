import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FolderKanban, Search, Activity, Pencil, Trash2, Plus, X } from 'lucide-react';
import { companies } from '../data/mockData';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: ReturnType<typeof getAllProjects>[0];
  mode: 'add' | 'edit';
  companyId?: string;
}

function ProjectModal({ isOpen, onClose, project, mode, companyId }: ProjectModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg max-w-lg w-full mx-4 sm:mx-auto shadow-xl">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                {mode === 'add' ? 'Add New Project' : 'Edit Project'}
              </h3>
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
                  defaultValue={project?.name}
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <select
                  id="type"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  defaultValue={project?.type}
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
                  defaultValue={project?.description}
                />
              </div>

              {mode === 'add' && (
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                    Company
                  </label>
                  <select
                    id="company"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    defaultValue={companyId}
                  >
                    {companies.map(company => (
                      <option key={company.id} value={company.id}>{company.name}</option>
                    ))}
                  </select>
                </div>
              )}
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
              {mode === 'add' ? 'Create Project' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Get all projects with company info
const getAllProjects = () => {
  return companies.flatMap(company => 
    company.projects.map(project => ({
      ...project,
      companyName: company.name,
      companyId: company.id
    }))
  );
};

export default function Projects() {
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ReturnType<typeof getAllProjects>[0] | undefined>();
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

  const allProjects = getAllProjects();
  
  const filteredProjects = allProjects.filter(project => {
    const matchesCompany = selectedCompany === 'all' || project.companyId === selectedCompany;
    const matchesType = selectedType === 'all' || project.type === selectedType;
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCompany && matchesType && matchesSearch;
  });

  const handleEdit = (project: ReturnType<typeof getAllProjects>[0]) => {
    setSelectedProject(project);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedProject(undefined);
    setModalMode('add');
    setModalOpen(true);
  };

  const handleDelete = (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      // Handle delete
      console.log('Delete project:', projectId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <button
          onClick={handleAdd}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company</label>
            <select
              id="company"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
            >
              <option value="all">All Companies</option>
              {companies.map(company => (
                <option key={company.id} value={company.id}>{company.name}</option>
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
              <option value="air">Air Quality</option>
              <option value="water">Water Quality</option>
              <option value="noise">Noise</option>
              <option value="multiple">Multiple Parameters</option>
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
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FolderKanban className="h-6 w-6 text-primary" />
                  <div className="ml-3">
                    <Link
                      to={`/projects/${project.id}`}
                      className="text-lg font-medium text-gray-900 hover:text-primary transition-colors"
                    >
                      {project.name}
                    </Link>
                    <p className="text-sm text-gray-500">{project.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleEdit(project)}
                    className="p-1 text-gray-400 hover:text-primary transition-colors"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="mt-4 flex items-center space-x-4">
                <Link
                  to={`/companies/${project.companyId}`}
                  className="text-sm text-primary hover:text-primary-dark transition-colors"
                >
                  {project.companyName}
                </Link>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  {project.type}
                </span>
                <span className="inline-flex items-center text-sm text-gray-500">
                  <Activity className="h-4 w-4 mr-1" />
                  {project.dataloggers.length} Dataloggers
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ProjectModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        project={selectedProject}
        mode={modalMode}
        companyId={selectedCompany !== 'all' ? selectedCompany : undefined}
      />
    </div>
  );
}