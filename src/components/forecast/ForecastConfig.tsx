import React, { useState } from 'react';
import { X, Brain, Save } from 'lucide-react';

interface ForecastConfigProps {
  isOpen: boolean;
  onClose: () => void;
  datalogger: any;
}

export default function ForecastConfig({ isOpen, onClose, datalogger }: ForecastConfigProps) {
  const [selectedVariables, setSelectedVariables] = useState<string[]>([]);
  const [modelType, setModelType] = useState('siso'); // 'siso' or 'miso'
  const [pastSteps, setPastSteps] = useState(24);
  const [futureSteps, setFutureSteps] = useState(12);
  const [preprocessing, setPreprocessing] = useState<string[]>([]);
  const [splitRatios, setSplitRatios] = useState({
    training: 70,
    validation: 15,
    test: 15
  });

  if (!isOpen) return null;

  const handleVariableChange = (variable: string) => {
    setSelectedVariables(prev =>
      prev.includes(variable)
        ? prev.filter(v => v !== variable)
        : [...prev, variable]
    );
  };

  const handlePreprocessingChange = (method: string) => {
    setPreprocessing(prev =>
      prev.includes(method)
        ? prev.filter(m => m !== method)
        : [...prev, method]
    );
  };

  const handleSplitRatioChange = (type: keyof typeof splitRatios, value: number) => {
    const newRatios = { ...splitRatios, [type]: value };
    const total = Object.values(newRatios).reduce((sum, val) => sum + val, 0);
    
    if (total === 100) {
      setSplitRatios(newRatios);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically save the configuration and start the forecast process
    console.log({
      datalogger,
      selectedVariables,
      modelType,
      pastSteps,
      futureSteps,
      preprocessing,
      splitRatios
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg max-w-3xl w-full mx-4 shadow-xl">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Brain className="h-5 w-5 text-primary mr-2" />
                <h3 className="text-lg font-medium text-gray-900">
                  Configure Forecast - {datalogger.name}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="px-6 py-4 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Variables to Forecast
                </label>
                <div className="space-y-2">
                  {datalogger.variables.map((variable: string) => (
                    <label key={variable} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedVariables.includes(variable)}
                        onChange={() => handleVariableChange(variable)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="ml-2 text-sm text-gray-700">{variable}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Model Type
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="siso"
                      checked={modelType === 'siso'}
                      onChange={(e) => setModelType(e.target.value)}
                      className="border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      SISO (Single Input Single Output)
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="miso"
                      checked={modelType === 'miso'}
                      onChange={(e) => setModelType(e.target.value)}
                      className="border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      MISO (Multiple Input Single Output)
                    </span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Past Steps (n_steps)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={pastSteps}
                    onChange={(e) => setPastSteps(parseInt(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Future Steps
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={futureSteps}
                    onChange={(e) => setFutureSteps(parseInt(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data Preprocessing
                </label>
                <div className="space-y-2">
                  {[
                    'normalization',
                    'standardization',
                    'moving_average',
                    'exponential_smoothing',
                    'differencing'
                  ].map((method) => (
                    <label key={method} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={preprocessing.includes(method)}
                        onChange={() => handlePreprocessingChange(method)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {method.split('_').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data Split Ratios (%)
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500">Training</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={splitRatios.training}
                      onChange={(e) => handleSplitRatioChange('training', parseInt(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500">Validation</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={splitRatios.validation}
                      onChange={(e) => handleSplitRatioChange('validation', parseInt(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500">Test</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={splitRatios.test}
                      onChange={(e) => handleSplitRatioChange('test', parseInt(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    />
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Total must equal 100%
                </p>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Configuration
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}