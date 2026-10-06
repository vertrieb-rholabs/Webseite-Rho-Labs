// ACHTUNG: erzeugte Datei — nicht von Hand bearbeiten.
//
// Erzeugt aus dem Evidenzregister der Anwendung durch
//   node scripts/evidenz-uebernehmen.mjs
// Quelle: docs/evidenz/evidenz.json im Projekt Gedaechtniss-Training
// Stand des Registers: 2026-09-07
// Bereinigt durch: scripts/evidenz-bereinigung.json (Herkunft statt Wirkung)
//
// Aenderungen gehoeren ins Register bzw. in die Bereinigungsdatei, nicht hierher.

export interface EvidenzQuelle {
  doi: string | null;
  autoren: string[];
  weitereAutoren: number;
  jahr: number | null;
  titel: string;
  zeitschrift: string;
  band: string | null;
  seiten: string | null;
  url: string | null;
}

export interface EvidenzSpiel {
  key: string;
  label: string;
  kategorie: string | null;
  domaenen: string | null;
  /** Herkunftstext: auf welche Aufgabenform die Uebung zurueckgeht. */
  evidenztext: string | null;
  /** true, sobald mindestens eine Quelle zur Herkunft der Aufgabenform fuehrt. */
  belegt: boolean;
  quellen: EvidenzQuelle[];
}

/** Stand des uebernommenen Registers. */
export const EVIDENZ_STAND = "2026-09-07";

export const EVIDENZ: EvidenzSpiel[] = [
  {
    "key": "oddout",
    "label": "Was passt nicht?",
    "kategorie": "Denken & Planen",
    "domaenen": "Semantisches Wissen, kategoriale Zuordnung",
    "evidenztext": "Semantische Kognition — Wissen nutzen, das über das Leben erworben wurde — ist ein eigenes System neben dem episodischen Merken; bildhafte Zuordnungsaufgaben greifen es auf (Lambon Ralph u. a. 2017). Das Vier-Wahl-Zuordnungsformat mit Bildern stammt aus der Camel-and-Cactus-Aufgabe. Verbales Wissen und verarbeitungsintensive Aufgaben verlaufen über die Lebensspanne unterschiedlich (Park u. a. 2002); deshalb ergänzt die Übung im Katalog die Wortliste, statt sie zu doppeln.",
    "belegt": true,
    "quellen": [
      {
        "doi": "10.1038/nrn.2016.150",
        "autoren": [
          "Ralph, Matthew A. Lambon",
          "Jefferies, Elizabeth",
          "Patterson, Karalyn"
        ],
        "weitereAutoren": 1,
        "jahr": 2016,
        "titel": "The neural and computational bases of semantic cognition",
        "zeitschrift": "Nature Reviews Neuroscience",
        "band": "18",
        "seiten": "42-55",
        "url": "https://doi.org/10.1038/nrn.2016.150"
      },
      {
        "doi": "10.1037/0882-7974.17.2.299",
        "autoren": [
          "Park, Denise C.",
          "Lautenschlager, Gary",
          "Hedden, Trey"
        ],
        "weitereAutoren": 3,
        "jahr": 2002,
        "titel": "Models of visuospatial and verbal memory across the adult life span.",
        "zeitschrift": "Psychology and Aging",
        "band": "17",
        "seiten": "299-320",
        "url": "https://doi.org/10.1037/0882-7974.17.2.299"
      }
    ]
  },
  {
    "key": "plan",
    "label": "Zug um Zug",
    "kategorie": "Denken & Planen",
    "domaenen": "Mehrschrittiges Planen, Suchtiefe, Zielhierarchie",
    "evidenztext": "Die Übung geht auf Turmaufgaben der kognitiven Psychologie zurück (Aufgabe „Turm von London“). Ihre Schwierigkeit hängt nicht nur an der Zugzahl, sondern an Suchtiefe, Zielhierarchie und der Zahl optimaler Pfade (Kaller u. a. 2012). Turmaufgaben hängen mit anderen Aufgaben zur exekutiven Kontrolle zusammen, sind aber kein Synonym dafür (Sullivan u. a. 2009).",
    "belegt": true,
    "quellen": [
      {
        "doi": "10.1037/a0025174",
        "autoren": [
          "Kaller, Christoph P.",
          "Unterrainer, Josef M.",
          "Stahl, Christoph"
        ],
        "weitereAutoren": 0,
        "jahr": 2012,
        "titel": "Assessing planning ability with the Tower of London task: Psychometric properties of a structurally balanced problem set.",
        "zeitschrift": "Psychological Assessment",
        "band": "24",
        "seiten": "46-53",
        "url": "https://doi.org/10.1037/a0025174"
      },
      {
        "doi": "10.1080/09084280802644243",
        "autoren": [
          "Sullivan, Jeremy R.",
          "Riccio, Cynthia A.",
          "Castillo, Christine L."
        ],
        "weitereAutoren": 0,
        "jahr": 2009,
        "titel": "Concurrent Validity of the Tower Tasks as Measures of Executive Function in Adults: A Meta-Analysis",
        "zeitschrift": "Applied Neuropsychology",
        "band": "16",
        "seiten": "62-75",
        "url": "https://doi.org/10.1080/09084280802644243"
      }
    ]
  },
  {
    "key": "stroop",
    "label": "Farb-Falle",
    "kategorie": "Denken & Steuern",
    "domaenen": "Inhibition, Interferenzkontrolle",
    "evidenztext": "Die Übung greift die Stroop-Aufgabe auf: die Schriftfarbe angeben, nicht das gelesene Wort. Sie gehört zu den am besten dokumentierten Aufgaben zur Interferenzkontrolle (Diamond 2013, *Annual Review of Psychology* 64, 135–168, DOI [10.1146/annurev-psych-113011-143750](https://doi.org/10.1146/annurev-psych-113011-143750)).",
    "belegt": true,
    "quellen": [
      {
        "doi": "10.1146/annurev-psych-113011-143750",
        "autoren": [
          "Diamond, Adele"
        ],
        "weitereAutoren": 0,
        "jahr": 2013,
        "titel": "Executive Functions",
        "zeitschrift": "Annual Review of Psychology",
        "band": "64",
        "seiten": "135-168",
        "url": "https://doi.org/10.1146/annurev-psych-113011-143750"
      }
    ]
  },
  {
    "key": "logicspan",
    "label": "Merken & Logik",
    "kategorie": "Denken & Steuern",
    "domaenen": "Arbeitsgedächtnis unter Interferenz, Regelhalten, Aktualisierung",
    "evidenztext": "Die Übung folgt dem Muster der Spannenaufgaben zum Arbeitsgedächtnis: Symbole werden behalten, während zwischendurch eine zweite Aufgabe zu lösen ist (Conway u. a. 2005, *Psychonomic Bulletin & Review* 12(5), 769–786, DOI [10.3758/BF03196772](https://doi.org/10.3758/BF03196772)).",
    "belegt": true,
    "quellen": [
      {
        "doi": "10.3758/BF03196772",
        "autoren": [
          "Conway, Andrew R. A.",
          "Kane, Michael J.",
          "Bunting, Michael F."
        ],
        "weitereAutoren": 3,
        "jahr": 2005,
        "titel": "Working memory span tasks: A methodological review and user’s guide",
        "zeitschrift": "Psychonomic Bulletin & Review",
        "band": "12",
        "seiten": "769-786",
        "url": "https://doi.org/10.3758/BF03196772"
      }
    ]
  },
  {
    "key": "nback",
    "label": "Rückblick-Spiel",
    "kategorie": "Denken & Steuern",
    "domaenen": "Arbeitsgedächtnis, Aktualisierung",
    "evidenztext": "Die Aufgabe geht auf Kirchner zurück (Kirchner 1958, *Journal of Experimental Psychology* 55, 352-358, DOI [10.1037/h0043688](https://doi.org/10.1037/h0043688)): Der aktuelle Reiz wird mit dem von einem, zwei oder drei Schritten vorher verglichen. Sie ist als Aufgabe zur Aktualisierung im Arbeitsgedächtnis etabliert. Als Ersatz für komplexe Spannenaufgaben taugt sie nicht; beide hängen nur schwach zusammen (Kane u. a. 2007, *Journal of Experimental Psychology: Learning, Memory, and Cognition* 33, 615-622, DOI [10.1037/0278-7393.33.3.615](https://doi.org/10.1037/0278-7393.33.3.615)).",
    "belegt": true,
    "quellen": [
      {
        "doi": "10.1037/h0043688",
        "autoren": [
          "Kirchner, Wayne K."
        ],
        "weitereAutoren": 0,
        "jahr": 1958,
        "titel": "Age differences in short-term retention of rapidly changing information.",
        "zeitschrift": "Journal of Experimental Psychology",
        "band": "55",
        "seiten": "352-358",
        "url": "https://doi.org/10.1037/h0043688"
      },
      {
        "doi": "10.1037/0278-7393.33.3.615",
        "autoren": [
          "Kane, Michael J.",
          "Conway, Andrew R. A.",
          "Miura, Timothy K."
        ],
        "weitereAutoren": 1,
        "jahr": 2007,
        "titel": "Working memory, attention control, and the n-back task: A question of construct validity.",
        "zeitschrift": "Journal of Experimental Psychology: Learning, Memory, and Cognition",
        "band": "33",
        "seiten": "615-622",
        "url": "https://doi.org/10.1037/0278-7393.33.3.615"
      }
    ]
  },
  {
    "key": "switchtrail",
    "label": "Wechselpfad",
    "kategorie": "Denken & Steuern",
    "domaenen": "Set-Shifting, visuelle Suche, Verarbeitungsgeschwindigkeit",
    "evidenztext": "Die Übung greift die Trail-Making-Aufgabe auf: Eine Folge wird abgearbeitet, und dabei ist zwischen zwei Regeln zu wechseln (Bowie & Harvey 2006, *Nature Protocols* 1, 2277–2281, DOI [10.1038/nprot.2006.390](https://doi.org/10.1038/nprot.2006.390)).",
    "belegt": true,
    "quellen": [
      {
        "doi": "10.1038/nprot.2006.390",
        "autoren": [
          "Bowie, Christopher R",
          "Harvey, Philip D"
        ],
        "weitereAutoren": 0,
        "jahr": 2006,
        "titel": "Administration and interpretation of the Trail Making Test",
        "zeitschrift": "Nature Protocols",
        "band": "1",
        "seiten": "2277-2281",
        "url": "https://doi.org/10.1038/nprot.2006.390"
      }
    ]
  },
  {
    "key": "figure",
    "label": "Figur aus dem Gedächtnis",
    "kategorie": "Merken & Lernen",
    "domaenen": "Visuelle episodische Erinnerung, visuell-konstruktive Reproduktion",
    "evidenztext": "Das Nachzeichnen einer Figur aus dem Gedächtnis geht auf die visuell-konstruktive Reproduktion zurück, eine etablierte Aufgabenform der kognitiven Psychologie. Digitale Arbeiten zeigen, dass Endprodukt, Organisation und **Motorik getrennte Dimensionen** sind (Petilli et al. 2021, *Scientific Reports* 11, 14895, DOI [10.1038/s41598-021-94247-9](https://doi.org/10.1038/s41598-021-94247-9)).",
    "belegt": true,
    "quellen": [
      {
        "doi": "10.1145/1294211.1294238",
        "autoren": [
          "Wobbrock, Jacob O.",
          "Wilson, Andrew D.",
          "Li, Yang"
        ],
        "weitereAutoren": 0,
        "jahr": 2007,
        "titel": "Gestures without libraries, toolkits or training: a $1 recognizer for user interface prototypes",
        "zeitschrift": "Proceedings of the 20th annual ACM symposium on User interface software and technology",
        "band": null,
        "seiten": "159-168",
        "url": "https://doi.org/10.1145/1294211.1294238"
      },
      {
        "doi": "10.1038/s41598-021-94247-9",
        "autoren": [
          "Petilli, Marco A.",
          "Daini, Roberta",
          "Saibene, Francesca Lea"
        ],
        "weitereAutoren": 1,
        "jahr": 2021,
        "titel": "Automated scoring for a Tablet-based Rey Figure copy task differentiates constructional, organisational, and motor abilities",
        "zeitschrift": "Scientific Reports",
        "band": "11",
        "seiten": null,
        "url": "https://doi.org/10.1038/s41598-021-94247-9"
      }
    ]
  },
  {
    "key": "memory",
    "label": "Memo-Match",
    "kategorie": "Merken & Lernen",
    "domaenen": "Visuelles Wiedererkennen, Paarassoziation",
    "evidenztext": "Das Aufdeckspiel ist als Aufgabe eigens untersucht worden, sowohl zur Gedächtnisleistung (Schumann-Hengsteler 1996, *The Journal of Genetic Psychology* 157, 77-92, DOI [10.1080/00221325.1996.9914847](https://doi.org/10.1080/00221325.1996.9914847)) als auch zum Strategieeinsatz beim Aufdecken (Baker-Ward u. a. 1988, *Bulletin of the Psychonomic Society* 26, 331-332, DOI [10.3758/bf03337672](https://doi.org/10.3758/bf03337672)). Ergebnis und Strategie hängen erheblich vom Zufall der Aufdeckreihenfolge ab.",
    "belegt": true,
    "quellen": [
      {
        "doi": "10.1080/00221325.1996.9914847",
        "autoren": [
          "Schumann-Hengsteler, Ruth"
        ],
        "weitereAutoren": 0,
        "jahr": 1996,
        "titel": "Children's and Adults' Visuospatial Memory: The Game Concentration",
        "zeitschrift": "The Journal of Genetic Psychology",
        "band": "157",
        "seiten": "77-92",
        "url": "https://doi.org/10.1080/00221325.1996.9914847"
      },
      {
        "doi": "10.3758/bf03337672",
        "autoren": [
          "Baker-Ward, Lynne",
          "Ornstein, Peter A."
        ],
        "weitereAutoren": 0,
        "jahr": 1988,
        "titel": "Age differences in visual-spatial memory performance: Do children really out-perform adults when playing Concentration?",
        "zeitschrift": "Bulletin of the Psychonomic Society",
        "band": "26",
        "seiten": "331-332",
        "url": "https://doi.org/10.3758/bf03337672"
      }
    ]
  },
  {
    "key": "recog",
    "label": "Schon gesehen?",
    "kategorie": "Merken & Lernen",
    "domaenen": "Episodisches Wiedererkennen, Entscheidungskriterium",
    "evidenztext": "Das Ja/Nein-Wiedererkennen — entscheiden, ob ein Reiz schon gesehen wurde oder neu ist — ist eine etablierte Aufgabenform der Gedächtnispsychologie. Wiedererkennen ist nicht dasselbe wie freies Erinnern: Vertrautheit und bewusste Erinnerung tragen unterschiedlich bei (Yonelinas 2002), und Abruf und Wiedererkennen stellen unterschiedliche Anforderungen (Craik & McDowd 1987). Deshalb wäre ein Katalog, der nur freien Abruf enthält, in der Abrufdimension einseitig.",
    "belegt": true,
    "quellen": [
      {
        "doi": "10.1006/jmla.2002.2864",
        "autoren": [
          "Yonelinas, Andrew P"
        ],
        "weitereAutoren": 0,
        "jahr": 2002,
        "titel": "The Nature of Recollection and Familiarity: A Review of 30 Years of Research",
        "zeitschrift": "Journal of Memory and Language",
        "band": "46",
        "seiten": "441-517",
        "url": "https://doi.org/10.1006/jmla.2002.2864"
      },
      {
        "doi": "10.1037/0278-7393.13.3.474",
        "autoren": [
          "Craik, Fergus I. M.",
          "McDowd, Joan M."
        ],
        "weitereAutoren": 0,
        "jahr": 1987,
        "titel": "Age differences in recall and recognition.",
        "zeitschrift": "Journal of Experimental Psychology: Learning, Memory, and Cognition",
        "band": "13",
        "seiten": "474-479",
        "url": "https://doi.org/10.1037/0278-7393.13.3.474"
      }
    ]
  },
  {
    "key": "order",
    "label": "Was kam zuerst?",
    "kategorie": "Merken & Lernen",
    "domaenen": "Zeitliche Reihenfolge, Bindung Item–Zeitpunkt",
    "evidenztext": "Urteile über die relative Aktualität zweier Items — welches war früher zu sehen — sind eine etablierte Aufgabenform für zeitliche Ordnung im Kurzzeitgedächtnis (Kılıç u. a. 2017; Crossref führt die Arbeit mit dem Online-Jahr 2016). Item, Ort und Zeitpunkt sind trennbar, und das Binden dieser Merkmale ist eine eigene Anforderung (Kessels u. a. 2007).",
    "belegt": true,
    "quellen": [
      {
        "doi": "10.1093/geronb/gbw003",
        "autoren": [
          "Kılıç, Aslı",
          "Sayalı, Zeynep Ceyda",
          "Öztekin, Ilke"
        ],
        "weitereAutoren": 0,
        "jahr": 2017,
        "titel": "Aging Slows Access to Temporal Information From Working Memory",
        "zeitschrift": "The Journals of Gerontology: Series B",
        "band": "72",
        "seiten": "996-1005",
        "url": "https://doi.org/10.1093/geronb/gbw003"
      },
      {
        "doi": "10.1080/00207450600910218",
        "autoren": [
          "KESSELS, ROY P. C.",
          "HOBBEL, DEBBIE",
          "POSTMA, ALBERT"
        ],
        "weitereAutoren": 0,
        "jahr": 2007,
        "titel": "AGING, CONTEXT MEMORY AND BINDING: A COMPARISON OF “WHAT, WHERE AND WHEN” IN YOUNG AND OLDER ADULTS",
        "zeitschrift": "International Journal of Neuroscience",
        "band": "117",
        "seiten": "795-810",
        "url": "https://doi.org/10.1080/00207450600910218"
      }
    ]
  },
  {
    "key": "word",
    "label": "Wortliste",
    "kategorie": "Merken & Lernen",
    "domaenen": "Verbales Gedächtnis, freier Abruf",
    "evidenztext": "Das Lernen und freie Wiedergeben einer Wortliste geht auf Rey zurück (Rey 1958, Presses Universitaires de France — ohne DOI, nicht maschinell prüfbar) und wurde im deutschsprachigen Raum unter anderem von Lux u. a. (1999, *Diagnostica* 45, 205–211, DOI [10.1026//0012-1924.45.4.205](https://doi.org/10.1026//0012-1924.45.4.205)) für Wortlistenaufgaben beschrieben. Diese Übung gibt die Wörter schriftlich vor und nimmt die Antwort getippt entgegen.",
    "belegt": true,
    "quellen": [
      {
        "doi": null,
        "autoren": [
          "Rey, André"
        ],
        "weitereAutoren": 0,
        "jahr": 1958,
        "titel": "L'examen clinique en psychologie",
        "zeitschrift": "Presses Universitaires de France",
        "band": null,
        "seiten": null,
        "url": null
      },
      {
        "doi": "10.1026//0012-1924.45.4.205",
        "autoren": [
          "Lux, S.",
          "Helmstaedter, C.",
          "Elger, C. E."
        ],
        "weitereAutoren": 0,
        "jahr": 1999,
        "titel": "Normierungsstudie zum Verbalen Lern- und Merkfähigkeitstest (VLMT)",
        "zeitschrift": "Diagnostica",
        "band": "45",
        "seiten": "205-211",
        "url": "https://doi.org/10.1026//0012-1924.45.4.205"
      }
    ]
  },
  {
    "key": "rotate",
    "label": "Drehen im Kopf",
    "kategorie": "Raum & Formen",
    "domaenen": "Mentale Rotation, räumliche Transformation",
    "evidenztext": "Die Übung geht auf die Aufgabe zur mentalen Rotation zurück (Shepard & Metzler 1971, *Science* 171(3972), 701–703, DOI [10.1126/science.171.3972.701](https://doi.org/10.1126/science.171.3972.701)): Eine Figur wird gedanklich gedreht und unter gedrehten Varianten wiedergefunden.",
    "belegt": true,
    "quellen": [
      {
        "doi": "10.1126/science.171.3972.701",
        "autoren": [
          "Shepard, Roger N.",
          "Metzler, Jacqueline"
        ],
        "weitereAutoren": 0,
        "jahr": 1971,
        "titel": "Mental Rotation of Three-Dimensional Objects",
        "zeitschrift": "Science",
        "band": "171",
        "seiten": "701-703",
        "url": "https://doi.org/10.1126/science.171.3972.701"
      }
    ]
  },
  {
    "key": "pattern",
    "label": "Muster",
    "kategorie": "Raum & Formen",
    "domaenen": "Visuelles Kurzzeitgedächtnis",
    "evidenztext": "Die Übung greift eine Aufgabenform auf, die in der Forschung eigens entwickelt wurde, um visuelles Mustergedächtnis vom sequenziell-räumlichen Corsi-Konstrukt zu trennen (Della Sala u. a. 1999, *Neuropsychologia* 37, 1189-1199, DOI [10.1016/s0028-3932(98)00159-6](https://doi.org/10.1016/s0028-3932(98)00159-6)). Das Raster dieser Übung ist dieser Aufgabenform nachempfunden.",
    "belegt": true,
    "quellen": [
      {
        "doi": "10.1016/s0028-3932(98)00159-6",
        "autoren": [
          "Della Sala, Sergio",
          "Gray, Colin",
          "Baddeley, Alan"
        ],
        "weitereAutoren": 2,
        "jahr": 1999,
        "titel": "Pattern span: a tool for unwelding visuo–spatial memory",
        "zeitschrift": "Neuropsychologia",
        "band": "37",
        "seiten": "1189-1199",
        "url": "https://doi.org/10.1016/s0028-3932(98)00159-6"
      }
    ]
  },
  {
    "key": "corsirev",
    "label": "Rückwärts-Muster",
    "kategorie": "Raum & Formen",
    "domaenen": "Arbeitsgedächtnis, visuell-räumlich",
    "evidenztext": "Die Übung geht auf die Corsi-Block-Aufgabe zurück, eine etablierte Aufgabenform für die visuell-räumliche Spanne (Kessels et al. 2000, *Applied Neuropsychology* 7(4), 252–258, DOI [10.1207/S15324826AN0704_8](https://doi.org/10.1207/S15324826AN0704_8)); hier wird dieselbe Folge in umgekehrter Reihenfolge angetippt.",
    "belegt": true,
    "quellen": [
      {
        "doi": "10.1207/S15324826AN0704_8",
        "autoren": [
          "Kessels, Roy P. C.",
          "van Zandvoort, Martine J. E.",
          "Postma, Albert"
        ],
        "weitereAutoren": 2,
        "jahr": 2000,
        "titel": "The Corsi Block-Tapping Task: Standardization and Normative Data",
        "zeitschrift": "Applied Neuropsychology",
        "band": "7",
        "seiten": "252-258",
        "url": "https://doi.org/10.1207/S15324826AN0704_8"
      }
    ]
  },
  {
    "key": "spatial",
    "label": "Was liegt wo?",
    "kategorie": "Raum & Formen",
    "domaenen": "Objekt-Orts-Gedächtnis, visuell-räumlich",
    "evidenztext": "Die Aufgabe entspricht strukturell der Objekt-Orts-Rekonstruktion, deren Teilprozesse Postma & De Haan getrennt haben (Postma u. a. 1996, *The Quarterly Journal of Experimental Psychology Section A* 49, 178-199, DOI [10.1080/713755605](https://doi.org/10.1080/713755605)): eine Positionskarte aufbauen und Objekte diesen Positionen zuordnen.",
    "belegt": true,
    "quellen": [
      {
        "doi": "10.1080/713755605",
        "autoren": [
          "Postma, Albert",
          "De Haan, Edward H.F."
        ],
        "weitereAutoren": 0,
        "jahr": 1996,
        "titel": "What Was Where? Memory for Object Locations",
        "zeitschrift": "The Quarterly Journal of Experimental Psychology Section A",
        "band": "49",
        "seiten": "178-199",
        "url": "https://doi.org/10.1080/713755605"
      }
    ]
  },
  {
    "key": "cpt",
    "label": "Aufmerksamkeit halten",
    "kategorie": "Tempo & Aufmerksamkeit",
    "domaenen": "Daueraufmerksamkeit, Reaktionshemmung",
    "evidenztext": "Die Übung greift eine Daueraufmerksamkeitsaufgabe auf, die in der Forschung als Continuous Performance Task bekannt ist: Über mehrere Blöcke ist auf ein Zielsignal zu reagieren und auf alles andere nicht. Eine Übersicht beschreibt die Aufgabe und ihre Anforderungen an Daueraufmerksamkeit und Reaktionshemmung (Riccio u. a. 2002, *Archives of Clinical Neuropsychology* 17, 235-272, DOI [10.1093/arclin/17.3.235](https://doi.org/10.1093/arclin/17.3.235)).",
    "belegt": true,
    "quellen": [
      {
        "doi": "10.1093/arclin/17.3.235",
        "autoren": [
          "Riccio, C. A.",
          "Reynolds, C. R.",
          "Lowe, P."
        ],
        "weitereAutoren": 1,
        "jahr": 2002,
        "titel": "The continuous performance test: a window on the neural substrates for attention?",
        "zeitschrift": "Archives of Clinical Neuropsychology",
        "band": "17",
        "seiten": "235-272",
        "url": "https://doi.org/10.1093/arclin/17.3.235"
      }
    ]
  },
  {
    "key": "schwarm",
    "label": "Schwarm im Blick",
    "kategorie": "Tempo & Aufmerksamkeit",
    "domaenen": "Dynamische geteilte Aufmerksamkeit, fortlaufende Objektidentität",
    "evidenztext": "Mehrere zunächst markierte, danach äußerlich gleiche Objekte bewegen sich unvorhersagbar; nach dem Stillstand sind die markierten wiederzuerkennen. Pylyshyn & Storm (1988) fanden, dass bis zu fünf Ziele unter zehn bewegten Objekten verfolgt werden können — mit einer Leistung, die eine serielle Sucherklärung übersteigt. Die Aufgabe lässt sich weder durch das Merken einer Position noch durch Absuchen lösen; die Identität muss über die Bewegung mitgeführt werden. Im Katalog schließt sie die einzige Lücke, die alle anderen Übungen offenlassen: kontinuierliche Bewegung über Raum und Zeit.",
    "belegt": true,
    "quellen": [
      {
        "doi": "10.1163/156856888X00122",
        "autoren": [
          "Pylyshyn, Zenon W.",
          "Storm, Ron W."
        ],
        "weitereAutoren": 0,
        "jahr": 1988,
        "titel": "Tracking multiple independent targets: Evidence for a parallel tracking mechanism*",
        "zeitschrift": "Spatial Vision",
        "band": "3",
        "seiten": "179-197",
        "url": "https://doi.org/10.1163/156856888X00122"
      }
    ]
  },
  {
    "key": "simon",
    "label": "Simon",
    "kategorie": null,
    "domaenen": null,
    "evidenztext": null,
    "belegt": false,
    "quellen": []
  },
  {
    "key": "rulefinder",
    "label": "Regel-Finder",
    "kategorie": "Denken & Steuern",
    "domaenen": "Induktives Schlussfolgern, Regelentdeckung, relationale Integration",
    "evidenztext": null,
    "belegt": false,
    "quellen": []
  },
  {
    "key": "prospect",
    "label": "Auftrag merken",
    "kategorie": "Merken & Lernen",
    "domaenen": "Prospektives Gedächtnis, intentionale Abrufkontrolle",
    "evidenztext": null,
    "belegt": false,
    "quellen": []
  },
  {
    "key": "pal",
    "label": "Bildpaare merken",
    "kategorie": "Merken & Lernen",
    "domaenen": "Visuell-episodisches und assoziatives Gedächtnis",
    "evidenztext": null,
    "belegt": false,
    "quellen": []
  },
  {
    "key": "digitspan",
    "label": "Zahlen merken",
    "kategorie": "Merken & Lernen",
    "domaenen": "Kurzzeitspanne (vorwärts), Arbeitsgedächtnis-Manipulation (rückwärts)",
    "evidenztext": null,
    "belegt": false,
    "quellen": []
  },
  {
    "key": "mirror",
    "label": "Spiegelbild",
    "kategorie": "Raum & Formen",
    "domaenen": "Visuell-räumliches Arbeitsgedächtnis, Spiegeltransformation",
    "evidenztext": null,
    "belegt": false,
    "quellen": []
  },
  {
    "key": "route",
    "label": "Wegfinder",
    "kategorie": "Raum & Formen",
    "domaenen": "Routensequenz, räumliches Behalten, Landmarkenbindung",
    "evidenztext": null,
    "belegt": false,
    "quellen": []
  },
  {
    "key": "ringscan",
    "label": "Rundblick",
    "kategorie": "Tempo & Aufmerksamkeit",
    "domaenen": "Visuelle Verarbeitungsgeschwindigkeit, geteilte Aufmerksamkeit, Winkelzuordnung",
    "evidenztext": null,
    "belegt": false,
    "quellen": []
  }
];
