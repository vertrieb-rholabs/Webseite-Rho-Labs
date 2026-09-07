import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Download, Info } from 'lucide-react';
import Seo from '../components/Seo';
import Trailer from '../components/Trailer';
import Closer from '../components/Closer';
import {
  APP_VERSION,
  CATEGORIES,
  CATEGORY_ORDER,
  DEMONSTRATIONS,
  DOWNLOAD_URL,
  GAME_COUNT,
  GAMES,
  MDR_DISCLAIMER,
  PLANS,
  SHOT_KATALOG,
  SHOT_RADAR,
  SHOT_VERLAUF,
  SHOT_VORFUEHRUNG,
  STATS_FEATURES,
  SYSTEM_REQUIREMENTS,
  USE_CASES,
  countByCategory,
} from '../constants';
import type { GameCategory } from '../types';

type Filter = GameCategory | 'alle';

export default function ProductPage() {
  const [filter, setFilter] = useState<Filter>('alle');

  const filters: { key: Filter; label: string }[] = [
    { key: 'alle', label: `Alle ${GAME_COUNT}` },
    ...CATEGORY_ORDER.map((key) => ({
      key: key as Filter,
      label: `${CATEGORIES[key].name} · ${countByCategory(key)}`,
    })),
  ];

  const visible = filter === 'alle' ? GAMES : GAMES.filter((g) => g.cat === filter);

  return (
    <>
      <Seo
        path="/kognitives-training"
        title="Kognitives Training — Rho-Labs"
        description={`Windows-Anwendung mit ${GAME_COUNT} Übungen für Gedächtnis, räumliches Denken, Handlungssteuerung und Aufmerksamkeit. Einmaliger Kauf ab 119 €, Demo 14 Tage kostenlos.`}
      />

      {/* ── Held ─────────────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero__bg" aria-hidden="true">
          <div className="mesh" />
          <div className="hero__glow" style={{ width: 1000, height: 560, top: -300 }} />
        </div>
        <div className="hero__inner hero__inner--slim">
          <span className="pill" style={{ marginBottom: 28 }}>
            Windows-Anwendung · Version {APP_VERSION}
          </span>
          <h1 className="hero__title hero__title--product">
            Kognitives <span className="grad grad--duo">Training</span>
          </h1>
          <p className="hero__lede" style={{ marginBottom: 20 }}>
            {GAME_COUNT} Übungen für Gedächtnis, räumliches Denken,
            Handlungssteuerung und Aufmerksamkeit. Je Übung drei
            Schwierigkeitsstufen, unbegrenzt viele Nutzerprofile, Auswertung als
            PDF.
          </p>
          <p style={{ fontSize: 14.5, color: '#64748b', margin: '0 0 36px' }}>
            Auslieferung als Installer (EXE). Nach der einmaligen Aktivierung
            läuft die Anwendung offline; Trainingsdaten verlassen das Gerät
            nicht.
          </p>
          <div className="btn-row btn-row--center">
            <Link to="/kontakt" className="btn btn--primary">
              Demo anfordern — 14 Tage
            </Link>
            <a
              href={DOWNLOAD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--ghost"
            >
              <Download size={17} /> Download für Windows
            </a>
          </div>
        </div>
      </section>

      {/* ── Trailer ──────────────────────────────────────────────────── */}
      <section
        className="wrap wrap--narrow"
        style={{ paddingTop: 'clamp(44px, 5vw, 76px)', paddingBottom: 'clamp(44px, 5vw, 76px)' }}
      >
        <Trailer />
      </section>

      {/* ── Spielekatalog ────────────────────────────────────────────── */}
      <section className="band band--closed">
        <div className="wrap section">
          <div className="intro" style={{ marginBottom: 32 }}>
            <p className="eyebrow">Spielekatalog</p>
            <h2 className="h-section" style={{ marginBottom: 14 }}>
              {GAME_COUNT} Übungen in vier Bereichen
            </h2>
            <p className="lede">
              Jede Übung hat eigene Stufen und eine eigene Auswertung. Vor dem
              ersten Start erklärt eine Vorführung, was zu tun ist.
            </p>
          </div>

          <div className="shot" style={{ marginBottom: 36 }}>
            <div className="shot__chrome" aria-hidden="true">
              <span className="shot__dot" />
              <span className="shot__dot" />
              <span className="shot__dot" />
              <span className="shot__name">
                Kognitives Training {APP_VERSION} — Spielekatalog
              </span>
            </div>
            <img
              src="/bilder/app-katalog.webp"
              alt={`Spielekatalog der Anwendung: alle ${GAME_COUNT} Übungen als Karten mit Aufgabenbereich und Schwierigkeitsstufe`}
              width={SHOT_KATALOG.width}
              height={SHOT_KATALOG.height}
              loading="lazy"
            />
          </div>

          <div className="filters" role="group" aria-label="Übungen nach Aufgabenbereich filtern">
            {filters.map((f) => (
              <button
                key={f.key}
                type="button"
                className="filter"
                aria-pressed={filter === f.key}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="grid grid--auto-260">
            {visible.map((game) => {
              const cat = CATEGORIES[game.cat];
              return (
                <div className="game card--edge" data-edge="1" key={game.label}>
                  <div className="game__head">
                    <span
                      className="game__dot"
                      style={{ background: cat.color }}
                      aria-hidden="true"
                    />
                    <h3>{game.label}</h3>
                  </div>
                  <p className="game__text">{game.text}</p>
                  <p className="game__cat" style={{ color: cat.color }}>
                    {cat.name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Auswertung ───────────────────────────────────────────────── */}
      <section className="wrap section">
        <div className="intro" style={{ marginBottom: 40 }}>
          <p className="eyebrow">Auswertung</p>
          <h2 className="h-section">Statistik, die man vorlegen kann</h2>
          <p className="lede">
            Jede Einheit wird protokolliert und lässt sich auswerten — nach
            Übung, nach Aufgabenbereich und über die Zeit. Der Bericht geht als
            PDF raus, die Rohdaten als CSV.
          </p>
        </div>

        <div className="grid grid--auto-280" style={{ marginBottom: 28 }}>
          {STATS_FEATURES.map(({ title, text, Icon }) => (
            <div
              className="card card--edge card--hover-cyan"
              data-edge="1"
              key={title}
              style={{ padding: 24, borderRadius: 16 }}
            >
              <span className="icon-box icon-box--sm" style={{ marginBottom: 16 }} aria-hidden="true">
                <Icon size={17} />
              </span>
              <h3 style={{ fontSize: 16.5, fontWeight: 700, margin: '0 0 9px', letterSpacing: '-0.01em' }}>
                {title}
              </h3>
              <p className="card__text" style={{ fontSize: 14 }}>
                {text}
              </p>
            </div>
          ))}
        </div>

        <div className="stack">
          <div className="shot shot--sm">
            <p className="shot__caption">Fortschrittsverlauf nach Aufgabenbereich</p>
            <img
              src="/bilder/app-verlauf.webp"
              alt="Fortschrittsverlauf nach Spieltyp über 21 Tage, getrennt nach den vier Aufgabenbereichen"
              width={SHOT_VERLAUF.width}
              height={SHOT_VERLAUF.height}
              loading="lazy"
            />
          </div>
          <div className="shot shot--sm">
            <p className="shot__caption">Netzdiagramm je Schwierigkeitsstufe</p>
            <img
              src="/bilder/app-radar.webp"
              alt="Netzdiagramm der vier Aufgabenbereiche, je Schwierigkeitsstufe eine eigene Fläche"
              width={SHOT_RADAR.width}
              height={SHOT_RADAR.height}
              loading="lazy"
            />
          </div>
        </div>
        <p className="note" style={{ display: 'block', marginTop: 14 }}>
          Die beiden Diagramme zeigen erzeugte Beispieldaten, keine echten
          Trainingsverläufe.
        </p>
      </section>

      {/* ── Vorführungen ─────────────────────────────────────────────── */}
      <section className="band band--closed">
        <div className="wrap section">
          <div className="intro" style={{ marginBottom: 36 }}>
            <p className="eyebrow eyebrow--purple">Vorführungen</p>
            <h2 className="h-section" style={{ fontSize: 'clamp(26px, 3vw, 40px)' }}>
              Jede Übung erklärt sich selbst
            </h2>
            <p className="lede">
              Statt einer Anleitung läuft vor dem Start eine kurze Vorführung ab,
              die den Ablauf Schritt für Schritt zeigt — mit denselben Farben und
              Regeln wie die Übung selbst. Vier Beispiele:
            </p>
          </div>

          <div className="grid grid--auto-240">
            {DEMONSTRATIONS.map((demo) => (
              <div className="shot shot--tile" key={demo.image}>
                <div className="shot__frame">
                  <img
                    src={`/bilder/${demo.image}`}
                    alt={demo.alt}
                    width={SHOT_VORFUEHRUNG.width}
                    height={SHOT_VORFUEHRUNG.height}
                    loading="lazy"
                  />
                </div>
                <div className="shot__body">
                  <h3>{demo.title}</h3>
                  <p>{demo.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Einsatz und Systemanforderungen ──────────────────────────── */}
      <section className="wrap wrap--narrow section">
        <div className="grid grid--split">
          <div>
            <p className="eyebrow">Einsatz</p>
            <h2 className="h-section" style={{ fontSize: 'clamp(26px, 3vw, 38px)', marginBottom: 20 }}>
              Wo die Anwendung eingesetzt wird
            </h2>
            <ul className="checklist">
              {USE_CASES.map((item) => (
                <li key={item}>
                  <Check size={17} color="#22d3ee" strokeWidth={2.4} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="card card--edge card--hover-purple" data-edge="1" style={{ padding: 28 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 18px' }}>
              Systemanforderungen
            </h3>
            <ul className="plain-list" style={{ marginBottom: 24 }}>
              {SYSTEM_REQUIREMENTS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="callout">
              <h4>
                <Info size={15} aria-hidden="true" /> Beim ersten Start
              </h4>
              <p>
                Die Anwendung hat noch kein kommerzielles
                Code-Signing-Zertifikat. Windows Defender SmartScreen kann
                deshalb eine Warnung zeigen: „Weitere Informationen“ und dann
                „Trotzdem ausführen“. Die Installationsdatei kommt direkt über
                unseren Release-Kanal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Lizenzen ─────────────────────────────────────────────────── */}
      <section className="band" id="lizenzen">
        <div className="wrap section">
          <div className="intro intro--center">
            <p className="eyebrow">Lizenzen</p>
            <h2 className="h-section">Einmal kaufen, dauerhaft nutzen</h2>
            <p className="lede">
              Keine laufenden Kosten. Sicherheits-Patches und Bugfixes sind
              kostenlos; größere Feature-Updates werden als optionale Upgrades
              angeboten.
            </p>
          </div>

          <div className="grid grid--auto-290">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`plan card--edge${plan.isFeatured ? ' plan--featured' : ''}`}
                data-edge="1"
              >
                <div className="plan__head">
                  <h3>{plan.name}</h3>
                  {plan.badge && (
                    <span className="badge badge--available">{plan.badge}</span>
                  )}
                </div>
                <p className="plan__price">{plan.price}</p>
                <p className="plan__sub">{plan.subtext}</p>

                <ul className="plan__features">
                  {plan.features.map((feature) => (
                    <li key={feature.text} data-hi={feature.highlight ? 'true' : 'false'}>
                      <Check size={16} color="#22d3ee" strokeWidth={2.4} aria-hidden="true" />
                      <span>{feature.text}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={plan.ctaLink}
                  className={`plan__cta${plan.isFeatured ? ' plan__cta--primary' : ''}`}
                >
                  {plan.ctaText}
                </a>
                {plan.paypalLink && (
                  <a
                    href={plan.paypalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="plan__paypal"
                  >
                    Sofort per PayPal kaufen
                  </a>
                )}
              </div>
            ))}
          </div>

          <p className="price-note">
            Alle Preise sind Endpreise. Gemäß §19 UStG wird keine Umsatzsteuer
            berechnet. Derzeit ausschließlich in Deutschland erhältlich.
          </p>
        </div>
      </section>

      {/* ── Kaufprozess ──────────────────────────────────────────────── */}
      <section className="wrap wrap--narrow section--tight">
        <div className="howto">
          <h3>So funktioniert der Kauf</h3>
          <div className="grid grid--auto-280" style={{ gap: 28 }}>
            <div className="howto__step">
              <p>Option 1 — PayPal</p>
              <p>
                Auf „Sofort per PayPal kaufen“ klicken. Nach Zahlungseingang
                kommt der Lizenzschlüssel automatisch per E-Mail, in der Regel
                innerhalb weniger Minuten. Bitte die E-Mail-Adresse im
                Verwendungszweck angeben.
              </p>
            </div>
            <div className="howto__step">
              <p>Option 2 — Rechnung</p>
              <p>
                Auf „Lizenz erwerben“ klicken und die vorbereitete Bestellmail
                abschicken. Sie erhalten eine Rechnung per E-Mail, zahlbar per
                PayPal oder Banküberweisung; danach kommt der Lizenzschlüssel.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Sonderanforderungen und MDR-Hinweis ──────────────────────── */}
      <section
        className="wrap wrap--narrow"
        style={{ paddingBottom: 'clamp(56px, 7vw, 96px)' }}
      >
        <div className="grid grid--auto-300">
          <div className="info-card info-card--purple">
            <h3>Individuelle Anforderungen?</h3>
            <p>
              Wir entwickeln gegen Aufpreis Funktionen nach Ihren Anforderungen —
              von zugeschnittenen Übungen bis zu eigenen Auswertungen.
              Enterprise-Kunden können außerdem Normwerte anpassen lassen.
            </p>
            <a
              href={`mailto:kontakt.rholabs@gmail.com?subject=${encodeURIComponent('Anfrage Custom Feature-Entwicklung')}`}
              className="link-arrow"
            >
              Anforderungen besprechen <ArrowRight size={15} strokeWidth={2.2} />
            </a>
          </div>

          <div className="disclaimer">
            <span className="icon-box icon-box--sm icon-box--grey" aria-hidden="true">
              <Info size={17} />
            </span>
            <p>{MDR_DISCLAIMER}</p>
          </div>
        </div>
      </section>

      <Closer />
    </>
  );
}
