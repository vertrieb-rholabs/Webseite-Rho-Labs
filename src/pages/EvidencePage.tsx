import React from 'react';
import { EVIDENZ_SOURCES } from '../constants';
import { BookOpen, ExternalLink, GraduationCap } from 'lucide-react';

const EvidencePage: React.FC = () => {
  return (
    <div className="pt-40 pb-32 px-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <GraduationCap className="text-brand-cyan" size={40} />
        <h1 className="font-display font-black text-4xl md:text-6xl text-white">Wissenschaftlicher Hintergrund</h1>
      </div>
      
      <div className="p-8 rounded-3xl bg-white/5 border border-white/10 mb-16">
        <p className="text-slate-300 leading-relaxed mb-6">
          {"Die in Rho-Labs eingesetzten Trainingsparadigmen basieren auf etablierten Verfahren der kognitiven Psychologie und Neuropsychologie. Nachfolgend finden Sie Referenzen zu den zugrundeliegenden Methoden."}
        </p>
        <div className="flex items-start gap-3 p-4 bg-brand-cyan/10 rounded-xl text-xs text-brand-cyan">
           <BookOpen size={18} className="shrink-0" />
           <p>{"Diese Referenzen belegen die wissenschaftliche Grundlage der verwendeten Trainingsmethoden. Sie stellen keine Wirksamkeitsnachweise f\u00FCr diese spezifische Software dar."}</p>
        </div>
      </div>

      <div className="space-y-12">
        {EVIDENZ_SOURCES.map((src, idx) => (
          <div key={idx} className="p-8 rounded-3xl bg-brand-surface border border-white/5">
            <h3 className="font-display font-bold text-2xl text-white mb-6 border-b border-white/5 pb-4">{src.module}</h3>
            <ul className="space-y-6">
              {src.references.map((ref, i) => (
                <li key={i} className="text-slate-400 text-sm leading-relaxed italic relative pl-6">
                  <span className="absolute left-0 top-1 text-brand-cyan font-bold">{"\u00BB"}</span>
                  {ref}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-20 text-center">
        <p className="text-slate-500 text-sm mb-6">{"F\u00FCr detaillierte Informationen zu weiteren Modulen kontaktieren Sie uns bitte direkt."}</p>
        <a href="#/kontakt" className="inline-flex items-center gap-2 text-brand-cyan hover:underline font-bold">
          Kontakt aufnehmen <ExternalLink size={16}/>
        </a>
      </div>
    </div>
  );
};

export default EvidencePage;
