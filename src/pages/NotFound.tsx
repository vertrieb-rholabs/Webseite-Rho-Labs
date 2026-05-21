import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="pt-40 pb-32 px-6 max-w-3xl mx-auto text-center min-h-[60vh] flex flex-col items-center justify-center">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan mb-8">
        <AlertTriangle size={40} />
      </div>
      <p className="text-brand-cyan font-black text-sm uppercase tracking-[0.3em] mb-4">Fehler 404</p>
      <h1 className="font-display font-black text-6xl md:text-8xl text-white mb-6 tracking-tighter">
        Seite nicht <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-purple">gefunden</span>
      </h1>
      <p className="text-xl text-slate-400 mb-12 leading-relaxed max-w-xl">
        {"Die aufgerufene Seite existiert nicht oder wurde verschoben. Prüfen Sie die Adresse oder kehren Sie zur Startseite zurück."}
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-3 px-8 py-4 bg-brand-cyan text-brand-dark font-black rounded-full hover:shadow-[0_0_40px_rgba(0,242,255,0.4)] transition-all transform hover:-translate-y-1"
      >
        <Home size={20} /> Zur Startseite
      </Link>
    </div>
  );
}
