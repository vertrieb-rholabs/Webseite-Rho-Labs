import { Head } from 'vite-react-ssg';
import { SITE_URL } from '../constants';

interface SeoProps {
  title: string;
  description: string;
  /** Pfad ohne Domain, z.B. "/kognitives-training". */
  path: string;
  /** Seiten ohne eigenständigen Wert für die Suche ausnehmen. */
  noindex?: boolean;
}

/**
 * Titel, Beschreibung und kanonische Adresse je Seite.
 *
 * Wird beim Vorrendern in das ausgelieferte HTML geschrieben, steht also
 * auch ohne JavaScript im Quelltext.
 */
export default function Seo({ title, description, path, noindex }: SeoProps) {
  const url = `${SITE_URL}${path}`;
  const image = `${SITE_URL}/logo.png`;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, follow" />}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Rho-Labs" />
      <meta property="og:locale" content="de_DE" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Head>
  );
}
