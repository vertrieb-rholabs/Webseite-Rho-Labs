import React, { useEffect, useState, useRef } from 'react';
import { ChevronRight, Zap, Globe, Shield, Database, Award, Sparkles, Monitor, Download } from 'lucide-react';
import { CORE_VALUES, CONTACT_EMAIL } from '../constants';
import { Link } from 'react-router-dom';

const ScrollReveal: React.FC<{ children?: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-[1200ms] ease-out ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const Meteors = ({ number = 15 }: { number?: number }) => {
  const meteors = new Array(number).fill(true);
  return (
    <>
      {meteors.map((_, idx) => (
        <span
          key={'meteor' + idx}
          className="animate-meteor absolute top-1/2 left-1/2 h-0.5 w-0.5 rounded-[9999px] bg-slate-500 shadow-[0_0_0_1px_#ffffff10] rotate-[215deg]"
          style={{
            top: 0,
            left: Math.floor(Math.random() * (400 - -400) + -400) + 'px',
            animationDelay: Math.random() * (0.8 - 0.2) + 0.2 + 's',
            animationDuration: Math.floor(Math.random() * (10 - 2) + 2) + 's',
          }}
        >
          <div className="pointer-events-none absolute top-1/2 -z-10 h-[1px] w-[50px] -translate-y-1/2 bg-gradient-to-r from-slate-500 to-transparent" />
        </span>
      ))}
    </>
  );
};

export const SharedBackground: React.FC<{ scrollY: number }> = ({ scrollY }) => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
    <div 
      className="absolute top-[-5%] left-1/2 w-[1200px] h-[600px] bg-brand-cyan/15 blur-[120px] rounded-full opacity-40 mix-blend-screen animate-pulse-glow will-change-transform" 
      style={{ transform: `translate(-50%, ${scrollY * 0.1}px)` }}
    />
    <div 
      className="absolute bottom-[10%] right-[-10%] w-[900px] h-[600px] bg-brand-purple/10 blur-[100px] rounded-full opacity-20 mix-blend-screen will-change-transform" 
      style={{ transform: `translateY(${scrollY * -0.05}px)` }}
    />
    
    <div 
      className="perspective-grid-container absolute inset-0 will-change-transform"
      style={{ transform: `translateY(${scrollY * 0.12}px)` }}
    >
      <div className="moving-grid w-full h-[200%] -mt-[20%]"></div>
    </div>
    
    <div className="absolute top-0 left-1/2 w-full h-full max-w-7xl -translate-x-1/2 overflow-hidden">
        <Meteors number={12} />
    </div>

    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150 contrast-150 mix-blend-overlay"></div>
  </div>
);

const LandingPage: React.FC = () => {
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

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-6 z-10 flex flex-col items-center justify-center text-center">
        <ScrollReveal>
          <div className="group relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-10 overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-cyan/20 to-transparent translate-x-[-100%] animate-shimmer" />
             <div className="w-2 h-2 rounded-full bg-brand-cyan shadow-[0_0_10px_#00f2ff]"></div>
             <span className="text-xs font-bold text-slate-200 tracking-widest uppercase">Premium Software Solutions</span>
          </div>

          <h1 className="font-display font-black text-6xl md:text-8xl lg:text-9xl text-white tracking-tighter mb-8 leading-[0.85] drop-shadow-2xl">
            {"SOFTWARE F\u00DCR"} <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-white to-brand-purple">
              MENSCH & WISSENSCHAFT.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
            {"Wir entwickeln datensparsame Desktop-Software f\u00FCr kognitives Training und wissenschaftliche Anwendungen."} <br className="hidden md:block"/>
            <span className="text-brand-cyan/80 font-semibold tracking-wide">Lokal. Fundiert. Durchdacht.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link to="/kognitives-training" className="group relative px-10 py-5 bg-brand-cyan text-brand-dark font-black text-lg rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(0,242,255,0.5)]">
               <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
               <span className="relative flex items-center gap-2">Produkte ansehen <Zap size={20} className="fill-brand-dark"/></span>
            </Link>
            <a href={`mailto:${CONTACT_EMAIL}?subject=Kostenlose Demo anfragen&body=Guten Tag,%0D%0A%0D%0Aich interessiere mich für eine kostenlose Demo-Version von Rho-Labs Kognitives Training.%0D%0A%0D%0AMit freundlichen Grüßen`} className="group relative px-10 py-5 bg-brand-purple/20 border border-brand-purple/40 text-white font-bold text-lg rounded-full backdrop-blur-sm hover:bg-brand-purple/30 hover:border-brand-purple/60 transition-all hover:shadow-[0_0_25px_rgba(189,0,255,0.3)]">
              <span className="relative flex items-center gap-2"><Download size={20} /> Kostenlose Demo</span>
            </a>
            <Link to="/kontakt" className="px-10 py-5 bg-white/5 border border-white/10 text-white font-bold text-lg rounded-full backdrop-blur-sm hover:bg-white/10 transition-all">
              Kontakt aufnehmen
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* Values Section */}
      <section className="relative py-32 px-6 z-10 border-y border-white/5 bg-brand-surface/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {CORE_VALUES.map((val, idx) => (
              <ScrollReveal key={idx} delay={idx * 150}>
                <div className="flex flex-col items-center text-center group">
                  <div className="relative w-16 h-16 rounded-2xl bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan mb-8 group-hover:bg-brand-cyan group-hover:text-brand-dark group-hover:scale-110 transition-all duration-500">
                    <div className="absolute inset-0 bg-brand-cyan/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <val.Icon size={32} className="relative z-10" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-white mb-3 tracking-tight">{val.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{val.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Software Info Section */}
      <section className="relative py-32 px-6 z-10">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20 text-xs font-bold uppercase tracking-[0.2em] mb-8">
                <Monitor size={14} /> Über die Software
              </span>
              <h2 className="font-display font-black text-4xl md:text-6xl text-white mb-8 tracking-tighter">Was ist Rho-Labs?</h2>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <div className="relative p-[2px] rounded-[3rem] bg-gradient-to-br from-brand-cyan/20 via-white/5 to-brand-purple/20">
              <div className="bg-brand-surface/90 backdrop-blur-xl rounded-[2.9rem] p-10 md:p-16">
                <p className="text-slate-300 text-lg leading-relaxed mb-8">
                  Rho-Labs entwickelt <span className="text-white font-bold">Desktop-Software für kognitives Training und wissenschaftliche Werkzeuge</span>. 
                  Unser erstes Produkt — <span className="text-brand-cyan font-bold">Kognitives Training</span> — ist eine native Windows-Anwendung 
                  mit sieben spezialisierten Trainingsmodulen für Gedächtnis, Aufmerksamkeit und kognitive Flexibilität.
                </p>
                <p className="text-slate-300 text-lg leading-relaxed mb-8">
                  Die Software wird als <span className="text-white font-bold">Installer (EXE)</span> ausgeliefert und läuft vollständig lokal auf Ihrem Rechner. 
                  Alle Trainings- und Nutzerdaten bleiben auf Ihrem Gerät — nur die Lizenzvalidierung erfordert eine periodische Internetverbindung. 
                  Profile, Verlaufsdaten und PDF-Exporte werden ausschließlich lokal erzeugt und gespeichert.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <p className="text-3xl font-black text-brand-cyan mb-2">7</p>
                    <p className="text-slate-400 text-sm">Trainingsmodule</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <p className="text-3xl font-black text-brand-purple mb-2">Lokal</p>
                    <p className="text-slate-400 text-sm">Datenhaltung</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <p className="text-3xl font-black text-white mb-2">PDF</p>
                    <p className="text-slate-400 text-sm">Export & Auswertung</p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Product Highlight */}
      <section className="relative py-40 px-6 z-10">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="relative group p-[2px] rounded-[3rem] bg-gradient-to-br from-brand-cyan/30 via-white/5 to-brand-purple/30 overflow-hidden">
               <div className="relative bg-brand-surface/90 backdrop-blur-xl rounded-[2.9rem] p-10 md:p-20 overflow-hidden flex flex-col md:flex-row items-center gap-16">
                  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-cyan/10 blur-[100px] rounded-full -mr-40 -mt-40 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                  
                  <div className="flex-1 relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <Sparkles className="text-brand-cyan" size={20} />
                      <span className="text-brand-cyan font-black text-xs uppercase tracking-[0.2em]">Aktuelles Flaggschiff</span>
                    </div>
                    <h2 className="font-display font-black text-4xl md:text-7xl text-white mb-8 leading-tight tracking-tighter">Kognitives <br/><span className="text-brand-purple">Training</span></h2>
                    <p className="text-slate-400 text-lg mb-10 max-w-xl leading-relaxed">
                      {"Sieben spezialisierte Module f\u00FCr Ged\u00E4chtnis, Aufmerksamkeit und kognitive Flexibilit\u00E4t."} <br/>
                      Profilbasiert, auswertbar und vollständig offline nutzbar.
                    </p>
                    <Link to="/kognitives-training" className="inline-flex items-center gap-3 px-8 py-4 bg-brand-cyan text-brand-dark font-black rounded-full hover:shadow-[0_0_40px_rgba(0,242,255,0.4)] transition-all transform hover:-translate-y-1">
                      Details & Module <ChevronRight size={20} />
                    </Link>
                  </div>
                  
                  <div className="flex-1 relative z-10">
                    <div className="w-full aspect-video md:aspect-square rounded-3xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 flex items-center justify-center shadow-2xl overflow-hidden group">
                      <div className="text-brand-cyan opacity-10 group-hover:opacity-25 transition-opacity duration-700">
                        <Zap size={240} strokeWidth={0.5}/>
                      </div>
                      <div className="absolute inset-0 bg-brand-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="absolute -top-6 -right-6 px-8 py-4 bg-brand-purple text-white font-black rounded-2xl shadow-[0_20px_40px_rgba(189,0,255,0.3)] rotate-6 group-hover:rotate-0 transition-transform duration-500">
                      7 Module
                    </div>
                  </div>
               </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
