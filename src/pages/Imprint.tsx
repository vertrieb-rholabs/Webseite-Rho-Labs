import React from 'react';
import { CONTACT_EMAIL } from '../constants';
import { Building2, User, Mail, FileText, Scale, Gavel } from 'lucide-react';

const Imprint: React.FC = () => {
  return (
    <div className="pt-32 pb-24 px-6 max-w-4xl mx-auto">
      <h1 className="font-display font-black text-4xl md:text-5xl text-white mb-4">Impressum</h1>
      <p className="text-slate-400 text-lg mb-12">{"Angaben gem\u00E4\u00DF \u00A7 5 DDG (Digitale-Dienste-Gesetz)"}</p>

      <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex gap-4 items-start mb-12">
        <span className="text-amber-500 text-2xl">{"\u2139\uFE0F"}</span>
        <p className="text-slate-300 text-sm leading-relaxed">
          <strong>Hinweis:</strong> Die von Rho-Labs angebotene Software dient ausschließlich dem
          <strong> unterst\u00FCtzenden kognitiven Training</strong>. Sie stellt kein Medizinprodukt dar, 
          ersetzt keine ärztliche oder therapeutische Diagnostik und erhebt keinen Anspruch auf 
          medizinische Wirksamkeit.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 rounded-2xl bg-brand-surface border border-white/5">
          <div className="flex items-center gap-3 mb-6 text-brand-cyan">
            <Building2 size={24} />
            <h2 className="font-display font-bold text-xl text-white m-0">Unternehmensangaben</h2>
          </div>
          <address className="not-italic text-slate-300 leading-relaxed">
            <strong>{"Rho-Labs \u2013 Einzelunternehmen"}</strong><br />
            Patrick Feix<br />
            {"Feldstra\u00DFe 15"}<br />
            99848 Wutha-Farnroda<br />
            Deutschland
          </address>
        </div>

        <div className="p-8 rounded-2xl bg-brand-surface border border-white/5">
          <div className="flex items-center gap-3 mb-6 text-brand-cyan">
            <User size={24} />
            <h2 className="font-display font-bold text-xl text-white m-0">Inhaber</h2>
          </div>
          <p className="text-slate-300">Patrick Feix</p>
        </div>

        <div className="p-8 rounded-2xl bg-brand-surface border border-white/5">
          <div className="flex items-center gap-3 mb-6 text-brand-cyan">
            <Mail size={24} />
            <h2 className="font-display font-bold text-xl text-white m-0">Kontakt</h2>
          </div>
          <p className="text-slate-300">
            <strong>E-Mail:</strong> <a href={`mailto:${CONTACT_EMAIL}`} className="text-brand-cyan hover:underline">{CONTACT_EMAIL}</a>
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-brand-surface border border-white/5">
          <div className="flex items-center gap-3 mb-6 text-brand-cyan">
            <FileText size={24} />
            <h2 className="font-display font-bold text-xl text-white m-0">Inhaltlich Verantwortlich</h2>
          </div>
          <p className="text-slate-400 text-sm mb-2">{`nach \u00A7 18 Abs. 2 MStV`}</p>
          <p className="text-slate-300">
            Patrick Feix<br />
            {"Feldstra\u00DFe 15"}<br />
            99848 Wutha-Farnroda
          </p>
        </div>
        
        <div className="p-8 rounded-2xl bg-brand-surface border border-white/5 md:col-span-2">
          <div className="flex items-center gap-3 mb-6 text-brand-cyan">
            <Scale size={24} />
            <h2 className="font-display font-bold text-xl text-white m-0">EU-Streitschlichtung</h2>
          </div>
          <p className="text-slate-300 mb-4">
            {"Die Europ\u00E4ische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: "}
            <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-brand-cyan hover:underline ml-1">
              https://ec.europa.eu/consumers/odr/
            </a>
          </p>
          <p className="text-slate-400 text-sm">Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>
        </div>

        <div className="p-8 rounded-2xl bg-brand-surface border border-white/5 md:col-span-2">
          <div className="flex items-center gap-3 mb-6 text-brand-cyan">
            <Gavel size={24} />
            <h2 className="font-display font-bold text-xl text-white m-0">Verbraucherstreitbeilegung</h2>
          </div>
          <p className="text-slate-300">
            Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-white/5 text-slate-500 text-sm">
        <strong>Stand dieses Impressums:</strong> Februar 2025
      </div>
    </div>
  );
};

export default Imprint;
