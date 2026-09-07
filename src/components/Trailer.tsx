import { useRef, useState } from 'react';
import { Play } from 'lucide-react';

const POSTER = '/media/rho-labs-teaser-poster.jpg';
const SOURCE = '/media/rho-labs-teaser.mp4';

/**
 * Trailer mit Ton, ohne Autoplay.
 *
 * Erst der Klick startet das Video und blendet die Bedienleiste ein; vorher
 * steht nur das Standbild. Das Standbild kostet 70 KB, die Datei selbst wird
 * also nicht geladen, solange niemand darauf klickt. Die MP4-Datei liegt im
 * Verzeichnis der Seite — es wird nichts von Dritten nachgeladen.
 */
export default function Trailer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const start = () => {
    setPlaying(true);
    const video = videoRef.current;
    if (!video) return;
    video.controls = true;
    // Ohne muted kann der Browser das Abspielen verweigern; das ist hier in
    // Ordnung, weil die Bedienleiste dann trotzdem sichtbar bleibt.
    void video.play().catch(() => {});
  };

  return (
    <div className="trailer">
      <video
        ref={videoRef}
        playsInline
        preload="none"
        poster={POSTER}
        aria-label="Trailer: die Anwendung Kognitives Training im Betrieb"
      >
        <source src={SOURCE} type="video/mp4" />
        Ihr Browser kann dieses Video nicht abspielen.{' '}
        <a href={SOURCE}>Trailer herunterladen</a>.
      </video>

      {!playing && (
        <button type="button" className="trailer__cover" onClick={start}>
          <span className="trailer__play" aria-hidden="true">
            <Play size={28} fill="currentColor" strokeWidth={0} />
          </span>
          <span className="trailer__label">Trailer starten</span>
        </button>
      )}
    </div>
  );
}
