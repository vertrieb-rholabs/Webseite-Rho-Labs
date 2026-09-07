import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import Seo from '../components/Seo';
import Trailer from '../components/Trailer';
import Closer from '../components/Closer';
import {
  APP_VERSION,
  CATEGORIES,
  CATEGORY_ORDER,
  GAME_COUNT,
  LAB_PROJECTS,
  PIPELINE,
  PRINCIPLES,
  STATUS_CLASS,
  STATUS_LABELS,
  countByCategory,
} from '../constants';

export default function LandingPage() {
  return (
    <>
      <Seo
        path="/"
        title="Rho-Labs — Software für Mensch & Wissenschaft"
        description={`Desktop-Werkzeuge für Fachteams, Einrichtungen und Forschung. Kognitives Training: ${GAME_COUNT} Übungen, unbegrenzt viele Profile, alle Trainingsdaten bleiben lokal.`}
      />

      {/* ── Held ─────────────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero__bg" aria-hidden="true">
          <div className="mesh" />
          <div className="hero__glow" />
        </div>
        <div className="hero__inner">
          <span className="pill" style={{ marginBottom: 32 }}>
            <span className="pill__dot" aria-hidden="true" />
            Einzelunternehmen aus Thüringen
          </span>
          <h1 className="hero__title">
            Software für
            <br />
            <span className="grad">Mensch &amp; Wissenschaft.</span>
          </h1>
          <p className="hero__lede">
            Rho-Labs baut Desktop-Werkzeuge für Fachteams, Einrichtungen und
            Forschung. Fertig ist das erste davon:{' '}
            <span className="mark">Kognitives Training</span> — {GAME_COUNT}{' '}
            Übungen, unbegrenzt viele Profile, alle Trainingsdaten lokal.
          </p>
          <div className="btn-row btn-row--center">
            <Link to="/kontakt" className="btn btn--primary">
              Demo anfordern <ArrowRight size={17} strokeWidth={2.2} />
            </Link>
            <Link to="/kognitives-training" className="btn btn--ghost">
              Kognitives Training ansehen
            </Link>
          </div>
          <p className="hero__meta">
            Version {APP_VERSION} · Windows 10 oder neuer · Demo 14 Tage, voller
            Funktionsumfang
          </p>
        </div>
      </section>

      {/* ── Trailer ──────────────────────────────────────────────────── */}
      <section className="wrap wrap--narrow section">
        <div className="trailer__head">
          <div>
            <p className="eyebrow">Trailer</p>
            <h2>Die Anwendung im Betrieb</h2>
          </div>
        </div>
        <Trailer />
      </section>

      {/* ── Grundsätze ───────────────────────────────────────────────── */}
      <section className="band band--closed">
        <div className="wrap grid grid--auto-230" style={{ paddingTop: 'clamp(44px, 5vw, 72px)', paddingBottom: 'clamp(44px, 5vw, 72px)' }}>
          {PRINCIPLES.map(({ title, text, Icon }) => (
            <div className="principle" key={title}>
              <span className="icon-box" aria-hidden="true">
                <Icon size={19} />
              </span>
              <h3>{title}</h3>
              <p className="card__text">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Fertiges Produkt ─────────────────────────────────────────── */}
      <section className="wrap section">
        <div className="showcase">
          <div className="showcase__inner">
            <div>
              <p className="eyebrow">Fertiges Produkt</p>
              <h2 className="showcase__title">Kognitives Training</h2>
              <p className="showcase__lede">
                {GAME_COUNT} Übungen in vier Aufgabenbereichen, drei
                Schwierigkeitsstufen je Übung, unbegrenzt viele Nutzerprofile und
                eine Auswertung, die sich als PDF ausgeben lässt. Nach der
                Aktivierung läuft alles offline.
              </p>
              <div className="tag-row">
                <span className="tag">Einstieg · Aufbau · Herausforderung</span>
                <span className="tag">Trainingsablauf-Editor</span>
                <span className="tag">PDF- und CSV-Export</span>
              </div>
              <Link to="/kognitives-training" className="btn btn--primary">
                Module und Preise <ArrowRight size={16} strokeWidth={2.2} />
              </Link>
            </div>

            <div className="counters">
              {CATEGORY_ORDER.map((key) => (
                <div className="counter" key={key}>
                  <p className="counter__num" style={{ color: CATEGORIES[key].color }}>
                    {countByCategory(key)}
                  </p>
                  <p className="counter__label">{CATEGORIES[key].name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Produktpalette ───────────────────────────────────────────── */}
      <section className="band">
        <div className="wrap section">
          <div className="intro">
            <p className="eyebrow">Produktpalette</p>
            <h2 className="h-section">Woran wir arbeiten</h2>
            <p className="lede">
              Zwei Felder: Werkzeuge für kognitives Training und Dokumentation —
              und Werkzeuge für Optik und Photonik. Der Status steht hier so, wie
              er wirklich ist.
            </p>
          </div>

          <div className="grid grid--auto-250">
            {PIPELINE.map((item) => (
              <div
                key={item.id}
                className="card card--edge card--flow card--hover-purple"
                data-edge="1"
              >
                <span className={STATUS_CLASS[item.status]} style={{ marginBottom: 22 }}>
                  {STATUS_LABELS[item.status]}
                </span>
                <p className="card__field">{item.field}</p>
                <h3 className="card__title">{item.name}</h3>
                <p className="card__text" style={{ flex: 1 }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Aus dem Labor ────────────────────────────────────────────── */}
      <section className="band--plain">
        <div className="wrap wrap--narrow section">
          <div className="intro" style={{ marginBottom: 40 }}>
            <p className="eyebrow eyebrow--purple">Aus dem Labor</p>
            <h2 className="h-section">Offene Projekte</h2>
            <p className="lede">
              Frei zugängliche Werkzeuge aus Lehre, Forschung und Eigenbedarf.
              Kostenlos, ohne Registrierung, kein Teil des Lizenzangebots.
            </p>
          </div>

          <div className="grid grid--auto-280">
            {LAB_PROJECTS.map((project) => (
              <a
                key={project.id}
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="card card--plain card--edge card--flow card--link"
                data-edge="1"
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: 14,
                    marginBottom: 14,
                  }}
                >
                  <h3 className="card__title" style={{ margin: 0 }}>
                    {project.name}
                  </h3>
                  <ExternalLink
                    size={16}
                    color="#64748b"
                    style={{ flexShrink: 0, marginTop: 5 }}
                    aria-hidden="true"
                  />
                </div>
                <span className="badge badge--lab" style={{ marginBottom: 16 }}>
                  {project.tag}
                </span>
                <p className="card__text" style={{ flex: 1, marginBottom: 16 }}>
                  {project.description}
                </p>
                <p className="note" style={{ margin: 0 }}>
                  {project.context}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <Closer />
    </>
  );
}
