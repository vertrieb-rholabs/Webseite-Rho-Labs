import type { ReactNode } from 'react';
import Seo from '../../components/Seo';

interface StatusPageProps {
  path: string;
  title: string;
  icon: ReactNode;
  tone: 'cyan' | 'amber';
  body: ReactNode;
  note: ReactNode;
  action: ReactNode;
}

/**
 * Gemeinsames Geruest der drei Bestaetigungsseiten.
 *
 * Diese Seiten sind die fest verdrahteten Weiterleitungsziele des
 * Auslieferungsdienstes. Sie tragen `noindex`: fuer die Suche haben sie
 * keinen Wert und in Ergebnislisten waeren sie nur verwirrend.
 */
export default function StatusPage({
  path,
  title,
  icon,
  tone,
  body,
  note,
  action,
}: StatusPageProps) {
  return (
    <>
      <Seo path={path} title={`${title} — Rho-Labs`} description={title} noindex />

      <div className="wrap wrap--form">
        <div className="status-page">
          <span className={`icon-round icon-round--${tone}`} aria-hidden="true">
            {icon}
          </span>
          <h1>{title}</h1>
          <p className="status-page__body">{body}</p>
          <p className="status-page__note">{note}</p>
          {action}
        </div>
      </div>
    </>
  );
}
