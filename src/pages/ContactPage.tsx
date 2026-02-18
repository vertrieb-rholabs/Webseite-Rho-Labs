import React from 'react';
import { Mail, MessageSquare, ShoppingCart, Globe, Download, Sparkles } from 'lucide-react';
import { CONTACT_EMAIL, PARTNER_INFO } from '../constants';

const ContactPage: React.FC = () => {
  return (
    <div className="pt-40 pb-32 px-6 max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="font-display font-black text-5xl md:text-7xl text-white mb-6">Kontakt</h1>
        <p className="text-xl text-slate-400">{"Fragen zur Software oder Lizenzierung? Wir sind f\u00FCr Sie da."}</p>
      </div>

      {/* Demo Request - Highlighted */}
      <div className="relative mb-12 p-[2px] rounded-[2.5rem] bg-gradient-to-r from-brand-cyan via-brand-purple to-brand-cyan overflow-hidden">
        <div className="relative bg-brand-surface rounded-[2.4rem] p-10 md:p-12 overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-cyan/5 blur-[100px] rounded-full -mr-40 -mt-40" />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="shrink-0 w-20 h-20 rounded-2xl bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan">
              <Download size={40} />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start mb-3">
                <Sparkles size={16} className="text-brand-cyan" />
                <span className="text-brand-cyan font-black text-xs uppercase tracking-[0.2em]">Kostenlos testen</span>
              </div>
              <h2 className="font-display font-bold text-3xl text-white mb-4">Kostenlose Demo anfragen</h2>
              <p className="text-slate-400 mb-6">{"Testen Sie Rho-Labs Kognitives Training unverbindlich. Schreiben Sie uns eine E-Mail und wir senden Ihnen eine Demo-Version zu."}</p>
              <a 
                href={`mailto:${CONTACT_EMAIL}?subject=Kostenlose Demo anfragen&body=Guten Tag,%0D%0A%0D%0Aich interessiere mich für eine kostenlose Demo-Version von Rho-Labs Kognitives Training.%0D%0A%0D%0ABitte senden Sie mir die Demo-Version zu.%0D%0A%0D%0AMit freundlichen Grüßen`}
                className="inline-flex items-center gap-3 px-8 py-4 bg-brand-cyan text-brand-dark font-black rounded-full hover:shadow-[0_0_40px_rgba(0,242,255,0.4)] transition-all transform hover:-translate-y-1"
              >
                <Mail size={20} /> Demo per E-Mail anfragen
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-10 rounded-[2.5rem] bg-brand-surface border border-white/5 hover:border-brand-purple/30 transition-all group">
          <div className="w-14 h-14 rounded-2xl bg-brand-purple/10 flex items-center justify-center text-brand-purple mb-8 group-hover:scale-110 transition-transform">
            <MessageSquare size={28} />
          </div>
          <h2 className="font-display font-bold text-3xl text-white mb-4">Allgemeine Anfragen</h2>
          <p className="text-slate-400 mb-8">{"Kontaktieren Sie uns direkt f\u00FCr technische Fragen, Feedback oder individuelle Software-Anpassungen."}</p>
          <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex items-center gap-2 text-brand-purple font-black text-lg hover:underline">
            {CONTACT_EMAIL} <Mail size={20}/>
          </a>
        </div>

        <div className="p-10 rounded-[2.5rem] bg-brand-surface border border-white/5 hover:border-brand-cyan/30 transition-all group">
          <div className="w-14 h-14 rounded-2xl bg-brand-cyan/10 flex items-center justify-center text-brand-cyan mb-8 group-hover:scale-110 transition-transform">
            <ShoppingCart size={28} />
          </div>
          <h2 className="font-display font-bold text-3xl text-white mb-4">Vertrieb & Lizenzen</h2>
          <p className="text-slate-400 mb-8">{"Die Lizenzierung erfolgt \u00FCber unseren Partner "}<strong>{PARTNER_INFO.name}</strong>.</p>
          <div className="space-y-2">
            <p className="text-sm text-slate-500 uppercase font-black tracking-widest">Vertriebspartner</p>
            <p className="text-white font-bold">{PARTNER_INFO.name}</p>
            <p className="text-xs text-brand-cyan">{PARTNER_INFO.email}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-20 p-10 rounded-[2.5rem] bg-white/5 border border-white/10 text-center">
        <h3 className="font-display font-bold text-2xl text-white mb-4 flex items-center justify-center gap-2"><Globe size={24} className="text-brand-cyan"/> Support-Hinweis</h3>
        <p className="text-slate-400 text-sm max-w-2xl mx-auto mb-6">
          {"Wir bearbeiten Anfragen in der Regel innerhalb von 24\u201348 Stunden. F\u00FCr technische Notf\u00E4lle bei Bestandskunden nutzen Sie bitte die priorisierte E-Mail aus Ihrem Kundenkonto."}
        </p>
        <p className="text-brand-cyan font-bold">{CONTACT_EMAIL}</p>
      </div>
    </div>
  );
};

export default ContactPage;
