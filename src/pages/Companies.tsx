import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, FolderKanban, Activity, Pencil, Trash2, Plus, X } from 'lucide-react';
import { companies } from '../data/mockData';

interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  company?: typeof companies[0];
  mode: 'add' | 'edit';
}

function CompanyModal({ isOpen, onClose, company, mode }: CompanyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg max-w-lg w-full mx-4 sm:mx-auto shadow-xl">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                {mode === 'add' ? 'Add New Company' : 'Edit Company'}
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
                  Company Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  defaultValue={company?.name}
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  defaultValue={company?.description}
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
              {mode === 'add' ? 'Create Company' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Companies() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<typeof companies[0] | undefined>();
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

  const handleEdit = (company: typeof companies[0]) => {
    setSelectedCompany(company);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedCompany(undefined);
    setModalMode('add');
    setModalOpen(true);
  };

  const handleDelete = (companyId: string) => {
    if (window.confirm('Are you sure you want to delete this company? This action cannot be undone.')) {
      // Handle delete
      console.log('Delete company:', companyId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
        <button
          onClick={handleAdd}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Company
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {companies.map((company) => (
          <div key={company.id} className="bg-white overflow-hidden shadow-lg rounded-lg transition-all hover:shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Building2 className="h-8 w-8 text-primary" />
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      <Link to={`/companies/${company.id}`} className="hover:text-primary transition-colors">
                        {company.name}
                      </Link>
                    </h3>
                    <p className="text-sm text-gray-500">{company.description}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(company)}
                    className="p-1 text-gray-400 hover:text-primary transition-colors"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(company.id)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center text-sm text-gray-500">
                  <FolderKanban className="h-5 w-5 text-primary/60 mr-2" />
                  {company.projects.length} Projects
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <Activity className="h-5 w-5 text-primary/60 mr-2" />
                  {company.projects.reduce((acc, project) => acc + project.dataloggers.length, 0)} Dataloggers
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4">
              <div className="text-sm">
                <Link
                  to={`/companies/${company.id}`}
                  className="font-medium text-primary hover:text-primary-dark transition-colors inline-flex items-center"
                >
                  View details
                  <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <CompanyModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        company={selectedCompany}
        mode={modalMode}
      />
    </div>
  );
}