import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Reports from './pages/Reports';
import ReportEditor from './pages/ReportEditor';
import Companies from './pages/Companies';
import CompanyDetails from './pages/CompanyDetails';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import Dataloggers from './pages/Dataloggers';
import Map from './pages/Map';
import Alerts from './pages/Alerts';
import Support from './pages/Support';
import TicketDetails from './pages/TicketDetails';
import Forecast from './pages/Forecast';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="reports" element={<Reports />} />
          <Route path="reports/new" element={<ReportEditor />} />
          <Route path="reports/:id" element={<ReportEditor />} />
          <Route path="reports/:id/edit" element={<ReportEditor />} />
          <Route path="companies" element={<Companies />} />
          <Route path="companies/:id" element={<CompanyDetails />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:id" element={<ProjectDetails />} />
          <Route path="dataloggers" element={<Dataloggers />} />
          <Route path="map" element={<Map />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="support" element={<Support />} />
          <Route path="support/:id" element={<TicketDetails />} />
          <Route path="forecast" element={<Forecast />} />
          <Route path="*" element={<div>Page not found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;