import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  HeadphonesIcon, 
  Search, 
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  PauseCircle,
  Plus
} from 'lucide-react';
import { companies } from '../data/mockData';
import { useTicketStore } from '../store/ticketStore';
import TicketForm from '../components/tickets/TicketForm';

const statusConfig = {
  open: { icon: AlertCircle, className: 'text-yellow-500 bg-yellow-50', label: 'Open' },
  in_progress: { icon: Clock, className: 'text-blue-500 bg-blue-50', label: 'In Progress' },
  waiting: { icon: PauseCircle, className: 'text-orange-500 bg-orange-50', label: 'Waiting' },
  resolved: { icon: CheckCircle2, className: 'text-green-500 bg-green-50', label: 'Resolved' },
  closed: { icon: XCircle, className: 'text-gray-500 bg-gray-50', label: 'Closed' }
};

const priorityConfig = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-blue-100 text-blue-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800'
};

const categoryConfig = {
  hardware: { label: 'Hardware', color: 'bg-purple-100 text-purple-800' },
  software: { label: 'Software', color: 'bg-indigo-100 text-indigo-800' },
  connectivity: { label: 'Connectivity', color: 'bg-cyan-100 text-cyan-800' },
  calibration: { label: 'Calibration', color: 'bg-teal-100 text-teal-800' },
  maintenance: { label: 'Maintenance', color: 'bg-emerald-100 text-emerald-800' },
  other: { label: 'Other', color: 'bg-gray-100 text-gray-800' }
};

export default function Support() {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { tickets, deleteTicket } = useTicketStore();

  const filteredTickets = tickets.filter(ticket => {
    const matchesStatus = selectedStatus === 'all' || ticket.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || ticket.priority === selectedPriority;
    const matchesCompany = selectedCompany === 'all' || ticket.companyId === selectedCompany;
    const matchesCategory = selectedCategory === 'all' || ticket.type === selectedCategory;
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesPriority && matchesCompany && matchesCategory && matchesSearch;
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this ticket? This action cannot be undone.')) {
      deleteTicket(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Ticket
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
            <select
              id="status"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              {Object.entries(statusConfig).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
            <select
              id="priority"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <select
              id="category"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {Object.entries(categoryConfig).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

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
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">Search</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="search"
                className="block w-full pl-10 rounded-md border-gray-300 focus:border-primary focus:ring-primary"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="divide-y divide-gray-200">
          {filteredTickets.map((ticket) => {
            const StatusIcon = statusConfig[ticket.status].icon;
            const company = companies.find(c => c.id === ticket.companyId);
            const project = company?.projects.find(p => p.id === ticket.projectId);
            const datalogger = project?.dataloggers.find(d => d.id === ticket.dataloggerId);

            return (
              <div key={ticket.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${statusConfig[ticket.status].className}`}>
                      <StatusIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <Link
                        to={`/support/${ticket.id}`}
                        className="text-lg font-medium text-gray-900 hover:text-primary"
                      >
                        {ticket.title}
                      </Link>
                      <div className="mt-1 flex items-center space-x-2 text-sm text-gray-500">
                        <span>{company?.name}</span>
                        {project && (
                          <>
                            <span>•</span>
                            <span>{project.name}</span>
                          </>
                        )}
                        {datalogger && (
                          <>
                            <span>•</span>
                            <span>{datalogger.name}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityConfig[ticket.priority]}`}>
                      {ticket.priority}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryConfig[ticket.type].color}`}>
                      {categoryConfig[ticket.type].label}
                    </span>
                    <span className="text-sm text-gray-500">
                      {format(new Date(ticket.updatedAt), 'PPp')}
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-500">{ticket.description}</p>
                <div className="mt-2 flex items-center space-x-4 text-sm">
                  <span className="text-gray-500">
                    {ticket.messages.length} messages
                  </span>
                  {ticket.assignedTo && (
                    <span className="text-gray-500">
                      Assigned to {ticket.assignedTo}
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {filteredTickets.length === 0 && (
            <div className="p-6 text-center">
              <HeadphonesIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No tickets found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Create a new ticket to get started.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowCreateModal(false)} />
            
            <div className="relative bg-white rounded-lg max-w-3xl w-full mx-4 shadow-xl">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Create Support Ticket</h3>
              </div>
              <div className="p-6">
                <TicketForm onClose={() => setShowCreateModal(false)} isModal />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}