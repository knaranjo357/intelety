import React from 'react';
import { BarChart3, Table, Type, Image, Activity } from 'lucide-react';

const componentTypes = [
  { id: 'text', name: 'Text', icon: Type, description: 'Add text content' },
  { id: 'chart', name: 'Chart', icon: BarChart3, description: 'Visualize data with charts' },
  { id: 'table', name: 'Table', icon: Table, description: 'Display data in a table format' },
  { id: 'stat', name: 'Statistics', icon: Activity, description: 'Show statistical values' },
  { id: 'image', name: 'Image', icon: Image, description: 'Display images' }
];

interface ComponentPaletteProps {
  onSelect: (type: string) => void;
}

export default function ComponentPalette({ onSelect }: ComponentPaletteProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {componentTypes.map(type => (
        <button
          key={type.id}
          onClick={() => onSelect(type.id)}
          className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors group"
        >
          <type.icon className="h-8 w-8 text-gray-400 group-hover:text-primary mb-2" />
          <span className="text-sm font-medium text-gray-700 group-hover:text-primary">
            {type.name}
          </span>
          <span className="text-xs text-gray-500 text-center mt-1">
            {type.description}
          </span>
        </button>
      ))}
    </div>
  );
}