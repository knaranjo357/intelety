import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Save } from 'lucide-react';
import ComponentConfig from '../components/dashboard/ComponentConfig';
import ComponentPalette from '../components/reports/ComponentPalette';
import Canvas from '../components/reports/Canvas';
import AIAssistant from '../components/reports/AIAssistant';
import { useReportStore } from '../store/reportStore';

const timeRanges = [
  { id: '1', name: 'Last 24 hours' },
  { id: '5', name: 'Last 5 days' },
  { id: '7', name: 'Last 7 days' },
  { id: '30', name: 'Last 30 days' }
];

export default function ReportEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addReport, updateReport, getReport } = useReportStore();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [timeRange, setTimeRange] = useState('1');
  const [components, setComponents] = useState<any[]>([]);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [editingComponent, setEditingComponent] = useState<any>(null);
  const [showComponentPalette, setShowComponentPalette] = useState(false);

  useEffect(() => {
    if (id) {
      const report = getReport(id);
      if (report) {
        setName(report.name);
        setDescription(report.description);
        setTimeRange(report.timeRange);
        setComponents(report.components);
      }
    }
  }, [id, getReport]);

  const handleAddComponent = (type: string) => {
    setSelectedType(type);
    setEditingComponent(null);
    setConfigModalOpen(true);
    setShowComponentPalette(false);
  };

  const handleSaveComponent = (config: any) => {
    if (editingComponent) {
      setComponents(components.map(c =>
        c.i === editingComponent.i ? { ...c, config } : c
      ));
    } else {
      const newComponent = {
        i: `${selectedType}-${Date.now()}`,
        x: (components.length * 4) % 12,
        y: Infinity,
        w: config.width || 4,
        h: config.height || 4,
        type: selectedType,
        config
      };
      setComponents([...components, newComponent]);
    }
    setConfigModalOpen(false);
    setEditingComponent(null);
  };

  const handleLayoutChange = (newLayout: any[]) => {
    setComponents(newLayout);
  };

  const handleEditComponent = (component: any) => {
    setSelectedType(component.type);
    setEditingComponent(component);
    setConfigModalOpen(true);
  };

  const handleAISuggest = (suggestedComponents: any[]) => {
    const newComponents = suggestedComponents.map((component, index) => ({
      ...component,
      i: `${component.type}-${Date.now()}-${index}`,
      x: (components.length + index) * 4 % 12,
      y: Infinity,
      w: 4,
      h: 4,
    }));
    setComponents([...components, ...newComponents]);
  };

  const handleSaveReport = () => {
    if (!name.trim()) {
      alert('Please enter a report name');
      return;
    }

    const reportData = {
      name,
      description,
      timeRange,
      components
    };

    if (id) {
      updateReport(id, reportData);
    } else {
      addReport(reportData);
    }

    navigate('/reports');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Report Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              placeholder="Enter report name"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              placeholder="Enter report description"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <select
            className="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            {timeRanges.map(range => (
              <option key={range.id} value={range.id}>{range.name}</option>
            ))}
          </select>
          <button
            onClick={() => setShowComponentPalette(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Component
          </button>
        </div>
        <button
          onClick={handleSaveReport}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Report
        </button>
      </div>

      {showComponentPalette && (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <ComponentPalette onSelect={handleAddComponent} />
        </div>
      )}

      <Canvas
        components={components}
        onLayoutChange={handleLayoutChange}
        onEditComponent={handleEditComponent}
      />

      <ComponentConfig
        isOpen={configModalOpen}
        onClose={() => {
          setConfigModalOpen(false);
          setEditingComponent(null);
        }}
        onSave={handleSaveComponent}
        type={selectedType}
        initialConfig={editingComponent?.config}
      />

      <AIAssistant onSuggest={handleAISuggest} />
    </div>
  );
}