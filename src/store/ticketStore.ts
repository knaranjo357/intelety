import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: string;
}

export interface Message {
  id: string;
  ticketId: string;
  content: string;
  attachments: Attachment[];
  createdAt: string;
  userId: string;
  userName: string;
  userRole: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  type: 'hardware' | 'software' | 'connectivity' | 'calibration' | 'maintenance' | 'other';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  assignedTo?: string;
  companyId: string;
  projectId?: string;
  dataloggerId?: string;
  messages: Message[];
}

interface TicketState {
  tickets: Ticket[];
  addTicket: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'messages'>) => void;
  updateTicket: (id: string, updates: Partial<Ticket>) => void;
  deleteTicket: (id: string) => void;
  addMessage: (ticketId: string, message: Omit<Message, 'id' | 'ticketId' | 'createdAt'>) => void;
  getTicket: (id: string) => Ticket | undefined;
}

export const useTicketStore = create<TicketState>()(
  persist(
    (set, get) => ({
      tickets: [],
      addTicket: (ticket) => {
        const newTicket: Ticket = {
          ...ticket,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          messages: []
        };
        set((state) => ({ tickets: [...state.tickets, newTicket] }));
      },
      updateTicket: (id, updates) => {
        set((state) => ({
          tickets: state.tickets.map((ticket) =>
            ticket.id === id
              ? { ...ticket, ...updates, updatedAt: new Date().toISOString() }
              : ticket
          )
        }));
      },
      deleteTicket: (id) => {
        set((state) => ({
          tickets: state.tickets.filter((ticket) => ticket.id !== id)
        }));
      },
      addMessage: (ticketId, message) => {
        const newMessage: Message = {
          ...message,
          id: uuidv4(),
          ticketId,
          createdAt: new Date().toISOString()
        };
        set((state) => ({
          tickets: state.tickets.map((ticket) =>
            ticket.id === ticketId
              ? {
                  ...ticket,
                  messages: [...ticket.messages, newMessage],
                  updatedAt: new Date().toISOString()
                }
              : ticket
          )
        }));
      },
      getTicket: (id) => {
        return get().tickets.find((ticket) => ticket.id === id);
      }
    }),
    {
      name: 'ticket-storage'
    }
  )
);