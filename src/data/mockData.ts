import { Company, Project, Datalogger, Reading, Alert, SupportTicket } from '../types';

// Función para generar lecturas históricas simuladas
const generateHistoricalReadings = (dataloggerId: string, variables: string[], days: number = 7) => {
  const readings: Reading[] = [];
  const now = new Date();
  
  for (let i = 0; i < days * 24; i++) {
    const timestamp = new Date(now.getTime() - (i * 60 * 60 * 1000));
    const variableReadings: { [key: string]: number } = {};
    
    variables.forEach(variable => {
      let baseValue = 0;
      switch (variable) {
        case 'PM2.5':
          baseValue = 25 + Math.random() * 30;
          break;
        case 'PM10':
          baseValue = 45 + Math.random() * 40;
          break;
        case 'CO2':
          baseValue = 400 + Math.random() * 200;
          break;
        case 'NO2':
          baseValue = 20 + Math.random() * 30;
          break;
        case 'temperatura':
          baseValue = 22 + Math.random() * 8;
          break;
        case 'humedad':
          baseValue = 60 + Math.random() * 20;
          break;
        case 'ruido':
          baseValue = 55 + Math.random() * 25;
          break;
        default:
          baseValue = Math.random() * 100;
      }
      variableReadings[variable] = Number(baseValue.toFixed(2));
    });

    readings.push({
      timestamp: timestamp.toISOString(),
      dataloggerId,
      variables: variableReadings
    });
  }
  
  return readings;
};

export const companies: Company[] = [
  {
    id: 'cdmb',
    name: 'CDMB',
    description: 'Corporación Autónoma Regional para la Defensa de la Meseta de Bucaramanga',
    projects: [
      {
        id: 'cdmb-air',
        companyId: 'cdmb',
        name: 'Red de Calidad del Aire',
        type: 'air',
        description: 'Monitoreo de calidad del aire en el área metropolitana',
        dataloggers: [
          {
            id: 'cdmb-air-001',
            projectId: 'cdmb-air',
            serial: 'CE0125',
            name: 'Estación Centro',
            type: 'calidadAire',
            location: {
              name: 'Centro de Bucaramanga',
              latitude: 7.119349,
              longitude: -73.122742
            },
            variables: ['PM2.5', 'PM10', 'CO2', 'NO2', 'temperatura', 'humedad'],
            lastActivity: new Date().toISOString()
          },
          {
            id: 'cdmb-air-002',
            projectId: 'cdmb-air',
            serial: 'CE0126',
            name: 'Estación Norte',
            type: 'calidadAire',
            location: {
              name: 'Norte de Bucaramanga',
              latitude: 7.129700,
              longitude: -73.125800
            },
            variables: ['PM2.5', 'PM10', 'CO2', 'NO2', 'temperatura', 'humedad'],
            lastActivity: new Date().toISOString()
          },
          {
            id: 'cdmb-air-003',
            projectId: 'cdmb-air',
            serial: 'CE0127',
            name: 'Estación Cabecera',
            type: 'calidadAire',
            location: {
              name: 'Cabecera del Llano',
              latitude: 7.128500,
              longitude: -73.115800
            },
            variables: ['PM2.5', 'PM10', 'CO2', 'NO2', 'temperatura', 'humedad'],
            lastActivity: new Date().toISOString()
          }
        ]
      }
    ]
  },
  {
    id: 'cerrejon',
    name: 'Cerrejón',
    description: 'Complejo de minería de carbón a cielo abierto',
    projects: [
      {
        id: 'cerrejon-air',
        companyId: 'cerrejon',
        name: 'Monitoreo Ambiental Mina',
        type: 'multiple',
        description: 'Red de monitoreo ambiental en zona minera',
        dataloggers: [
          {
            id: 'cerrejon-air-001',
            projectId: 'cerrejon-air',
            serial: 'CE0128',
            name: 'Estación Mina Norte',
            type: 'multiParametro',
            location: {
              name: 'Zona Norte Mina',
              latitude: 11.033333,
              longitude: -72.750000
            },
            variables: ['PM2.5', 'PM10', 'ruido', 'temperatura', 'humedad'],
            lastActivity: new Date().toISOString()
          },
          {
            id: 'cerrejon-air-002',
            projectId: 'cerrejon-air',
            serial: 'CE0129',
            name: 'Estación Mina Sur',
            type: 'multiParametro',
            location: {
              name: 'Zona Sur Mina',
              latitude: 11.023333,
              longitude: -72.740000
            },
            variables: ['PM2.5', 'PM10', 'ruido', 'temperatura', 'humedad'],
            lastActivity: new Date().toISOString()
          }
        ]
      }
    ]
  }
];

// Generar lecturas históricas para todas las estaciones
export const readings: Reading[] = companies.flatMap(company =>
  company.projects.flatMap(project =>
    project.dataloggers.flatMap(datalogger =>
      generateHistoricalReadings(datalogger.id, datalogger.variables)
    )
  )
);

// Generate alerts for dataloggers
export const alerts: Alert[] = companies.flatMap(company =>
  company.projects.flatMap(project =>
    project.dataloggers.flatMap(datalogger => {
      const alerts: Alert[] = [];
      const now = new Date();
      
      // Generate some random alerts for each datalogger
      datalogger.variables.forEach(variable => {
        if (Math.random() > 0.7) { // 30% chance of having an alert
          alerts.push({
            id: `${datalogger.id}-${variable}-${Date.now()}`,
            timestamp: new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
            dataloggerId: datalogger.id,
            variable,
            value: Math.random() * 100,
            severity: Math.random() > 0.6 ? 'critical' : Math.random() > 0.3 ? 'major' : 'minor',
            resolved: Math.random() > 0.5
          });
        }
      });
      
      return alerts;
    })
  )
);

// Generate support tickets
export const supportTickets: SupportTicket[] = [
  {
    id: 'ticket-1',
    title: 'Fallo en sensor de PM2.5',
    description: 'El sensor de PM2.5 de la estación Centro está reportando valores inconsistentes',
    status: 'open',
    priority: 'high',
    type: 'hardware',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'juan.perez@cdmb.gov.co',
    assignedTo: 'soporte.tecnico@intelety.com',
    companyId: 'cdmb',
    projectId: 'cdmb-air',
    dataloggerId: 'cdmb-air-001',
    messages: [
      {
        id: 'msg-1',
        ticketId: 'ticket-1',
        content: 'Hemos detectado que el sensor está reportando valores fuera de rango desde ayer.',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        userId: 'user-1',
        userName: 'Juan Pérez',
        userRole: 'Operador CDMB'
      },
      {
        id: 'msg-2',
        ticketId: 'ticket-1',
        content: 'Revisaremos el sensor remotamente y programaremos una visita si es necesario.',
        createdAt: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(),
        userId: 'support-1',
        userName: 'Carlos Rodríguez',
        userRole: 'Soporte Técnico'
      }
    ]
  },
  {
    id: 'ticket-2',
    title: 'Problemas de conectividad',
    description: 'La estación Mina Norte presenta intermitencia en la conexión',
    status: 'in_progress',
    priority: 'medium',
    type: 'connectivity',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'operador@cerrejon.com',
    assignedTo: 'redes@intelety.com',
    companyId: 'cerrejon',
    projectId: 'cerrejon-air',
    dataloggerId: 'cerrejon-air-001',
    messages: [
      {
        id: 'msg-3',
        ticketId: 'ticket-2',
        content: 'La estación presenta pérdidas de conexión frecuentes desde esta mañana.',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        userId: 'user-2',
        userName: 'María González',
        userRole: 'Supervisora Cerrejón'
      }
    ]
  }
];