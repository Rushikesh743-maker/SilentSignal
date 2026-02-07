import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SOSProvider, useSOS } from '@/context/SOSContext';
import { Navigation } from '@/components/Navigation';
import { FakeCalculator } from '@/components/FakeCalculator';
import Home from '@/pages/Home';
import Contacts from '@/pages/Contacts';
import Logs from '@/pages/Logs';
import Settings from '@/pages/Settings';

function AppContent() {
  const { appState } = useSOS();

  // Show fake screen when active
  if (appState.isFakeScreenActive) {
    return <FakeCalculator />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
      <Navigation />
    </div>
  );
}

export default function Index() {
  return (
    <SOSProvider>
      <AppContent />
    </SOSProvider>
  );
}
