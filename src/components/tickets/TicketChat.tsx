import React, { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { Send, Paperclip, X } from 'lucide-react';
import { useTicketStore, type Message } from '../../store/ticketStore';
import { handleFileUpload } from '../../utils/fileHandler';

interface TicketChatProps {
  ticketId: string;
}

export default function TicketChat({ ticketId }: TicketChatProps) {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { addMessage, getTicket } = useTicketStore();
  const ticket = getTicket(ticketId);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [ticket?.messages]);

  if (!ticket) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && files.length === 0) return;

    setIsSubmitting(true);
    try {
      const attachments = await Promise.all(
        files.map(file => handleFileUpload(file))
      );

      addMessage(ticketId, {
        content: message,
        attachments,
        userId: 'current-user',
        userName: 'Current User',
        userRole: 'User'
      });

      setMessage('');
      setFiles([]);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
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

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {ticket.messages.map((message: Message) => (
          <div key={message.id} className="flex space-x-3">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                <span className="text-white font-medium">
                  {message.userName.charAt(0)}
                </span>
              </div>
            </div>
            <div className="flex-grow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">
                    {message.userName}
                  </span>
                  <span className="text-sm text-gray-500">
                    {message.userRole}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {format(new Date(message.createdAt), 'PPp')}
                </span>
              </div>
              <div className="mt-1 text-sm text-gray-700">
                {message.content}
              </div>
              {message.attachments && message.attachments.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {message.attachments.map((attachment) => (
                    <a
                      key={attachment.id}
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Paperclip className="h-4 w-4 mr-1" />
                      {attachment.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              rows={3}
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary pr-12"
            />
            <div className="absolute bottom-2 right-2 flex space-x-2">
              <label className="cursor-pointer">
                <input
                  type="file"
                  className="sr-only"
                  multiple
                  onChange={handleFileChange}
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                />
                <Paperclip className="h-5 w-5 text-gray-400 hover:text-gray-500" />
              </label>
              <button
                type="submit"
                disabled={isSubmitting || (!message.trim() && files.length === 0)}
                className="text-primary hover:text-primary-dark disabled:opacity-50"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>

          {files.length > 0 && (
            <div className="space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
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
                </div>
              ))}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}