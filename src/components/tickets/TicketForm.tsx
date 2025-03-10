import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Paperclip, X } from 'lucide-react';
import { companies } from '../../data/mockData';
import { useTicketStore } from '../../store/ticketStore';
import { handleFileUpload } from '../../utils/fileHandler';

interface TicketFormProps {
  onClose?: () => void;
  isModal?: boolean;
}

export default function TicketForm({ onClose, isModal = false }: TicketFormProps) {
  const navigate = useNavigate();
  const addTicket = useTicketStore((state) => state.addTicket);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<string>('hardware');
  const [priority, setPriority] = useState<string>('medium');
  const [companyId, setCompanyId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [dataloggerId, setDataloggerId] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedCompany = companies.find(c => c.id === companyId);
  const selectedProject = selectedCompany?.projects.find(p => p.id === projectId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !companyId) return;

    setIsSubmitting(true);
    try {
      const attachments = await Promise.all(
        files.map(file => handleFileUpload(file))
      );

      addTicket({
        title,
        description,
        type: type as any,
        priority: priority as any,
        status: 'open',
        companyId,
        projectId: projectId || undefined,
        dataloggerId: dataloggerId || undefined,
        createdBy: 'current-user@example.com',
        messages: [{
          content: description,
          attachments,
          userId: 'current-user',
          userName: 'Current User',
          userRole: 'User'
        }]
      });

      if (isModal && onClose) {
        onClose();
      } else {
        navigate('/support');
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
      alert('Failed to create ticket. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          placeholder="Brief description of the issue"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          placeholder="Detailed description of the issue"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          >
            <option value="hardware">Hardware</option>
            <option value="software">Software</option>
            <option value="connectivity">Connectivity</option>
            <option value="calibration">Calibration</option>
            <option value="maintenance">Maintenance</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Company</label>
        <select
          value={companyId}
          onChange={(e) => {
            setCompanyId(e.target.value);
            setProjectId('');
            setDataloggerId('');
          }}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          required
        >
          <option value="">Select a company</option>
          {companies.map(company => (
            <option key={company.id} value={company.id}>{company.name}</option>
          ))}
        </select>
      </div>

      {companyId && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Project</label>
          <select
            value={projectId}
            onChange={(e) => {
              setProjectId(e.target.value);
              setDataloggerId('');
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          >
            <option value="">Select a project</option>
            {selectedCompany?.projects.map(project => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
        </div>
      )}

      {projectId && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Datalogger</label>
          <select
            value={dataloggerId}
            onChange={(e) => setDataloggerId(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          >
            <option value="">Select a datalogger</option>
            {selectedProject?.dataloggers.map(datalogger => (
              <option key={datalogger.id} value={datalogger.id}>{datalogger.name}</option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Attachments</label>
        <div className="mt-1 flex items-center">
          <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark">
            <span className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <Paperclip className="h-4 w-4 mr-2" />
              Add Files
            </span>
            <input
              type="file"
              className="sr-only"
              multiple
              onChange={handleFileChange}
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
            />
          </label>
        </div>
        {files.length > 0 && (
          <ul className="mt-2 divide-y divide-gray-200">
            {files.map((file, index) => (
              <li key={index} className="py-2 flex items-center justify-between">
                <div className="flex items-center">
                  <Paperclip className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-500">{file.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        {isModal && (
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark disabled:opacity-50"
        >
          <Send className="h-4 w-4 mr-2" />
          {isSubmitting ? 'Creating...' : 'Create Ticket'}
        </button>
      </div>
    </form>
  );

  if (isModal) {
    return formContent;
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Create Support Ticket</h1>
      {formContent}
    </div>
  );
}