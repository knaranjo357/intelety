import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  Activity, 
  Map, 
  AlertTriangle, 
  Home, 
  BarChart3, 
  Building2, 
  FolderKanban,
  Menu,
  X,
  Database,
  HeadphonesIcon,
  ChevronLeft,
  ChevronRight,
  Brain
} from 'lucide-react';

const navigation = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Reports', path: '/reports', icon: BarChart3 },
  { name: 'Companies', path: '/companies', icon: Building2 },
  { name: 'Projects', path: '/projects', icon: FolderKanban },
  { name: 'Dataloggers', path: '/dataloggers', icon: Database },
  { name: 'Map', path: '/map', icon: Map },
  { name: 'Forecast', path: '/forecast', icon: Brain },
  { name: 'Alerts', path: '/alerts', icon: AlertTriangle },
  { name: 'Support', path: '/support', icon: HeadphonesIcon },
];

export default function Layout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 bg-white transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out ${
          sidebarExpanded ? 'w-64' : 'w-20'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-primary" />
            {sidebarExpanded && (
              <span className="ml-2 text-xl font-bold text-gray-900">Intelety</span>
            )}
          </div>
          <div className="flex items-center">
            {!isMobile && (
              <button
                onClick={() => setSidebarExpanded(!sidebarExpanded)}
                className="p-1 rounded-md text-gray-500 hover:text-gray-600 focus:outline-none"
              >
                {sidebarExpanded ? (
                  <ChevronLeft className="h-6 w-6" />
                ) : (
                  <ChevronRight className="h-6 w-6" />
                )}
              </button>
            )}
            {isMobile && (
              <button 
                onClick={() => setSidebarOpen(false)}
                className="p-1 rounded-md text-gray-500 hover:text-gray-600 focus:outline-none"
              >
                <X className="h-6 w-6" />
              </button>
            )}
          </div>
        </div>
        <nav className="mt-5 px-2 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                }`}
                onMouseEnter={(e) => {
                  if (!sidebarExpanded) {
                    const tooltip = document.createElement('div');
                    tooltip.className = 'fixed z-50 px-2 py-1 text-sm text-white bg-gray-900 rounded';
                    tooltip.style.left = `${e.currentTarget.offsetWidth + 20}px`;
                    tooltip.style.top = `${e.currentTarget.offsetTop}px`;
                    tooltip.textContent = item.name;
                    e.currentTarget.appendChild(tooltip);
                  }
                }}
                onMouseLeave={(e) => {
                  if (!sidebarExpanded) {
                    const tooltip = e.currentTarget.querySelector('div');
                    if (tooltip) tooltip.remove();
                  }
                }}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-gray-400 group-hover:text-primary'}`} />
                {sidebarExpanded && <span className="ml-3">{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile menu button */}
      <div className="fixed top-0 left-0 z-40 p-4 md:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className={`p-2 rounded-md text-gray-500 hover:text-gray-600 focus:outline-none ${sidebarOpen ? 'hidden' : ''}`}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Overlay */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div 
        className={`flex-1 transition-all duration-300 ease-in-out ${
          sidebarOpen ? (sidebarExpanded ? 'ml-64' : 'ml-20') : 'ml-0'
        }`}
      >
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}