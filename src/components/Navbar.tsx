import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { CONTACT_EMAIL } from '../constants';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navClass = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
    isScrolled 
      ? 'py-3 bg-brand-dark/95 backdrop-blur-md border-white/10 shadow-lg shadow-black/20' 
      : 'py-5 bg-transparent border-transparent'
  }`;

  const isActive = (path: string) => location.pathname === path;

  const NavLink = ({ to, children }: { to: string; children?: React.ReactNode }) => (
    <Link 
      to={to} 
      onClick={() => setIsMobileOpen(false)}
      className={`text-sm font-medium transition-colors hover:text-brand-cyan ${
        isActive(to) ? 'text-brand-cyan' : 'text-slate-300'
      }`}
    >
      {children}
    </Link>
  );

  return (
    <nav className={navClass}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <img 
            src="./logo.png" 
            alt="Rho-Labs Logo" 
            className="w-9 h-9 object-contain drop-shadow-[0_0_8px_rgba(0,242,255,0.3)] group-hover:drop-shadow-[0_0_14px_rgba(0,242,255,0.5)] transition-all"
          />
          <span className="font-display font-bold text-xl text-white tracking-tight group-hover:opacity-90 transition-opacity">
            Rho<span className="text-brand-cyan">-Labs</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <NavLink to="/">Start</NavLink>
          <NavLink to="/kognitives-training">Kognitives Training</NavLink>
          <NavLink to="/evidenz">Evidenz</NavLink>
          <NavLink to="/kontakt">Kontakt</NavLink>
          <a 
            href="/#/kognitives-training#pricing"
            className="px-5 py-2.5 bg-brand-cyan hover:bg-brand-cyanDim text-brand-dark font-bold text-sm rounded-full transition-all transform hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
          >
            Lizenzen
          </a>
        </div>

        <button className="md:hidden text-slate-300" onClick={() => setIsMobileOpen(!isMobileOpen)}>
          {isMobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {isMobileOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-brand-surface border-b border-white/10 p-6 flex flex-col gap-4 shadow-2xl">
          <NavLink to="/">Start</NavLink>
          <NavLink to="/kognitives-training">Kognitives Training</NavLink>
          <NavLink to="/evidenz">Evidenz</NavLink>
          <NavLink to="/kontakt">Kontakt</NavLink>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
