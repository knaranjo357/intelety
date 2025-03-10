import React, { useState, useEffect } from 'react';
import { X, Settings } from 'lucide-react';
import { companies } from '../../data/mockData';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: any) => void;
  type: string;
  initialConfig?: any;
}

export default function ComponentConfig({ isOpen, onClose, onSave, type, initialConfig }: ConfigModalProps) {
  const [config, setConfig] = useState(initialConfig || {});
  const [selectedDataloggers, setSelectedDataloggers] = useState<string[]>([]);
  const [selectedVariables, setSelectedVariables] = useState<string[]>([]);

  // Reset state when modal opens or initialConfig changes
  useEffect(() => {
    if (isOpen) {
      if (initialConfig) {
        setConfig(initialConfig);
        setSelectedDataloggers(
          Array.isArray(initialConfig.dataloggerIds) 
            ? initialConfig.dataloggerIds 
            : initialConfig.dataloggerId 
              ? [initialConfig.dataloggerId]
              : []
        );
        setSelectedVariables(
          Array.isArray(initialConfig.variables)
            ? initialConfig.variables
            : initialConfig.variable
              ? [initialConfig.variable]
              : []
        );
      } else {
        setConfig({});
        setSelectedDataloggers([]);
        setSelectedVariables([]);
      }
    }
  }, [initialConfig, isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedConfig = {
      ...config,
      dataloggerIds: selectedDataloggers,
      variables: selectedVariables
    };
    onSave(updatedConfig);
  };

  const handleDataloggerChange = (dataloggerId: string) => {
    const newSelection = selectedDataloggers.includes(dataloggerId)
      ? selectedDataloggers.filter(id => id !== dataloggerId)
      : [...selectedDataloggers, dataloggerId];
    setSelectedDataloggers(newSelection);
  };

  const handleVariableChange = (variable: string) => {
    const newSelection = selectedVariables.includes(variable)
      ? selectedVariables.filter(v => v !== variable)
      : [...selectedVariables, variable];
    setSelectedVariables(newSelection);
  };

  const availableVariables = Array.from(new Set(
    companies.flatMap(company =>
      company.projects.flatMap(project =>
        project.dataloggers
          .filter(d => selectedDataloggers.includes(d.id))
          .flatMap(d => d.variables)
      )
    )
  ));

  const renderConfigFields = () => {
    switch (type) {
      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                value={config.title || ''}
                onChange={(e) => setConfig({ ...config, title: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Content</label>
              <textarea
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                rows={4}
                value={config.content || ''}
                onChange={(e) => setConfig({ ...config, content: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Size</label>
              <div className="grid grid-cols-2 gap-4 mt-1">
                <div>
                  <label className="block text-xs text-gray-500">Width (columns)</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    value={config.width || 4}
                    onChange={(e) => setConfig({ ...config, width: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500">Height (rows)</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    value={config.height || 4}
                    onChange={(e) => setConfig({ ...config, height: parseInt(e.target.value) })}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'chart':
      case 'table':
      case 'stat':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                value={config.title || ''}
                onChange={(e) => setConfig({ ...config, title: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dataloggers</label>
              <div className="max-h-40 overflow-y-auto space-y-2 border border-gray-200 rounded-md p-2">
                {companies.flatMap(company =>
                  company.projects.flatMap(project =>
                    project.dataloggers.map(datalogger => (
                      <label key={datalogger.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedDataloggers.includes(datalogger.id)}
                          onChange={() => handleDataloggerChange(datalogger.id)}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-gray-700">
                          {company.name} - {project.name} - {datalogger.name}
                        </span>
                      </label>
                    ))
                  )
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Variables</label>
              <div className="max-h-40 overflow-y-auto space-y-2 border border-gray-200 rounded-md p-2">
                {availableVariables.map(variable => (
                  <label key={variable} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedVariables.includes(variable)}
                      onChange={() => handleVariableChange(variable)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">{variable}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Size</label>
              <div className="grid grid-cols-2 gap-4 mt-1">
                <div>
                  <label className="block text-xs text-gray-500">Width (columns)</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    value={config.width || 4}
                    onChange={(e) => setConfig({ ...config, width: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500">Height (rows)</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    value={config.height || 4}
                    onChange={(e) => setConfig({ ...config, height: parseInt(e.target.value) })}
                  />
                </div>
              </div>
            </div>

            {type === 'stat' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Unit</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  value={config.unit || ''}
                  onChange={(e) => setConfig({ ...config, unit: e.target.value })}
                />
              </div>
            )}
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                value={config.title || ''}
                onChange={(e) => setConfig({ ...config, title: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Image URL</label>
              <input
                type="url"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                value={config.url || ''}
                onChange={(e) => setConfig({ ...config, url: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Size</label>
              <div className="grid grid-cols-2 gap-4 mt-1">
                <div>
                  <label className="block text-xs text-gray-500">Width (columns)</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    value={config.width || 4}
                    onChange={(e) => setConfig({ ...config, width: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500">Height (rows)</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    value={config.height || 4}
                    onChange={(e) => setConfig({ ...config, height: parseInt(e.target.value) })}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg max-w-lg w-full mx-4 shadow-xl">
          <form onSubmit={handleSave}>
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Settings className="h-5 w-5 text-primary mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">
                    {initialConfig ? 'Edit' : 'Configure'} {type.charAt(0).toUpperCase() + type.slice(1)} Component
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="px-6 py-4">
              {renderConfigFields()}
            </div>

            <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-md"
              >
                {initialConfig ? 'Update' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}