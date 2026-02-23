import React, { useRef, useEffect, useState } from 'react';
import { Check, Zap, Info, BarChart3, Database, ChevronRight, Sparkles, Download, Monitor } from 'lucide-react';
import { MODULES, PRICING_SECTIONS, MDR_DISCLAIMER, PARTNER_INFO, CONTACT_EMAIL } from '../constants';
import { SharedBackground } from './LandingPage';

const ScrollReveal: React.FC<{ children?: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setIsVisible(true); observer.unobserve(entry.target); }
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className={`transition-all duration-[1000ms] ease-out ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

const ProductPage: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(() => setScrollY(window.scrollY));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="w-full relative overflow-hidden bg-brand-dark min-h-screen">
      <SharedBackground scrollY={scrollY} />

      <div className="relative z-10">
        {/* Hero */}
        <section className="pt-48 pb-20 px-6 text-center max-w-5xl mx-auto">
          <ScrollReveal>
            <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20 text-xs font-bold uppercase tracking-[0.2em] mb-8">
               <Sparkles size={14} /> {"Desktop-Anwendung"}
            </span>
            <h1 className="font-display font-black text-6xl md:text-8xl text-white mb-10 leading-[0.9] tracking-tighter">
              KOGNITIVES <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-purple">TRAINING</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-6 leading-relaxed">
              {"Native Windows-Software mit wissenschaftlich fundierten \u00DCbungen f\u00FCr Ged\u00E4chtnis, Aufmerksamkeit und kognitive Flexibilit\u00E4t."} <br className="hidden md:block"/>
              {"Profilbasiert, auswertbar und vollst\u00E4ndig offline nutzbar."}
            </p>
            <p className="text-sm text-slate-500 max-w-2xl mx-auto mb-12">
              {"Die Software wird als Installer (EXE) ausgeliefert und l\u00E4uft lokal auf Ihrem Rechner. Alle Trainingsdaten bleiben auf Ihrem Ger\u00E4t \u2014 kein Cloud-Upload, keine Drittanbieter."}
            </p>
            <a href={`mailto:${CONTACT_EMAIL}?subject=Kostenlose Demo anfragen&body=Guten Tag,%0D%0A%0D%0Aich interessiere mich f\u00FCr eine kostenlose Demo-Version von Rho-Labs Kognitives Training.%0D%0A%0D%0ABitte senden Sie mir die Demo-Version zu.%0D%0A%0D%0AMit freundlichen Gr\u00FC\u00DFen`} className="inline-flex items-center gap-3 px-10 py-5 bg-brand-purple/20 border border-brand-purple/40 text-white font-black text-lg rounded-full backdrop-blur-sm hover:bg-brand-purple/30 hover:border-brand-purple/60 transition-all hover:shadow-[0_0_25px_rgba(189,0,255,0.3)]">
              <Download size={22} /> Kostenlose Demo anfragen
            </a>
          </ScrollReveal>
        </section>

        {/* Modules Grid */}
        <section id="modules" className="py-32 px-6 bg-brand-surface/40 backdrop-blur-md border-y border-white/5">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-display font-black text-4xl md:text-6xl text-white mb-20 text-center tracking-tight">Sieben spezialisierte Module</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {MODULES.map((module, idx) => (
                <ScrollReveal key={module.id} delay={idx * 100}>
                  <div className="h-full p-8 rounded-[2.5rem] bg-brand-surface border border-white/5 hover:border-brand-cyan/30 transition-all duration-500 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-cyan/5 blur-3xl rounded-full translate-x-10 -translate-y-10 group-hover:bg-brand-cyan/10 transition-colors" />

                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-brand-cyan mb-8 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(0,242,255,0.2)] transition-all">
                      <module.Icon size={28} />
                    </div>
                    <h3 className="font-display font-bold text-2xl text-white mb-2 tracking-tight">{module.title}</h3>
                    <p className="text-brand-cyan/60 text-[10px] font-black uppercase tracking-[0.2em] mb-6">{module.subtitle}</p>
                    <p className="text-slate-400 text-sm leading-relaxed">{module.description}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* USPs & Details */}
        <section className="py-40 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <ScrollReveal>
              <h2 className="font-display font-black text-5xl text-white mb-10 tracking-tighter leading-tight">Warum <br/><span className="text-brand-cyan">Rho-Labs?</span></h2>
              <div className="space-y-10">
                <div className="flex gap-8 group">
                  <div className="shrink-0 w-14 h-14 rounded-2xl bg-brand-cyan/10 flex items-center justify-center text-brand-cyan group-hover:bg-brand-cyan group-hover:text-brand-dark transition-all duration-500"><Database size={28}/></div>
                  <div>
                    <h4 className="font-display font-bold text-xl text-white mb-3">Lokale Datenhoheit</h4>
                    <p className="text-sm text-slate-400 leading-relaxed">{"Keine Cloud-\u00DCbertragung. Alle Nutzerdaten bleiben auf Ihrem Rechner. Nach der einmaligen Lizenzaktivierung l\u00E4uft die Software komplett offline."}</p>
                  </div>
                </div>
                <div className="flex gap-8 group">
                  <div className="shrink-0 w-14 h-14 rounded-2xl bg-brand-purple/10 flex items-center justify-center text-brand-purple group-hover:bg-brand-purple group-hover:text-white transition-all duration-500"><BarChart3 size={28}/></div>
                  <div>
                    <h4 className="font-display font-bold text-xl text-white mb-3">Detaillierte Auswertungen</h4>
                    <p className="text-sm text-slate-400 leading-relaxed">{"Automatische Erstellung von Verlaufsdiagrammen und PDF-Export f\u00FCr die pers\u00F6nliche Trainings\u00FCbersicht und Fortschrittskontrolle."}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="relative group p-1 rounded-[3rem] bg-gradient-to-br from-brand-cyan/20 to-brand-purple/20">
                <div className="relative bg-brand-surface rounded-[2.9rem] p-12 border border-white/5">
                  <h3 className="font-display font-black text-2xl text-white mb-8 flex items-center gap-3">
                    <div className="w-1.5 h-8 bg-brand-cyan rounded-full" />
                    Einsatzbereiche
                  </h3>
                  <ul className="space-y-6">
                    {["Bildungs- & Trainingseinrichtungen", "Betriebliches Gesundheitsmanagement", "Forschung & Lehre", "Privater Gebrauch & Pr\u00E4vention"].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-4 text-slate-300 font-medium">
                        <div className="w-6 h-6 rounded-full bg-brand-cyan/10 flex items-center justify-center">
                          <Check size={14} className="text-brand-cyan" />
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Pricing Table */}
        <section id="pricing" className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
              <h2 className="font-display font-black text-5xl md:text-7xl text-white mb-6 tracking-tighter">Software-Lizenzen</h2>
              <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
                {"Einmal kaufen \u2014 immer nutzen. Der Bezug erfolgt \u00FCber unseren Partner "}<span className="text-brand-cyan font-bold">{PARTNER_INFO.name}</span>.
                {" Gr\u00F6\u00DFere Updates werden als optionale Einmalk\u00E4ufe angeboten. Notwendige Patches und Bugfixes sind kostenlos."}
              </p>
            </div>

            {PRICING_SECTIONS.map((section) => (
              <div key={section.id} className="mb-24 last:mb-0">
                <ScrollReveal>
                  <div className="text-center mb-12">
                    <h3 className="font-display font-bold text-3xl text-white mb-3 tracking-tight">{section.title}</h3>
                    <p className="text-slate-400 text-sm">{section.subtitle}</p>
                  </div>
                </ScrollReveal>

                <div className={`grid grid-cols-1 gap-8 items-stretch ${
                  section.id === 'b2c'
                    ? 'lg:grid-cols-2 max-w-3xl mx-auto'
                    : 'lg:grid-cols-3'
                }`}>
                  {section.plans.map((plan, idx) => (
                    <ScrollReveal key={plan.id} delay={idx * 150}>
                      <div className="relative flex flex-col h-full">
                        {plan.badge && (
                          <div className="flex justify-center -mb-3 relative z-20">
                            <span className="bg-brand-cyan text-brand-dark font-bold text-xs uppercase tracking-widest px-4 py-1 rounded-full">
                              {plan.badge}
                            </span>
                          </div>
                        )}
                        <div className={`group relative flex flex-col p-1 rounded-[2.5rem] h-full transition-all duration-500 ${plan.isFeatured ? 'bg-gradient-to-b from-brand-cyan to-brand-purple scale-105 z-10 shadow-[0_30px_60px_-15px_rgba(0,242,255,0.2)]' : 'bg-white/5 hover:bg-white/10'}`}>
                          <div className={`flex-1 flex flex-col p-10 rounded-[2.4rem] h-full ${plan.isFeatured ? 'bg-[#0B1121]' : 'bg-brand-surface'}`}>
                            <h3 className="font-display font-bold text-2xl text-white mb-2">{plan.name}</h3>
                            <div className="flex items-baseline gap-2 mb-2">
                              <span className="text-6xl font-black text-white tracking-tighter">{plan.price}</span>
                              {!plan.isEnterprise && <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">einmalig</span>}
                            </div>
                            <p className={`text-xs mb-10 ${plan.subtextClass || 'text-slate-500'}`}>{plan.subtext}</p>

                            <ul className="space-y-5 mb-12 flex-grow">
                              {plan.features.map((f, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm">
                                  <Check size={18} className="text-brand-cyan mt-0.5 shrink-0" />
                                  <span className={f.highlight ? 'text-white font-bold' : 'text-slate-400'}>{f.text}</span>
                                </li>
                              ))}
                            </ul>

                            {plan.isExternalCheckout ? (
                              <a href={plan.ctaLink} target="_blank" rel="noopener noreferrer" className={`w-full py-5 rounded-2xl font-black text-center text-sm uppercase tracking-widest transition-all block ${plan.isFeatured ? 'bg-brand-cyan text-brand-dark hover:shadow-[0_0_40px_rgba(0,242,255,0.5)]' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                                {plan.ctaText}
                              </a>
                            ) : (
                              <a href={plan.ctaLink} className={`w-full py-5 rounded-2xl font-black text-center text-sm uppercase tracking-widest transition-all block ${plan.isFeatured ? 'bg-brand-cyan text-brand-dark hover:shadow-[0_0_40px_rgba(0,242,255,0.5)]' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                                {plan.ctaText}
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>

                <p className="text-center text-[10px] text-slate-600 mt-16 font-bold uppercase tracking-[0.3em]">
                  {section.id === 'b2c'
                    ? "Alle Preise inkl. gesetzlicher MwSt. \u2022 Einmaliger Kauf \u2022 Kostenlose Patches inklusive"
                    : "Alle Preise zzgl. gesetzlicher MwSt. \u2022 Einmaliger Kauf \u2022 Kostenlose Patches inklusive"
                  }
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Custom Feature Development */}
        <section className="py-16 px-6 max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="relative p-[2px] rounded-[2.5rem] bg-gradient-to-r from-brand-cyan/30 via-brand-purple/20 to-brand-cyan/30 overflow-hidden">
              <div className="relative bg-brand-surface/95 backdrop-blur-xl rounded-[2.4rem] p-10 md:p-14 overflow-hidden">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-purple/5 blur-[100px] rounded-full -mr-40 -mt-40" />
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                  <div className="shrink-0 w-20 h-20 rounded-2xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple">
                    <Sparkles size={40} />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="font-display font-bold text-3xl text-white mb-4">Individuelle Anforderungen?</h3>
                    <p className="text-slate-400 mb-8 leading-relaxed">
                      {"Sie ben\u00F6tigen spezielle Funktionen oder Anpassungen? Wir entwickeln gegen Aufpreis individuelle Features nach Ihren Anforderungen \u2014 von ma\u00DFgeschneiderten Trainingsmodulen bis hin zu spezifischen Auswertungsfunktionen."}
                    </p>
                    <a
                      href={`mailto:${CONTACT_EMAIL}?subject=Anfrage%20Custom%20Feature-Entwicklung`}
                      className="inline-flex items-center gap-3 px-8 py-4 bg-brand-purple/20 border border-brand-purple/40 text-white font-black rounded-full backdrop-blur-sm hover:bg-brand-purple/30 hover:border-brand-purple/60 transition-all hover:shadow-[0_0_25px_rgba(189,0,255,0.3)]"
                    >
                      Anforderungen besprechen <ChevronRight size={20} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* Disclaimer Box */}
        <section className="py-24 px-6 max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="group relative p-1 rounded-[2.5rem] bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden">
               <div className="absolute inset-0 bg-brand-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
               <div className="relative p-10 flex flex-col md:flex-row gap-10 items-center">
                <div className="shrink-0 w-16 h-16 rounded-full bg-brand-cyan/10 flex items-center justify-center text-brand-cyan animate-pulse">
                  <Info size={32} />
                </div>
                <p className="text-slate-300 text-sm leading-relaxed text-center md:text-left">
                  {MDR_DISCLAIMER}
                </p>
              </div>
            </div>
          </ScrollReveal>
        </section>
      </div>
    </div>
  );
};

export default ProductPage;
