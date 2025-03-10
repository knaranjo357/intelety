import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, LayersControl, FeatureGroup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';
import { companies, readings } from '../data/mockData';
import StationModal from '../components/StationModal';
import TimeSlider from '../components/TimeSlider';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const getAllDataloggers = () => {
  return companies.flatMap(company => 
    company.projects.flatMap(project => 
      project.dataloggers.map(datalogger => ({
        ...datalogger,
        companyName: company.name,
        companyId: company.id,
        projectName: project.name,
        projectId: project.id
      }))
    )
  );
};

const getUniqueTimestamps = () => {
  const timestamps = [...new Set(readings.map(r => r.timestamp))];
  return timestamps.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
};

const mapLayers = [
  { id: 'street', name: 'Street View', url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' },
  { id: 'satellite', name: 'Satellite', url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}' },
  { id: 'terrain', name: 'Terrain', url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png' }
];

const getVariableColor = (value: number, variable: string) => {
  let threshold;
  switch (variable) {
    case 'PM2.5':
      if (value <= 12) return '#00ff00';
      if (value <= 35) return '#ffff00';
      if (value <= 55) return '#ff9900';
      return '#ff0000';
    case 'PM10':
      if (value <= 54) return '#00ff00';
      if (value <= 154) return '#ffff00';
      if (value <= 254) return '#ff9900';
      return '#ff0000';
    case 'temperatura':
      if (value <= 20) return '#00ffff';
      if (value <= 25) return '#00ff00';
      if (value <= 30) return '#ffff00';
      return '#ff0000';
    case 'humedad':
      if (value <= 30) return '#ff9900';
      if (value <= 60) return '#00ff00';
      if (value <= 80) return '#ffff00';
      return '#ff0000';
    default:
      if (value <= 25) return '#00ff00';
      if (value <= 50) return '#ffff00';
      if (value <= 75) return '#ff9900';
      return '#ff0000';
  }
};

export default function Map() {
  const bucaramangaCenter = [7.1174, -73.1227];
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [selectedProject, setSelectedProject] = useState('all');
  const [selectedVariable, setSelectedVariable] = useState('all');
  const [selectedTime, setSelectedTime] = useState(getUniqueTimestamps()[0]);
  const [map, setMap] = useState<L.Map | null>(null);
  const [heatmapLayer, setHeatmapLayer] = useState<L.HeatLayer | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDatalogger, setSelectedDatalogger] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);
  const filtersRef = useRef<HTMLDivElement>(null);

  const dataloggers = getAllDataloggers();
  const allVariables = Array.from(new Set(dataloggers.flatMap(d => d.variables)));
  const timestamps = getUniqueTimestamps();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filtersRef.current && !filtersRef.current.contains(event.target as Node)) {
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (map && selectedVariable !== 'all' && selectedTime) {
      if (heatmapLayer) {
        map.removeLayer(heatmapLayer);
      }

      const heatmapData = dataloggers
        .filter(d => d.variables.includes(selectedVariable))
        .map(d => {
          const reading = readings.find(r => 
            r.dataloggerId === d.id && 
            r.timestamp === selectedTime
          );
          const value = reading?.variables[selectedVariable] || 0;
          return [d.location.latitude, d.location.longitude, value];
        });

      const newHeatmapLayer = (L as any).heatLayer(heatmapData, {
        radius: 25,
        blur: 15,
        maxZoom: 10,
        max: Math.max(...heatmapData.map(d => d[2] as number)),
        gradient: {
          0.4: '#0197D6',
          0.6: '#33aede',
          0.7: '#66c5e7',
          0.8: '#99dbef',
          1.0: '#ccf2f8'
        }
      });

      newHeatmapLayer.addTo(map);
      setHeatmapLayer(newHeatmapLayer);
    }
  }, [map, selectedVariable, selectedTime]);

  useEffect(() => {
    if (map) {
      const filteredDataloggers = dataloggers.filter(datalogger => {
        if (selectedCompany !== 'all') {
          const company = companies.find(c => 
            c.projects.some(p => p.dataloggers.some(d => d.id === datalogger.id))
          );
          if (company?.id !== selectedCompany) return false;
        }
        if (selectedProject !== 'all' && !datalogger.projectId.includes(selectedProject)) return false;
        return true;
      });

      if (filteredDataloggers.length > 0) {
        const bounds = L.latLngBounds(
          filteredDataloggers.map(d => [d.location.latitude, d.location.longitude])
        );
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [selectedCompany, selectedProject, map]);

  return (
    <div className="h-[70vh] relative">
      <TimeSlider
        timestamps={timestamps}
        selectedTime={selectedTime}
        onChange={setSelectedTime}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
      />

      {showFilters && (
        <div 
          ref={filtersRef}
          className="absolute top-24 right-4 z-10 bg-white rounded-lg shadow-lg p-4 w-64 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
            <select
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
            >
              <option value="all">All Companies</option>
              {companies.map(company => (
                <option key={company.id} value={company.id}>{company.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
            <select
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
            >
              <option value="all">All Projects</option>
              {companies
                .filter(c => selectedCompany === 'all' || c.id === selectedCompany)
                .flatMap(c => c.projects)
                .map(project => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Variable</label>
            <select
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              value={selectedVariable}
              onChange={(e) => setSelectedVariable(e.target.value)}
            >
              <option value="all">All Variables</option>
              {allVariables.map(variable => (
                <option key={variable} value={variable}>{variable}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="absolute inset-0 mt-20">
        <MapContainer
          center={bucaramangaCenter as L.LatLngExpression}
          zoom={13}
          style={{ height: '70%', width: '100%' }}
          className="z-0"
          whenCreated={setMap}
        >
          <LayersControl position="topright">
            {mapLayers.map((layer) => (
              <LayersControl.BaseLayer 
                key={layer.id} 
                name={layer.name}
                checked={layer.id === 'satellite'}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url={layer.url}
                />
              </LayersControl.BaseLayer>
            ))}

            <LayersControl.Overlay name="Stations" checked>
              <FeatureGroup>
                {dataloggers
                  .filter(datalogger => {
                    if (selectedCompany !== 'all') {
                      const company = companies.find(c => 
                        c.projects.some(p => p.id === datalogger.projectId)
                      );
                      if (company?.id !== selectedCompany) return false;
                    }
                    if (selectedProject !== 'all' && datalogger.projectId !== selectedProject) return false;
                    if (selectedVariable !== 'all' && !datalogger.variables.includes(selectedVariable)) return false;
                    return true;
                  })
                  .map((datalogger) => {
                    const reading = readings.find(r => 
                      r.dataloggerId === datalogger.id && 
                      r.timestamp === selectedTime
                    );
                    
                    const currentValue = selectedVariable !== 'all' && reading
                      ? reading.variables[selectedVariable]
                      : null;
                    
                    const markerColor = currentValue !== null 
                      ? getVariableColor(currentValue, selectedVariable)
                      : '#0197D6';

                    const customIcon = L.divIcon({
                      className: 'custom-div-icon',
                      html: `
                        <div style="
                          background-color: ${markerColor};
                          width: 20px;
                          height: 20px;
                          border-radius: 50%;
                          border: 2px solid white;
                          box-shadow: 0 0 4px rgba(0,0,0,0.4);
                          cursor: pointer;
                        "></div>
                        ${currentValue !== null ? `
                          <div style="
                            position: absolute;
                            top: -25px;
                            left: 50%;
                            transform: translateX(-50%);
                            background: white;
                            padding: 2px 4px;
                            border-radius: 4px;
                            font-size: 12px;
                            box-shadow: 0 0 4px rgba(0,0,0,0.2);
                          ">${currentValue.toFixed(1)}</div>
                        ` : ''}
                      `,
                      iconSize: [20, 20],
                      iconAnchor: [10, 10]
                    });

                    return (
                      <Marker
                        key={datalogger.id}
                        position={[datalogger.location.latitude, datalogger.location.longitude]}
                        icon={customIcon}
                        eventHandlers={{
                          click: () => {
                            setSelectedDatalogger(datalogger);
                            setModalOpen(true);
                          }
                        }}
                      />
                    );
                  })}
              </FeatureGroup>
            </LayersControl.Overlay>
          </LayersControl>
        </MapContainer>
      </div>

      {selectedDatalogger && (
        <StationModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          datalogger={selectedDatalogger}
          timestamp={selectedTime}
        />
      )}
    </div>
  );
}