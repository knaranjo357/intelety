import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';

interface AIAssistantProps {
  onSuggest: (components: any[]) => void;
}

export default function AIAssistant({ onSuggest }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsThinking(true);

    // Simulate AI response
    setTimeout(() => {
      // Example response format
      const suggestedComponents = [
        {
          type: 'chart',
          config: {
            title: 'Temperature Trends',
            dataloggerId: 'cdmb-air-001',
            variable: 'temperatura'
          }
        },
        {
          type: 'stat',
          config: {
            title: 'Average PM2.5',
            dataloggerId: 'cdmb-air-001',
            variable: 'PM2.5',
            unit: 'µg/m³'
          }
        }
      ];

      onSuggest(suggestedComponents);
      setIsThinking(false);
      setPrompt('');
    }, 1500);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 p-4 bg-primary text-white rounded-full shadow-lg hover:bg-primary-dark transition-colors"
      >
        <MessageSquare className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-4 w-96 bg-white rounded-lg shadow-xl border border-gray-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium">AI Assistant</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-4 h-64 overflow-y-auto">
            <p className="text-sm text-gray-600 mb-4">
              Describe the report you want to create and I'll help you set it up.
            </p>

            <form onSubmit={handleSubmit}>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Create a report showing temperature trends and air quality statistics for the last week"
                className="w-full h-32 p-3 border border-gray-300 rounded-md focus:border-primary focus:ring-primary"
                disabled={isThinking}
              />

              <button
                type="submit"
                disabled={!prompt.trim() || isThinking}
                className="mt-2 w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isThinking ? 'Thinking...' : 'Generate Report'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}