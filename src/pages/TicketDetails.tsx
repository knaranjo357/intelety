import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  PauseCircle,
  Trash2
} from 'lucide-react';
import { companies } from '../data/mockData';
import { useTicketStore } from '../store/ticketStore';
import TicketChat from '../components/tickets/TicketChat';

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

export default function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTicket, updateTicket, deleteTicket } = useTicketStore();
  
  const ticket = getTicket(id!);
  
  if (!ticket) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Ticket not found</h2>
        <p className="mt-2 text-gray-500">The ticket you're looking for doesn't exist or has been deleted.</p>
        <Link
          to="/support"
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark"
        >
          Return to Support
        </Link>
      </div>
    );
  }

  const company = companies.find(c => c.id === ticket.companyId);
  const project = company?.projects.find(p => p.id === ticket.projectId);
  const datalogger = project?.dataloggers.find(d => d.id === ticket.dataloggerId);
  const StatusIcon = statusConfig[ticket.status].icon;

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateTicket(ticket.id, { status: e.target.value as typeof ticket.status });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this ticket? This action cannot be undone.')) {
      deleteTicket(ticket.id);
      navigate('/support');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Link to="/support" className="hover:text-primary">Support</Link>
          <span>/</span>
          <span>Ticket #{ticket.id}</span>
        </div>
        <button
          onClick={handleDelete}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Ticket
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${statusConfig[ticket.status].className}`}>
                <StatusIcon className="h-5 w-5" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">{ticket.title}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityConfig[ticket.priority]}`}>
                {ticket.priority}
              </span>
              <select
                className="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                value={ticket.status}
                onChange={handleStatusChange}
              >
                {Object.entries(statusConfig).map(([key, { label }]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-2 flex items-center space-x-2 text-sm text-gray-500">
            <span>{company?.name}</span>
            {project && (
              <>
                <span>•</span>
                <Link to={`/projects/${project.id}`} className="hover:text-primary">
                  {project.name}
                </Link>
              </>
            )}
            {datalogger && (
              <>
                <span>•</span>
                <span>{datalogger.name}</span>
              </>
            )}
          </div>
          <div className="mt-2 text-sm text-gray-500">
            Created {format(new Date(ticket.createdAt), 'PPp')} by {ticket.createdBy}
          </div>
        </div>

        <div className="h-[600px] flex flex-col">
          <TicketChat ticketId={ticket.id} />
        </div>
      </div>
    </div>
  );
}