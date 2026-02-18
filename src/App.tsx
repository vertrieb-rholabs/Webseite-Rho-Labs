import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import ProductPage from './pages/ProductPage';
import EvidencePage from './pages/EvidencePage';
import ContactPage from './pages/ContactPage';
import Imprint from './pages/Imprint';
import Privacy from './pages/Privacy';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const App: React.FC = () => {
  return (
    <HashRouter>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col font-body bg-brand-dark text-slate-300 selection:bg-brand-cyan selection:text-brand-dark">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/kognitives-training" element={<ProductPage />} />
            <Route path="/evidenz" element={<EvidencePage />} />
            <Route path="/kontakt" element={<ContactPage />} />
            <Route path="/impressum" element={<Imprint />} />
            <Route path="/datenschutz" element={<Privacy />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
};

export default App;
