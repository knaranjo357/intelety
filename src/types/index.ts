export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'support';
  companyAccess: string[];
}

export interface Company {
  id: string;
  name: string;
  logo?: string;
  description: string;
  projects: Project[];
}

export interface Project {
  id: string;
  companyId: string;
  name: string;
  type: 'air' | 'water' | 'noise' | 'multiple';
  description: string;
  dataloggers: Datalogger[];
}

export interface Datalogger {
  id: string;
  projectId: string;
  serial: string;
  name: string;
  type: string;
  location: {
    name: string;
    latitude: number;
    longitude: number;
  };
  variables: string[];
  lastActivity: string;
}

export interface Reading {
  timestamp: string;
  dataloggerId: string;
  variables: {
    [key: string]: number;
  };
}

export interface Alert {
  id: string;
  timestamp: string;
  dataloggerId: string;
  variable: string;
  value: number;
  severity: 'minor' | 'major' | 'critical';
  resolved: boolean;
}

export interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  type: 'hardware' | 'software' | 'connectivity' | 'calibration' | 'other';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  assignedTo?: string;
  companyId: string;
  projectId?: string;
  dataloggerId?: string;
  messages: SupportMessage[];
}

export interface SupportMessage {
  id: string;
  ticketId: string;
  content: string;
  createdAt: string;
  userId: string;
  userName: string;
  userRole: string;
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
}