import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ReportComponent {
  id: string;
  type: string;
  config: any;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Report {
  id: string;
  name: string;
  description: string;
  timeRange: string;
  components: ReportComponent[];
  createdAt: string;
  updatedAt: string;
}

interface ReportState {
  reports: Report[];
  addReport: (report: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateReport: (id: string, report: Partial<Report>) => void;
  deleteReport: (id: string) => void;
  getReport: (id: string) => Report | undefined;
}

export const useReportStore = create<ReportState>()(
  persist(
    (set, get) => ({
      reports: [],
      addReport: (report) => {
        const newReport = {
          ...report,
          id: `report-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ reports: [...state.reports, newReport] }));
      },
      updateReport: (id, updatedReport) => {
        set((state) => ({
          reports: state.reports.map((report) =>
            report.id === id
              ? { ...report, ...updatedReport, updatedAt: new Date().toISOString() }
              : report
          ),
        }));
      },
      deleteReport: (id) => {
        set((state) => ({
          reports: state.reports.filter((report) => report.id !== id),
        }));
      },
      getReport: (id) => {
        return get().reports.find((report) => report.id === id);
      },
    }),
    {
      name: 'report-storage',
    }
  )
);