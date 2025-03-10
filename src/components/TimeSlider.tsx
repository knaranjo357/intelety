import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Sun, Moon, Filter } from 'lucide-react';

interface TimeSliderProps {
  timestamps: string[];
  selectedTime: string;
  onChange: (time: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
}

export default function TimeSlider({ timestamps, selectedTime, onChange, showFilters, onToggleFilters }: TimeSliderProps) {
  const currentHour = new Date(selectedTime).getHours();
  const isDaytime = currentHour >= 6 && currentHour < 18;
  const sortedTimestamps = [...timestamps].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  return (
    <div className="absolute top-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-4 z-10">
      <div className="max-w-4xl mx-auto space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isDaytime ? (
              <Sun className="h-5 w-5 text-yellow-500" />
            ) : (
              <Moon className="h-5 w-5 text-blue-500" />
            )}
            <span className="text-sm font-medium text-gray-700">
              {format(new Date(selectedTime), "h:mm a, d 'de' MMMM", { locale: es })}
            </span>
          </div>
          <button
            onClick={onToggleFilters}
            className={`flex items-center px-3 py-1.5 rounded-md transition-colors ${
              showFilters 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
        </div>
        
        <div className="relative">
          <input
            type="range"
            min="0"
            max={sortedTimestamps.length - 1}
            value={sortedTimestamps.indexOf(selectedTime)}
            onChange={(e) => onChange(sortedTimestamps[parseInt(e.target.value)])}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, 
                ${isDaytime ? '#fbbf24' : '#3b82f6'} 0%,
                ${isDaytime ? '#fbbf24' : '#3b82f6'} ${(sortedTimestamps.indexOf(selectedTime) / (sortedTimestamps.length - 1)) * 100}%,
                #e5e7eb ${(sortedTimestamps.indexOf(selectedTime) / (sortedTimestamps.length - 1)) * 100}%,
                #e5e7eb 100%)`
            }}
          />
          <div 
            className="absolute left-0 right-0 -bottom-6 h-1"
            style={{
              background: 'linear-gradient(to right, rgba(59, 130, 246, 0.1) 0%, rgba(251, 191, 36, 0.1) 50%, rgba(59, 130, 246, 0.1) 100%)'
            }}
          />
        </div>
      </div>
    </div>
  );
}