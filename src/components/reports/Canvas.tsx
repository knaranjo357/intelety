import React from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import {
  TextComponent,
  ChartComponent,
  TableComponent,
  StatComponent,
  ImageComponent
} from '../dashboard/DashboardComponents';
import { Settings } from 'lucide-react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface CanvasProps {
  components: any[];
  onLayoutChange: (layout: any[]) => void;
  onEditComponent: (component: any) => void;
}

export default function Canvas({ components, onLayoutChange, onEditComponent }: CanvasProps) {
  const renderComponent = (component: any) => {
    switch (component.type) {
      case 'text':
        return <TextComponent config={component.config} />;
      case 'chart':
        return <ChartComponent config={component.config} />;
      case 'table':
        return <TableComponent config={component.config} />;
      case 'stat':
        return <StatComponent config={component.config} />;
      case 'image':
        return <ImageComponent config={component.config} />;
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-[600px] bg-white rounded-lg shadow-sm p-4">
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-full grid grid-cols-12 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="border-l border-gray-200 first:border-l-0 h-full"
            />
          ))}
        </div>
      </div>

      {components.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-gray-400">
          <p className="text-lg">Add components to create your report</p>
        </div>
      ) : (
        <ResponsiveGridLayout
          className="layout"
          layouts={{ lg: components }}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={50}
          onLayoutChange={(layout) => {
            onLayoutChange(
              layout.map(l => ({
                ...components.find(c => c.i === l.i),
                ...l
              }))
            );
          }}
          isDraggable
          isResizable
          resizeHandles={['s', 'w', 'e', 'n', 'sw', 'nw', 'se', 'ne']}
        >
          {components.map(component => (
            <div
              key={component.i}
              className="bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <div className="absolute top-2 right-2 z-10">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onEditComponent(component);
                  }}
                  className="p-2 rounded-md bg-white shadow-sm hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  aria-label={`Configure ${component.type} component`}
                >
                  <Settings className="h-4 w-4 text-gray-500" />
                </button>
              </div>
              {renderComponent(component)}
            </div>
          ))}
        </ResponsiveGridLayout>
      )}
    </div>
  );
}