import React from 'react';
import { Link } from 'react-router-dom';
import { CONTACT_EMAIL, PARTNER_INFO } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-surface border-t border-white/5 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
             <Link to="/" className="flex items-center gap-2 mb-6">
              <span className="font-display font-bold text-2xl text-white tracking-tight">
                Rho<span className="text-brand-cyan">-Labs</span>
              </span>
            </Link>
            <p className="text-slate-400 leading-relaxed text-sm">
              {"Spezialisierte Desktop-Software f\u00FCr kognitives Training und wissenschaftliche Anwendungen. Lokal. Fundiert. Durchdacht."}
            </p>
          </div>
          
          <div>
            <h4 className="font-display font-bold text-white text-sm uppercase tracking-widest mb-6">Produkte</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link to="/kognitives-training" className="hover:text-brand-cyan transition-colors">Kognitives Training</Link></li>
              <li><span className="opacity-50 italic">Optical Studio (In Planung)</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-white text-sm uppercase tracking-widest mb-6">Information</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link to="/evidenz" className="hover:text-brand-cyan transition-colors">Wiss. Hintergrund</Link></li>
              <li><Link to="/kontakt" className="hover:text-brand-cyan transition-colors">Kontakt</Link></li>
              <li><Link to="/impressum" className="hover:text-brand-cyan transition-colors">Impressum</Link></li>
              <li><Link to="/datenschutz" className="hover:text-brand-cyan transition-colors">Datenschutz</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-white text-sm uppercase tracking-widest mb-6">Vertrieb</h4>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-xs text-slate-400 mb-2">Unser Vertriebspartner:</p>
              <p className="text-sm font-bold text-white">{PARTNER_INFO.name}</p>
              <p className="text-xs text-brand-cyan">{PARTNER_INFO.role}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <span>{`\u00A9 ${new Date().getFullYear()} Rho-Labs \u2013 Patrick Feix. Made in Germany.`}</span>
          <div className="flex items-center gap-4">
            <span className="px-2 py-0.5 bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20 rounded uppercase tracking-tighter font-black">
              Kein Medizinprodukt
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
