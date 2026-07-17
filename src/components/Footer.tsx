import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { CONTACT_EMAIL, SALES_EMAIL, PIPELINE, LAB_PROJECTS, STATUS_LABELS } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-surface border-t border-white/5 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
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
              {PIPELINE.map((item) => (
                <li key={item.id}>
                  {item.href ? (
                    <Link to={item.href} className="hover:text-brand-cyan transition-colors">{item.name}</Link>
                  ) : (
                    <span className="opacity-50">
                      {item.name} <span className="italic">({STATUS_LABELS[item.status]})</span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-white text-sm uppercase tracking-widest mb-6">Labor</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              {LAB_PROJECTS.map((project) => (
                <li key={project.id}>
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 hover:text-brand-purple transition-colors"
                  >
                    {project.name} <ExternalLink size={12} />
                  </a>
                </li>
              ))}
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
            <h4 className="font-display font-bold text-white text-sm uppercase tracking-widest mb-6">Kontakt</h4>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <a href={`mailto:${SALES_EMAIL}`} className="text-sm font-bold text-brand-cyan hover:underline">{SALES_EMAIL}</a>
              <p className="text-xs text-slate-400 mt-2">Antwort in der Regel innerhalb von 24 Stunden.</p>
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
