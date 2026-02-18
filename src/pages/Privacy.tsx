import React from 'react';
import { CONTACT_EMAIL } from '../constants';
import { Shield, Lock, EyeOff, Server, Info } from 'lucide-react';

const Privacy: React.FC = () => {
  return (
    <div className="pt-32 pb-24 px-6 max-w-4xl mx-auto">
      <h1 className="font-display font-black text-4xl md:text-5xl text-white mb-4">{"Datenschutzerkl\u00E4rung"}</h1>
      <p className="text-slate-400 text-lg mb-12">{"Transparenz \u00FCber den Umgang mit Ihren Daten"}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="p-6 rounded-2xl bg-brand-cyan/10 border border-brand-cyan/20 flex flex-col gap-4">
          <Shield className="text-brand-cyan" size={32} />
          <h3 className="font-bold text-white text-lg">Kein Tracking</h3>
          <p className="text-slate-300 text-sm">Diese Website verwendet keine Cookies und kein Tracking durch Drittanbieter.</p>
        </div>
        <div className="p-6 rounded-2xl bg-brand-purple/10 border border-brand-purple/20 flex flex-col gap-4">
           <Lock className="text-brand-purple" size={32} />
           <h3 className="font-bold text-white text-lg">Lokale Daten</h3>
           <p className="text-slate-300 text-sm">{"Nutzerdaten werden ausschlie\u00DFlich lokal gespeichert und niemals \u00FCbertragen."}</p>
        </div>
      </div>

      <div className="space-y-16">
        <section>
          <div className="flex items-center gap-4 mb-6">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 border border-white/10 font-bold text-brand-cyan">1</span>
            <h2 className="font-display font-bold text-2xl text-white m-0">Verantwortlicher</h2>
          </div>
          <div className="pl-12 text-slate-300">
             <p className="mb-4">
              <strong>{"Rho-Labs \u2013 Einzelunternehmen"}</strong><br />
              Patrick Feix<br />
              {"Feldstra\u00DFe 15, 99848 Wutha-Farnroda"}
            </p>
            <p>E-Mail: <a href={`mailto:${CONTACT_EMAIL}`} className="text-brand-cyan hover:underline">{CONTACT_EMAIL}</a></p>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-4 mb-6">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 border border-white/10 font-bold text-brand-cyan">2</span>
            <h2 className="font-display font-bold text-2xl text-white m-0">Software-Nutzung & Lizenzierung</h2>
          </div>
          <div className="pl-12 text-slate-300 space-y-4">
             <div className="p-6 rounded-xl bg-gradient-to-br from-brand-surface to-brand-dark border border-brand-cyan/20">
                <h3 className="font-bold text-white text-lg mb-4">Lokale Datenhaltung (Privacy by Design)</h3>
                <p className="mb-4">{"Unsere Software speichert alle nutzerbezogenen Daten (Trainingsergebnisse, Profile) ausschlie\u00DFlich lokal auf Ihrem Endger\u00E4t."}</p>
                <div className="flex items-start gap-3 p-4 bg-brand-cyan/10 rounded-xl text-xs text-brand-cyan mb-4">
                  <Info size={18} className="shrink-0" />
                  <p><strong>{"Hinweis zur Lizenzpr\u00FCfung:"}</strong>{" Zur Validierung der Software-Lizenz baut die Anwendung in periodischen Abst\u00E4nden eine verschl\u00FCsselte Verbindung zu unserem Lizenz-Server auf. Hierbei werden ausschlie\u00DFlich technische Lizenzdaten (Lizenzschl\u00FCssel, Hardware-ID), jedoch niemals nutzerbezogene Daten \u00FCbertragen."}</p>
                </div>
             </div>
          </div>
        </section>

        <section>
           <div className="flex items-center gap-4 mb-6">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 border border-white/10 font-bold text-brand-cyan">3</span>
            <h2 className="font-display font-bold text-2xl text-white m-0">Ihre Rechte</h2>
          </div>
          <div className="pl-12 text-slate-300">
            <p className="mb-4">{"Sie haben das Recht auf Auskunft, Berichtigung, L\u00F6schung und Widerspruch gem\u00E4\u00DF DSGVO."}</p>
            <p className="text-sm text-slate-500">Stand: Februar 2025</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
