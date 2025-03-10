import React, { useState } from 'react';
import { Bug, X } from 'lucide-react';
import { useReportStore } from '../../store/reportStore';

export default function StateDebugger() {
  const [isOpen, setIsOpen] = useState(false);
  const state = useReportStore();

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 p-4 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition-colors"
      >
        <Bug className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-gray-500 bg-opacity-75">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-y-0 left-0 max-w-full flex">
              <div className="relative w-screen max-w-2xl">
                <div className="h-full flex flex-col bg-white shadow-xl">
                  <div className="flex items-center justify-between px-4 py-3 bg-gray-800 text-white">
                    <h2 className="text-lg font-medium">State Debugger</h2>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="text-gray-400 hover:text-gray-300"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4">
                    <pre className="text-sm font-mono bg-gray-50 p-4 rounded-lg overflow-x-auto">
                      {JSON.stringify(state, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}