// ACHTUNG: erzeugte Datei — nicht von Hand bearbeiten.
//
// Erzeugt aus dem Evidenzregister der Anwendung durch
//   node scripts/evidenz-uebernehmen.mjs
// Quelle: docs/evidenz/evidenz.json im Projekt Gedaechtniss-Training
// Stand des Registers: 2026-09-07
//
// Aenderungen gehoeren ins Register, nicht hierher.

export type Stufe = "MODERAT" | "SCHWACH" | "SCHWACH bis MODERAT" | "STARK";

/** Grundstufe fuer die farbliche Kennzeichnung — bei zusammengesetzten Stufen die erste. */
export function grundstufe(s: Stufe): 'STARK' | 'MODERAT' | 'SCHWACH' {
  const w = s.split(' ')[0];
  return w === 'STARK' || w === 'MODERAT' ? w : 'SCHWACH';
}

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

export interface EvidenzEinstufung {
  stufe: Stufe;
  einschraenkung: string | null;
}

export interface EvidenzSpiel {
  key: string;
  label: string;
  kategorie: string | null;
  domaenen: string | null;
  paradigma: EvidenzEinstufung | null;
  training: EvidenzEinstufung | null;
  evidenztext: string | null;
  quellenstatus: string;
  /** true, sobald das Register einen dokumentierten Beleg fuehrt. */
  belegt: boolean;
  quellen: EvidenzQuelle[];
}

/** Stand des uebernommenen Registers. */
export const EVIDENZ_STAND = "2026-09-07";

/**
 * Pflichthinweis. Das Register verlangt ausdruecklich, dass er auf einer
 * Seite wiederholt wird, die einzelne Uebungen oder Quellen gesondert
 * darstellt — ein Verweis auf das Register genuegt dort nicht.
 */
export const EVIDENZ_HINWEIS = "Diese Anwendung ist kein Medizinprodukt. Die hier aufgeführten Quellen belegen, auf welchem wissenschaftlichen Verfahren eine Übung beruht und wie gut die Trainingswirkung untersucht ist. Sie sind ausdrücklich kein Wirksamkeits- oder Gesundheitsversprechen und keine Aussage über den Gesundheitszustand einer Person. Krankheitsbezogene Endpunkte aus zitierter Grundlagenforschung begründen an keiner Stelle die Aufnahme einer Übung.";

export const EVIDENZ_ERKLAERUNG = {
  paradigma: "Wie gut ist das Messverfahren belegt, auf dem die Übung beruht?",
  training: "Wie gut ist belegt, dass Üben auf dieser Aufgabe etwas bringt — und worauf?",
};

export const EVIDENZ: EvidenzSpiel[] = [
  {
    "key": "oddout",
    "label": "Was passt nicht?",
    "kategorie": "Denken & Planen",
    "domaenen": "Semantisches Wissen, kategoriale Zuordnung",
    "paradigma": {
      "stufe": "STARK",
      "einschraenkung": null
    },
    "training": {
      "stufe": "SCHWACH",
      "einschraenkung": null
    },
    "evidenztext": "Semantische Kognition — Wissen nutzen, das über das Leben erworben wurde — ist ein eigenes System neben episodischem Merken; bildhafte Zuordnung operationalisiert es (Lambon Ralph u. a. 2017). Das Vier-Wahl-Zuordnungsformat mit Bildern stammt aus der Camel-and-Cactus-Prozedur (Bozeat u. a. 2000). Die Krankheitsstichproben dieser Arbeit begründen die Aufnahme in die Anwendung **nicht**; sie belegen nur, dass die Prozedur semantisches Wissen trifft und nicht bloß das Benennen. Über die Lebensspanne steigt verbales Wissen, während verarbeitungsintensive Maße sinken (Park u. a. 2002) — deshalb ist die Domäne im Katalog eine Lücke und keine Dopplung der Wortliste.\n\nZum Training: Semantischer Bestand ist kristallisiert. Üben macht auf denselben Karten schneller und sicherer; dass sich der Bestand oder andere Aufgaben dadurch verändern, ist nicht belegt.",
    "quellenstatus": "dokumentiert",
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
        "doi": "10.1016/s0028-3932(00)00034-8",
        "autoren": [
          "Bozeat, Sasha",
          "Lambon Ralph, Matthew A.",
          "Patterson, Karalyn"
        ],
        "weitereAutoren": 2,
        "jahr": 2000,
        "titel": "Non-verbal semantic impairment in semantic dementia",
        "zeitschrift": "Neuropsychologia",
        "band": "38",
        "seiten": "1207-1215",
        "url": "https://doi.org/10.1016/s0028-3932(00)00034-8"
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
    "paradigma": {
      "stufe": "STARK",
      "einschraenkung": null
    },
    "training": {
      "stufe": "SCHWACH bis MODERAT",
      "einschraenkung": "nur nah"
    },
    "evidenztext": "Die Aufgabe wurde als planungsbelastetes Umsetzproblem eingeführt (Shallice 1982). Ihre Schwierigkeit hängt nicht nur an der Zugzahl, sondern an Suchtiefe, Zielhierarchie und der Zahl optimaler Pfade; ein strukturell ausbalancierter Aufgabensatz hat brauchbare psychometrische Kennwerte (Kaller u. a. 2012). Turmaufgaben hängen mit anderen Maßen exekutiver Kontrolle zusammen, sind aber kein Synonym dafür (Sullivan u. a. 2009).\n\nZum Training: Prozessbasiertes Üben verbessert die geübte Aufgabe und nahe Aufgaben; ferne Effekte sind kleiner und umstritten (Karbach & Verhaeghen 2014). Konservativer und zum Rest des Katalogs passend sind Melby-Lervåg u. a. 2016 und Simons u. a. 2016 — große Übungseffekte, begrenzter Nahtransfer, kein belastbarer Ferntransfer. Für diese Umsetzung gibt es keine eigene Trainingsstudie; deshalb nicht STARK.",
    "quellenstatus": "dokumentiert",
    "belegt": true,
    "quellen": [
      {
        "doi": "10.1098/rstb.1982.0082",
        "autoren": [
          "Shallice, Timothy"
        ],
        "weitereAutoren": 0,
        "jahr": 1982,
        "titel": "Specific impairments of planning",
        "zeitschrift": "Philosophical Transactions of the Royal Society of London. B, Biological Sciences",
        "band": "298",
        "seiten": "199-209",
        "url": "https://doi.org/10.1098/rstb.1982.0082"
      },
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
      },
      {
        "doi": "10.1177/0956797614548725",
        "autoren": [
          "Karbach, Julia",
          "Verhaeghen, Paul"
        ],
        "weitereAutoren": 0,
        "jahr": 2014,
        "titel": "Making Working Memory Work: A Meta-Analysis of Executive-Control and Working Memory Training in Older Adults",
        "zeitschrift": "Psychological Science",
        "band": "25",
        "seiten": "2027-2037",
        "url": "https://doi.org/10.1177/0956797614548725"
      },
      {
        "doi": "10.1177/1745691616635612",
        "autoren": [
          "Melby-Lervåg, Monica",
          "Redick, Thomas S.",
          "Hulme, Charles"
        ],
        "weitereAutoren": 0,
        "jahr": 2016,
        "titel": "Working Memory Training Does Not Improve Performance on Measures of Intelligence or Other Measures of “Far Transfer”",
        "zeitschrift": "Perspectives on Psychological Science",
        "band": "11",
        "seiten": "512-534",
        "url": "https://doi.org/10.1177/1745691616635612"
      }
    ]
  },
  {
    "key": "stroop",
    "label": "Farb-Falle",
    "kategorie": "Denken & Steuern",
    "domaenen": "Inhibition, Interferenzkontrolle",
    "paradigma": {
      "stufe": "STARK",
      "einschraenkung": null
    },
    "training": {
      "stufe": "SCHWACH",
      "einschraenkung": null
    },
    "evidenztext": "Paradigma **STARK** — eines der am besten dokumentierten Inhibitionsverfahren (Diamond 2013, *Annual Review of Psychology* 64, 135–168, DOI [10.1146/annurev-psych-113011-143750](https://doi.org/10.1146/annurev-psych-113011-143750)). Training **SCHWACH**: Übung macht vor allem im Stroop selbst schneller; stabile, breite Exekutivverbesserung ist nicht belegt.",
    "quellenstatus": "dokumentiert",
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
    "paradigma": {
      "stufe": "STARK",
      "einschraenkung": null
    },
    "training": {
      "stufe": "MODERAT",
      "einschraenkung": "für nahe Updating-/Arbeitsgedächtnisaufgaben, SCHWACH für Ferntransfer"
    },
    "evidenztext": "Paradigma **STARK** (Conway et al. 2005, *Psychonomic Bulletin & Review* 12(5), 769–786, DOI [10.3758/BF03196772](https://doi.org/10.3758/BF03196772)). Training **MODERAT für nahe Updating-/Arbeitsgedächtnisaufgaben, SCHWACH für Ferntransfer**.",
    "quellenstatus": "dokumentiert",
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
    "key": "rulefinder",
    "label": "Regel-Finder",
    "kategorie": "Denken & Steuern",
    "domaenen": "Induktives Schlussfolgern, Regelentdeckung, relationale Integration",
    "paradigma": {
      "stufe": "STARK",
      "einschraenkung": null
    },
    "training": {
      "stufe": "STARK",
      "einschraenkung": "für die trainierte Domäne"
    },
    "evidenztext": "Paradigma **STARK** — Reihenaufgaben sind die etablierte Operationalisierung induktiven Schlussfolgerns; die im ACTIVE-Trial verwendeten Maße hatten Reliabilitäten von .84, .86 und .69 (Ball et al. 2002, *JAMA* 288(18), 2271–2281, DOI [10.1001/jama.288.18.2271](https://doi.org/10.1001/jama.288.18.2271)).",
    "quellenstatus": "dokumentiert",
    "belegt": true,
    "quellen": [
      {
        "doi": "10.1001/jama.288.18.2271",
        "autoren": [
          "Ball, Karlene",
          "Berch, Daniel B.",
          "Helmers, Karin F."
        ],
        "weitereAutoren": 10,
        "jahr": 2002,
        "titel": "Effects of Cognitive Training Interventions With Older Adults",
        "zeitschrift": "JAMA",
        "band": "288",
        "seiten": "2271",
        "url": "https://doi.org/10.1001/jama.288.18.2271"
      },
      {
        "doi": "10.1111/jgs.12607",
        "autoren": [
          "Rebok, George W.",
          "Ball, Karlene",
          "Guey, Lin T."
        ],
        "weitereAutoren": 8,
        "jahr": 2014,
        "titel": "Ten‐Year Effects of the Advanced Cognitive Training for Independent and Vital Elderly Cognitive Training Trial on Cognition and Everyday Functioning in Older Adults",
        "zeitschrift": "Journal of the American Geriatrics Society",
        "band": "62",
        "seiten": "16-24",
        "url": "https://doi.org/10.1111/jgs.12607"
      }
    ]
  },
  {
    "key": "nback",
    "label": "Rückblick-Spiel",
    "kategorie": "Denken & Steuern",
    "domaenen": "Arbeitsgedächtnis, Aktualisierung",
    "paradigma": {
      "stufe": "STARK",
      "einschraenkung": null
    },
    "training": {
      "stufe": "SCHWACH",
      "einschraenkung": "Zuwächse bleiben aufgabenspezifisch"
    },
    "evidenztext": "Paradigma **STARK** — die Aufgabe geht auf Kirchner (Kirchner 1958, *Journal of Experimental Psychology* 55, 352-358, DOI [10.1037/h0043688](https://doi.org/10.1037/h0043688)) zurück und ist als Verfahren zur Aktualisierung im Arbeitsgedächtnis etabliert. Als Einzelmaß der Arbeitsgedächtniskapazität ist ihre Konstruktvalidität allerdings begrenzt; sie korreliert nur schwach mit komplexen Spannenaufgaben (Kane u. a. 2007, *Journal of Experimental Psychology: Learning, Memory, and Cognition* 33, 615-622, DOI [10.1037/0278-7393.33.3.615](https://doi.org/10.1037/0278-7393.33.3.615)). Training **SCHWACH** — die Metaanalyse über 33 randomisierte Studien findet Zuwächse, die substanziell aufgabenspezifisch bleiben (Soveri u. a. 2017, *Psychonomic Bulletin & Review* 24, 1077-1096, DOI [10.3758/s13423-016-1217-0](https://doi.org/10.3758/s13423-016-1217-0)). Ein Transfer auf fluide Intelligenz oder Alltagsleistungen ist damit nicht belegt.",
    "quellenstatus": "dokumentiert",
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
      },
      {
        "doi": "10.3758/s13423-016-1217-0",
        "autoren": [
          "Soveri, Anna",
          "Antfolk, Jan",
          "Karlsson, Linda"
        ],
        "weitereAutoren": 2,
        "jahr": 2017,
        "titel": "Working memory training revisited: A multi-level meta-analysis of n-back training studies",
        "zeitschrift": "Psychonomic Bulletin & Review",
        "band": "24",
        "seiten": "1077-1096",
        "url": "https://doi.org/10.3758/s13423-016-1217-0"
      }
    ]
  },
  {
    "key": "switchtrail",
    "label": "Wechselpfad",
    "kategorie": "Denken & Steuern",
    "domaenen": "Set-Shifting, visuelle Suche, Verarbeitungsgeschwindigkeit",
    "paradigma": {
      "stufe": "STARK",
      "einschraenkung": null
    },
    "training": {
      "stufe": "SCHWACH bis MODERAT",
      "einschraenkung": "für nahe Wechselaufgaben"
    },
    "evidenztext": "Paradigma **STARK** (Bowie & Harvey 2006, *Nature Protocols* 1, 2277–2281, DOI [10.1038/nprot.2006.390](https://doi.org/10.1038/nprot.2006.390)). Training **SCHWACH bis MODERAT für nahe Wechselaufgaben**, kein solider Generalisierungsanspruch.",
    "quellenstatus": "dokumentiert",
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
    "key": "prospect",
    "label": "Auftrag merken",
    "kategorie": "Merken & Lernen",
    "domaenen": "Prospektives Gedächtnis, intentionale Abrufkontrolle",
    "paradigma": {
      "stufe": "MODERAT",
      "einschraenkung": null
    },
    "training": {
      "stufe": "MODERAT",
      "einschraenkung": "kurzfristig"
    },
    "evidenztext": "Paradigma **MODERAT**. Training **MODERAT kurzfristig**, Langzeiterhalt nicht signifikant (Tse et al. 2023, *Neuropsychology Review* 33, 391–416, DOI [10.1007/s11065-022-09536-5](https://doi.org/10.1007/s11065-022-09536-5)).",
    "quellenstatus": "dokumentiert",
    "belegt": true,
    "quellen": [
      {
        "doi": "10.1007/s11065-022-09536-5",
        "autoren": [
          "Tse, Zita C. K.",
          "Cao, Yuan",
          "Ogilvie, James M."
        ],
        "weitereAutoren": 3,
        "jahr": 2022,
        "titel": "Prospective Memory Training in Older Adults: A Systematic Review and Meta-Analysis",
        "zeitschrift": "Neuropsychology Review",
        "band": "33",
        "seiten": "347-372",
        "url": "https://doi.org/10.1007/s11065-022-09536-5"
      },
      {
        "doi": "10.1080/13803395.2012.666230",
        "autoren": [
          "Amariglio, Rebecca E.",
          "Frishe, Katherine",
          "Olson, Lauren E."
        ],
        "weitereAutoren": 4,
        "jahr": 2012,
        "titel": "Validation of the Face Name Associative Memory Exam in cognitively normal older individuals",
        "zeitschrift": "Journal of Clinical and Experimental Neuropsychology",
        "band": "34",
        "seiten": "580-587",
        "url": "https://doi.org/10.1080/13803395.2012.666230"
      },
      {
        "doi": "10.1080/13825585.2017.1366971",
        "autoren": [
          "Pike, Kerryn Elizabeth",
          "Ong, Ben",
          "Clare, Linda"
        ],
        "weitereAutoren": 1,
        "jahr": 2017,
        "titel": "Face-name memory training in subjective memory decline: how does office-based training translate to everyday situations?",
        "zeitschrift": "Aging, Neuropsychology, and Cognition",
        "band": "25",
        "seiten": "724-752",
        "url": "https://doi.org/10.1080/13825585.2017.1366971"
      },
      {
        "doi": "10.1177/2331216518792096",
        "autoren": [
          "Lawrence, Blake J.",
          "Jayakody, Dona M. P.",
          "Henshaw, Helen"
        ],
        "weitereAutoren": 4,
        "jahr": 2018,
        "titel": "Auditory and Cognitive Training for Cognition in Adults With Hearing Loss: A Systematic Review and Meta-Analysis",
        "zeitschrift": "Trends in Hearing",
        "band": "22",
        "seiten": null,
        "url": "https://doi.org/10.1177/2331216518792096"
      },
      {
        "doi": "10.1121/1.412282",
        "autoren": [
          "Pichora-Fuller, M. Kathleen",
          "Schneider, Bruce A.",
          "Daneman, Meredyth"
        ],
        "weitereAutoren": 0,
        "jahr": 1995,
        "titel": "How young and old adults listen to and remember speech in noise",
        "zeitschrift": "The Journal of the Acoustical Society of America",
        "band": "97",
        "seiten": "593-608",
        "url": "https://doi.org/10.1121/1.412282"
      }
    ]
  },
  {
    "key": "pal",
    "label": "Bildpaare merken",
    "kategorie": "Merken & Lernen",
    "domaenen": "Visuell-episodisches und assoziatives Gedächtnis",
    "paradigma": {
      "stufe": "STARK",
      "einschraenkung": null
    },
    "training": {
      "stufe": "SCHWACH",
      "einschraenkung": null
    },
    "evidenztext": "Paradigma **STARK** (Barnett et al. 2016, *Current Topics in Behavioral Neurosciences* 28, 449–474, DOI [10.1007/7854_2015_5001](https://doi.org/10.1007/7854_2015_5001)). Training **SCHWACH** — breiter kognitiver Transfer ist nicht belegt.",
    "quellenstatus": "dokumentiert",
    "belegt": true,
    "quellen": [
      {
        "doi": "10.1007/7854_2015_5001",
        "autoren": [
          "Barnett, Jennifer H.",
          "Blackwell, Andrew D.",
          "Sahakian, Barbara J."
        ],
        "weitereAutoren": 1,
        "jahr": 2015,
        "titel": "The Paired Associates Learning (PAL) Test: 30 Years of CANTAB Translational Neuroscience from Laboratory to Bedside in Dementia Research",
        "zeitschrift": "Current Topics in Behavioral Neurosciences",
        "band": null,
        "seiten": "449-474",
        "url": "https://doi.org/10.1007/7854_2015_5001"
      }
    ]
  },
  {
    "key": "figure",
    "label": "Figur aus dem Gedächtnis",
    "kategorie": "Merken & Lernen",
    "domaenen": "Visuelle episodische Erinnerung, visuell-konstruktive Reproduktion",
    "paradigma": {
      "stufe": "STARK",
      "einschraenkung": null
    },
    "training": {
      "stufe": "SCHWACH",
      "einschraenkung": null
    },
    "evidenztext": "Paradigma **STARK** — visuell-konstruktive Reproduktion ist ein etabliertes Verfahren. Training **SCHWACH**: der Nutzenanspruch muss auf diese Aufgabe beschränkt bleiben. Digitalisierte Arbeiten zeigen gerade, dass Endprodukt, Organisation und **Motorik getrennte Dimensionen** sind (Petilli et al. 2021, *Scientific Reports* 11, 14895, DOI [10.1038/s41598-021-94247-9](https://doi.org/10.1038/s41598-021-94247-9)) — ein bloßer Freihand-Ähnlichkeitsscore wäre daher irreführend.",
    "quellenstatus": "dokumentiert",
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
    "paradigma": {
      "stufe": "MODERAT",
      "einschraenkung": "Zufalls- und Strategieeinflüsse"
    },
    "training": {
      "stufe": "SCHWACH",
      "einschraenkung": null
    },
    "evidenztext": "Paradigma **MODERAT, Zufalls- und Strategieeinflüsse** — das Aufdeckspiel ist als Aufgabe eigens untersucht worden, sowohl zur Gedächtnisleistung (Schumann-Hengsteler 1996, *The Journal of Genetic Psychology* 157, 77-92, DOI [10.1080/00221325.1996.9914847](https://doi.org/10.1080/00221325.1996.9914847)) als auch zum Strategieeinsatz beim Aufdecken (Baker-Ward u. a. 1988, *Bulletin of the Psychonomic Society* 26, 331-332, DOI [10.3758/bf03337672](https://doi.org/10.3758/bf03337672)). Als Messverfahren ist es weniger scharf als ein normierter Test: Ergebnis und Strategie hängen erheblich vom Zufall der Aufdeckreihenfolge ab. Training **SCHWACH** — für einen Transfer über die geübte Aufgabe hinaus gibt es keinen tragfähigen Beleg; die umfassende Übersicht zu Programmen des Gehirntrainings kommt zu einem durchweg zurückhaltenden Urteil (Simons u. a. 2016, *Psychological Science in the Public Interest* 17, 103-186, DOI [10.1177/1529100616661983](https://doi.org/10.1177/1529100616661983)).",
    "quellenstatus": "dokumentiert",
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
      },
      {
        "doi": "10.1177/1529100616661983",
        "autoren": [
          "Simons, Daniel J.",
          "Boot, Walter R.",
          "Charness, Neil"
        ],
        "weitereAutoren": 4,
        "jahr": 2016,
        "titel": "Do “Brain-Training” Programs Work?",
        "zeitschrift": "Psychological Science in the Public Interest",
        "band": "17",
        "seiten": "103-186",
        "url": "https://doi.org/10.1177/1529100616661983"
      }
    ]
  },
  {
    "key": "recog",
    "label": "Schon gesehen?",
    "kategorie": "Merken & Lernen",
    "domaenen": "Episodisches Wiedererkennen, Entscheidungskriterium",
    "paradigma": {
      "stufe": "STARK",
      "einschraenkung": null
    },
    "training": {
      "stufe": "SCHWACH",
      "einschraenkung": null
    },
    "evidenztext": "Ja/Nein-Wiedererkennen mit getrennter Diskrimination und Kriterium ist das Standardmaß; d′ und C — nicht β — sind die unabhängigen Indizes (Snodgrass & Corwin 1988). Wiedererkennen ist nicht dasselbe wie freies Erinnern: Vertrautheit und bewusste Erinnerung tragen unterschiedlich bei (Yonelinas 2002). Bei älteren Erwachsenen ist der Abstand zwischen Abruf und Wiedererkennen größer als bei jüngeren (Craik & McDowd 1987) — deshalb wäre ein Katalog, der nur freien Abruf enthält, in der Abrufdimension einseitig. Die Krankheitsbeispiele bei Snodgrass & Corwin begründen die Aufnahme **nicht**.\n\nZum Training: Wiederholte Ja/Nein-Listen verbessern diese Listen. Strategietraining zielt in der Regel auf Abrufhilfen beim freien Erinnern, nicht auf die Diskrimination im Wiedererkennen. Kein belastbarer Ferntransfer.",
    "quellenstatus": "dokumentiert",
    "belegt": true,
    "quellen": [
      {
        "doi": "10.1037/0096-3445.117.1.34",
        "autoren": [
          "Snodgrass, Joan G.",
          "Corwin, June"
        ],
        "weitereAutoren": 0,
        "jahr": 1988,
        "titel": "Pragmatics of measuring recognition memory: Applications to dementia and amnesia.",
        "zeitschrift": "Journal of Experimental Psychology: General",
        "band": "117",
        "seiten": "34-50",
        "url": "https://doi.org/10.1037/0096-3445.117.1.34"
      },
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
    "paradigma": {
      "stufe": "MODERAT",
      "einschraenkung": null
    },
    "training": {
      "stufe": "SCHWACH",
      "einschraenkung": null
    },
    "evidenztext": "Urteile über die relative Aktualität zweier Items sind ein etabliertes experimentelles Verfahren für zeitliche Ordnung im Kurzzeitgedächtnis; ältere Erwachsene sind darin weniger treffsicher und langsamer (Kılıç u. a. 2017; Crossref führt die Arbeit mit dem Online-Jahr 2016). Item, Ort und Zeitpunkt sind trennbar, und das Binden von Merkmalen ist bei Älteren stärker betroffen als das Item allein (Kessels u. a. 2007). Es gibt **kein** so standardisiertes Einzelverfahren wie Corsi oder die Zahlenspanne; deshalb MODERAT und nicht STARK. Keine Alltags- oder Krankheitsbegründung.\n\nZum Training: Es gibt keine belastbare Literatur, dass das Üben solcher Urteile etwas anderes verbessert als eben diese Urteile.",
    "quellenstatus": "dokumentiert",
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
    "paradigma": {
      "stufe": "STARK",
      "einschraenkung": "Darbietung weicht von der Normierung ab"
    },
    "training": {
      "stufe": "SCHWACH",
      "einschraenkung": null
    },
    "evidenztext": "Paradigma **STARK, Darbietung weicht von der Normierung ab** — das Lernen und freie Wiedergeben einer Wortliste geht auf Rey zurück (Rey 1958, Presses Universitaires de France — ohne DOI, nicht maschinell prüfbar) und liegt im deutschsprachigen Raum als normierter Verbaler Lern- und Merkfähigkeitstest vor (Lux u. a. 1999, *Diagnostica* 45, 205-211, DOI [10.1026//0012-1924.45.4.205](https://doi.org/10.1026//0012-1924.45.4.205)). Diese Übung gibt die Wörter allerdings schriftlich vor und nimmt die Antwort getippt entgegen, während die Normwerte auf mündlicher Darbietung und mündlicher Wiedergabe beruhen — die Ergebnisse hier sind daher nicht mit Normwerten vergleichbar. Training **SCHWACH** — für einen Transfer über die geübte Aufgabe hinaus liegt kein tragfähiger Beleg vor (Simons u. a. 2016, *Psychological Science in the Public Interest* 17, 103-186, DOI [10.1177/1529100616661983](https://doi.org/10.1177/1529100616661983)).",
    "quellenstatus": "dokumentiert",
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
      },
      {
        "doi": "10.1177/1529100616661983",
        "autoren": [
          "Simons, Daniel J.",
          "Boot, Walter R.",
          "Charness, Neil"
        ],
        "weitereAutoren": 4,
        "jahr": 2016,
        "titel": "Do “Brain-Training” Programs Work?",
        "zeitschrift": "Psychological Science in the Public Interest",
        "band": "17",
        "seiten": "103-186",
        "url": "https://doi.org/10.1177/1529100616661983"
      }
    ]
  },
  {
    "key": "digitspan",
    "label": "Zahlen merken",
    "kategorie": "Merken & Lernen",
    "domaenen": "Kurzzeitspanne (vorwärts), Arbeitsgedächtnis-Manipulation (rückwärts)",
    "paradigma": {
      "stufe": "STARK",
      "einschraenkung": null
    },
    "training": {
      "stufe": "MODERAT",
      "einschraenkung": "für nahe Aufgaben"
    },
    "evidenztext": "Paradigma **STARK** — standardisierte Spannenaufgaben sind Kernbestandteil etablierter Testbatterien. Die visuelle statt auditiven Darbietung macht die App-Variante **nicht** normwertvergleichbar. Training **MODERAT für nahe Aufgaben** (Pappa et al. 2020, *Neuroscience & Biobehavioral Reviews* 118, 209–235, DOI [10.1016/j.neubiorev.2020.07.027](https://doi.org/10.1016/j.neubiorev.2020.07.027)) — große Trainingseffekte, moderater Near-Transfer, kein signifikanter Far-Transfer.",
    "quellenstatus": "dokumentiert",
    "belegt": true,
    "quellen": [
      {
        "doi": "10.1016/j.neubiorev.2020.07.027",
        "autoren": [
          "Pappa, Katerina",
          "Biswas, Viveka",
          "Flegal, Kristin E."
        ],
        "weitereAutoren": 2,
        "jahr": 2020,
        "titel": "Working memory updating training promotes plasticity & behavioural gains: A systematic review & meta-analysis",
        "zeitschrift": "Neuroscience & Biobehavioral Reviews",
        "band": "118",
        "seiten": "209-235",
        "url": "https://doi.org/10.1016/j.neubiorev.2020.07.027"
      }
    ]
  },
  {
    "key": "rotate",
    "label": "Drehen im Kopf",
    "kategorie": "Raum & Formen",
    "domaenen": "Mentale Rotation, räumliche Transformation",
    "paradigma": {
      "stufe": "STARK",
      "einschraenkung": null
    },
    "training": {
      "stufe": "STARK",
      "einschraenkung": "für räumlichen Near- und Related-Transfer"
    },
    "evidenztext": "Paradigma **STARK** — Shepard & Metzler 1971, *Science* 171(3972), 701–703, DOI [10.1126/science.171.3972.701](https://doi.org/10.1126/science.171.3972.701).",
    "quellenstatus": "dokumentiert",
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
      },
      {
        "doi": "10.1037/a0028446",
        "autoren": [
          "Uttal, David H.",
          "Meadow, Nathaniel G.",
          "Tipton, Elizabeth"
        ],
        "weitereAutoren": 4,
        "jahr": 2013,
        "titel": "The malleability of spatial skills: A meta-analysis of training studies.",
        "zeitschrift": "Psychological Bulletin",
        "band": "139",
        "seiten": "352-402",
        "url": "https://doi.org/10.1037/a0028446"
      },
      {
        "doi": "10.1007/s00426-016-0749-2",
        "autoren": [
          "Meneghetti, Chiara",
          "Cardillo, Ramona",
          "Mammarella, Irene C."
        ],
        "weitereAutoren": 2,
        "jahr": 2016,
        "titel": "The role of practice and strategy in mental rotation training: transfer and maintenance effects",
        "zeitschrift": "Psychological Research",
        "band": "81",
        "seiten": "415-431",
        "url": "https://doi.org/10.1007/s00426-016-0749-2"
      }
    ]
  },
  {
    "key": "pattern",
    "label": "Muster",
    "kategorie": "Raum & Formen",
    "domaenen": "Visuelles Kurzzeitgedächtnis",
    "paradigma": {
      "stufe": "STARK",
      "einschraenkung": null
    },
    "training": {
      "stufe": "SCHWACH",
      "einschraenkung": null
    },
    "evidenztext": "Paradigma **STARK** — der Visual Patterns Test wurde eigens entwickelt, um visuelles Mustergedächtnis vom sequenziell-räumlichen Corsi-Konstrukt zu trennen, und bringt eigene Kennwerte mit (Della Sala u. a. 1999, *Neuropsychologia* 37, 1189-1199, DOI [10.1016/s0028-3932(98)00159-6](https://doi.org/10.1016/s0028-3932(98)00159-6)). Das Raster dieser Übung entspricht ihm strukturell. Training **SCHWACH** — Metaanalysen zum Arbeitsgedächtnistraining (Melby-Lervåg u. a. 2013, *Developmental Psychology* 49, 270-291, DOI [10.1037/a0028228](https://doi.org/10.1037/a0028228)) und eine Übersicht zum Transfer kognitiven Trainings (Sala u. a. 2019, *Trends in Cognitive Sciences* 23, 9-20, DOI [10.1016/j.tics.2018.10.004](https://doi.org/10.1016/j.tics.2018.10.004)) finden keinen belastbaren Transfer über die geübte Aufgabe hinaus.",
    "quellenstatus": "dokumentiert",
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
      },
      {
        "doi": "10.1037/a0028228",
        "autoren": [
          "Melby-Lervåg, Monica",
          "Hulme, Charles"
        ],
        "weitereAutoren": 0,
        "jahr": 2013,
        "titel": "Is working memory training effective? A meta-analytic review.",
        "zeitschrift": "Developmental Psychology",
        "band": "49",
        "seiten": "270-291",
        "url": "https://doi.org/10.1037/a0028228"
      },
      {
        "doi": "10.1016/j.tics.2018.10.004",
        "autoren": [
          "Sala, Giovanni",
          "Gobet, Fernand"
        ],
        "weitereAutoren": 0,
        "jahr": 2019,
        "titel": "Cognitive Training Does Not Enhance General Cognition",
        "zeitschrift": "Trends in Cognitive Sciences",
        "band": "23",
        "seiten": "9-20",
        "url": "https://doi.org/10.1016/j.tics.2018.10.004"
      }
    ]
  },
  {
    "key": "corsirev",
    "label": "Rückwärts-Muster",
    "kategorie": "Raum & Formen",
    "domaenen": "Arbeitsgedächtnis, visuell-räumlich",
    "paradigma": {
      "stufe": "STARK",
      "einschraenkung": null
    },
    "training": {
      "stufe": "MODERAT",
      "einschraenkung": "für nahe Aufgaben"
    },
    "evidenztext": "Paradigma **STARK** — Corsi ist ein normiertes Standardverfahren für die visuell-räumliche Spanne (Kessels et al. 2000, *Applied Neuropsychology* 7(4), 252–258, DOI [10.1207/S15324826AN0704_8](https://doi.org/10.1207/S15324826AN0704_8)). Training **MODERAT für nahe Aufgaben**, kein Ferntransfer (Melby-Lervåg, Redick & Hulme 2016, *Perspectives on Psychological Science*, DOI [10.1177/1745691616635612](https://doi.org/10.1177/1745691616635612)).",
    "quellenstatus": "dokumentiert",
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
      },
      {
        "doi": "10.1177/1745691616635612",
        "autoren": [
          "Melby-Lervåg, Monica",
          "Redick, Thomas S.",
          "Hulme, Charles"
        ],
        "weitereAutoren": 0,
        "jahr": 2016,
        "titel": "Working Memory Training Does Not Improve Performance on Measures of Intelligence or Other Measures of “Far Transfer”",
        "zeitschrift": "Perspectives on Psychological Science",
        "band": "11",
        "seiten": "512-534",
        "url": "https://doi.org/10.1177/1745691616635612"
      }
    ]
  },
  {
    "key": "mirror",
    "label": "Spiegelbild",
    "kategorie": "Raum & Formen",
    "domaenen": "Visuell-räumliches Arbeitsgedächtnis, Spiegeltransformation",
    "paradigma": {
      "stufe": "MODERAT",
      "einschraenkung": null
    },
    "training": {
      "stufe": "MODERAT",
      "einschraenkung": "für verwandte räumliche Aufgaben"
    },
    "evidenztext": "Paradigma **MODERAT** — Spiegelung ist eine anerkannte räumliche Transformation, aber weniger standardisiert als mentale Rotation. Training **MODERAT für verwandte räumliche Aufgaben**, gestützt auf die breite Meta-Analyse zu räumlichem Training (Uttal et al. 2013, s. `rotate`). Eine eigenständige Evidenzbasis speziell für diese Spielvariante liegt **nicht** vor.",
    "quellenstatus": "dokumentiert, Einstufung von Drehen im Kopf übernommen",
    "belegt": true,
    "quellen": [
      {
        "doi": "10.1037/a0028446",
        "autoren": [
          "Uttal, David H.",
          "Meadow, Nathaniel G.",
          "Tipton, Elizabeth"
        ],
        "weitereAutoren": 4,
        "jahr": 2013,
        "titel": "The malleability of spatial skills: A meta-analysis of training studies.",
        "zeitschrift": "Psychological Bulletin",
        "band": "139",
        "seiten": "352-402",
        "url": "https://doi.org/10.1037/a0028446"
      }
    ]
  },
  {
    "key": "spatial",
    "label": "Was liegt wo?",
    "kategorie": "Raum & Formen",
    "domaenen": "Objekt-Orts-Gedächtnis, visuell-räumlich",
    "paradigma": {
      "stufe": "MODERAT",
      "einschraenkung": "kein normiertes Einzelverfahren"
    },
    "training": {
      "stufe": "SCHWACH",
      "einschraenkung": null
    },
    "evidenztext": "Paradigma **MODERAT, kein normiertes Einzelverfahren** — die Aufgabe entspricht strukturell der Objekt-Orts-Rekonstruktion, deren Teilprozesse Postma & De Haan (Postma u. a. 1996, *The Quarterly Journal of Experimental Psychology Section A* 49, 178-199, DOI [10.1080/713755605](https://doi.org/10.1080/713755605)) getrennt haben: eine Positionskarte aufbauen und Objekte diesen Positionen zuordnen. Anders als bei Corsi oder der Zahlenspanne liegt dafür jedoch kein normiertes Instrument mit Kennwerten vor — deshalb MODERAT und nicht STARK. Training **SCHWACH** — eine Studie zum prozessbasierten Training des Objekt-Orts-Gedächtnisses bei älteren Erwachsenen (Zimmermann u. a. 2016, *Psychology and Aging* 31, 798-814, DOI [10.1037/pag0000123](https://doi.org/10.1037/pag0000123)) findet begrenzten Transfer; ein Ferntransfer ist nach der einschlägigen Metaanalyse nicht belegt (Melby-Lervåg u. a. 2016, *Perspectives on Psychological Science* 11, 512-534, DOI [10.1177/1745691616635612](https://doi.org/10.1177/1745691616635612)).",
    "quellenstatus": "dokumentiert",
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
      },
      {
        "doi": "10.1037/pag0000123",
        "autoren": [
          "Zimmermann, Kathrin",
          "von Bastian, Claudia C.",
          "Röcke, Christina"
        ],
        "weitereAutoren": 2,
        "jahr": 2016,
        "titel": "Transfer after process-based object-location memory training in healthy older adults.",
        "zeitschrift": "Psychology and Aging",
        "band": "31",
        "seiten": "798-814",
        "url": "https://doi.org/10.1037/pag0000123"
      },
      {
        "doi": "10.1177/1745691616635612",
        "autoren": [
          "Melby-Lervåg, Monica",
          "Redick, Thomas S.",
          "Hulme, Charles"
        ],
        "weitereAutoren": 0,
        "jahr": 2016,
        "titel": "Working Memory Training Does Not Improve Performance on Measures of Intelligence or Other Measures of “Far Transfer”",
        "zeitschrift": "Perspectives on Psychological Science",
        "band": "11",
        "seiten": "512-534",
        "url": "https://doi.org/10.1177/1745691616635612"
      }
    ]
  },
  {
    "key": "route",
    "label": "Wegfinder",
    "kategorie": "Raum & Formen",
    "domaenen": "Routensequenz, räumliches Behalten, Landmarkenbindung",
    "paradigma": {
      "stufe": "MODERAT",
      "einschraenkung": null
    },
    "training": {
      "stufe": "MODERAT",
      "einschraenkung": "überwiegend domänennah"
    },
    "evidenztext": "Paradigma **MODERAT** (Hötting et al. 2013, *BMC Neuroscience* 14, 73, DOI [10.1186/1471-2202-14-73](https://doi.org/10.1186/1471-2202-14-73)) — virtuelle Labyrinthe sind als Aufgaben für räumliches Lernen etabliert, aber eine kleine 2D-Karte bildet nicht reales Wegfinden ab. Training **MODERAT, überwiegend domänennah** (Lövdén et al. 2012, *Neurobiology of Aging* 33(3), 620.e9–620.e22, DOI [10.1016/j.neurobiolaging.2011.02.013](https://doi.org/10.1016/j.neurobiolaging.2011.02.013)) — Leistungsgewinne auf Navigation; Hötting et al. fanden nur begrenzten Nahtransfer und **keine** Verbesserung für verbales Lernen oder Exekutivfunktionen.",
    "quellenstatus": "dokumentiert",
    "belegt": true,
    "quellen": [
      {
        "doi": "10.1186/1471-2202-14-73",
        "autoren": [
          "Hötting, Kirsten",
          "Holzschneider, Kathrin",
          "Stenzel, Anna"
        ],
        "weitereAutoren": 2,
        "jahr": 2013,
        "titel": "Effects of a cognitive training on spatial learning and associated functional brain activations",
        "zeitschrift": "BMC Neuroscience",
        "band": "14",
        "seiten": null,
        "url": "https://doi.org/10.1186/1471-2202-14-73"
      },
      {
        "doi": "10.1016/j.neurobiolaging.2011.02.013",
        "autoren": [
          "Lövdén, Martin",
          "Schaefer, Sabine",
          "Noack, Hannes"
        ],
        "weitereAutoren": 6,
        "jahr": 2012,
        "titel": "Spatial navigation training protects the hippocampus against age-related changes during early and late adulthood",
        "zeitschrift": "Neurobiology of Aging",
        "band": "33",
        "seiten": "620.e9-620.e22",
        "url": "https://doi.org/10.1016/j.neurobiolaging.2011.02.013"
      }
    ]
  },
  {
    "key": "cpt",
    "label": "Aufmerksamkeit halten",
    "kategorie": "Tempo & Aufmerksamkeit",
    "domaenen": "Daueraufmerksamkeit, Reaktionshemmung",
    "paradigma": {
      "stufe": "STARK",
      "einschraenkung": null
    },
    "training": {
      "stufe": "SCHWACH",
      "einschraenkung": "nur aufgabennah"
    },
    "evidenztext": "Paradigma **STARK** — der Continuous Performance Test wurde von Rosvold u. a. (Rosvold u. a. 1956, *Journal of Consulting Psychology* 20, 343-350, DOI [10.1037/h0043220](https://doi.org/10.1037/h0043220)) eingeführt und ist als Verfahren für Daueraufmerksamkeit und Reaktionshemmung gut untersucht; eine Übersicht fasst die psychometrischen Kennwerte zusammen (Riccio u. a. 2002, *Archives of Clinical Neuropsychology* 17, 235-272, DOI [10.1093/arclin/17.3.235](https://doi.org/10.1093/arclin/17.3.235)). Training **SCHWACH nur aufgabennah** — die herangezogene Metaanalyse zu kognitivem Training (Cortese u. a. 2015, *Journal of the American Academy of Child & Adolescent Psychiatry* 54, 164-174, DOI [10.1016/j.jaac.2014.12.010](https://doi.org/10.1016/j.jaac.2014.12.010)) findet, dass Symptomverbesserungen bei verblindeter Erhebung nicht mehr nachweisbar sind. Die Arbeit stammt aus einer klinischen Stichprobe (Kinder und Jugendliche mit ADHS); der Krankheitsbezug begründet die Aufnahme dieser Übung an keiner Stelle und wird hier ausschließlich als Beleg gegen einen Ferntransfer geführt.",
    "quellenstatus": "dokumentiert",
    "belegt": true,
    "quellen": [
      {
        "doi": "10.1037/h0043220",
        "autoren": [
          "Rosvold, H. Enger",
          "Mirsky, Allan F.",
          "Sarason, Irwin"
        ],
        "weitereAutoren": 2,
        "jahr": 1956,
        "titel": "A continuous performance test of brain damage.",
        "zeitschrift": "Journal of Consulting Psychology",
        "band": "20",
        "seiten": "343-350",
        "url": "https://doi.org/10.1037/h0043220"
      },
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
      },
      {
        "doi": "10.1016/j.jaac.2014.12.010",
        "autoren": [
          "Cortese, Samuele",
          "Ferrin, Maite",
          "Brandeis, Daniel"
        ],
        "weitereAutoren": 9,
        "jahr": 2015,
        "titel": "Cognitive Training for Attention-Deficit/Hyperactivity Disorder: Meta-Analysis of Clinical and Neuropsychological Outcomes From Randomized Controlled Trials",
        "zeitschrift": "Journal of the American Academy of Child & Adolescent Psychiatry",
        "band": "54",
        "seiten": "164-174",
        "url": "https://doi.org/10.1016/j.jaac.2014.12.010"
      }
    ]
  },
  {
    "key": "ringscan",
    "label": "Rundblick",
    "kategorie": "Tempo & Aufmerksamkeit",
    "domaenen": "Visuelle Verarbeitungsgeschwindigkeit, geteilte Aufmerksamkeit, Winkelzuordnung",
    "paradigma": {
      "stufe": "MODERAT",
      "einschraenkung": null
    },
    "training": {
      "stufe": "MODERAT",
      "einschraenkung": null
    },
    "evidenztext": "Verarbeitungstempo mit geteilter Aufmerksamkeit ist ein etabliertes Verfahren, und die Trainingslage dazu ist untersucht. Rundblick setzt es mit einer Ringantwort um: die Position wird auf einem Ring statt in einem Raster angetippt. Eine eigene Studie zu genau dieser Antwortform gibt es nicht; die Einstufung stützt sich auf die Arbeit zum Verfahren selbst und ist insoweit übertragen, nicht eigenständig belegt. Krankheitsbezogene Endpunkte begründen die Aufnahme nicht.",
    "quellenstatus": "dokumentiert, Einstufung vom Verfahren übernommen",
    "belegt": true,
    "quellen": [
      {
        "doi": "10.1002/trc2.70197",
        "autoren": [
          "Coe, Norma B.",
          "Miller, Katherine E. M.",
          "Sun, Chuxuan"
        ],
        "weitereAutoren": 9,
        "jahr": 2026,
        "titel": "Impact of cognitive training on claims‐based diagnosed dementia over 20 years: evidence from the ACTIVE study",
        "zeitschrift": "Alzheimer's & Dementia: Translational Research & Clinical Interventions",
        "band": "12",
        "seiten": null,
        "url": "https://doi.org/10.1002/trc2.70197"
      }
    ]
  },
  {
    "key": "schwarm",
    "label": "Schwarm im Blick",
    "kategorie": "Tempo & Aufmerksamkeit",
    "domaenen": "Dynamische geteilte Aufmerksamkeit, fortlaufende Objektidentität",
    "paradigma": {
      "stufe": "STARK",
      "einschraenkung": null
    },
    "training": {
      "stufe": "SCHWACH bis MODERAT",
      "einschraenkung": "nur aufgabennah und unsicher"
    },
    "evidenztext": "Mehrere zunächst markierte, danach äußerlich gleiche Objekte bewegen sich unvorhersagbar; nach dem Stillstand sind die markierten wiederzuerkennen. Pylyshyn & Storm (1988) fanden, dass bis zu fünf Ziele unter zehn bewegten Objekten verfolgt werden können — mit einer Leistung, die eine serielle Sucherklärung übersteigt. Die Aufgabe lässt sich weder durch das Merken einer Position noch durch Absuchen lösen; die Identität muss über die Bewegung mitgeführt werden. Im Katalog schließt sie die einzige Lücke, die alle anderen Übungen offenlassen: kontinuierliche Bewegung über Raum und Zeit.\n\nZum Training: Es gibt Arbeiten zu Übungseffekten bei diesem Verfahren, auch mit älteren Erwachsenen. Sie tragen jedoch **ausdrücklich nur aufgabennah und unsicher** — eine kritische Übersicht zu dreidimensionalem Verfolgen findet schwache und methodisch eingeschränkte Transferbelege. Keine Alltags- oder Krankheitsbegründung.",
    "quellenstatus": "dokumentiert",
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
      },
      {
        "doi": "10.1097/WNR.0b013e328353e48a",
        "autoren": [
          "Legault, Isabelle",
          "Faubert, Jocelyn"
        ],
        "weitereAutoren": 0,
        "jahr": 2012,
        "titel": "Perceptual-cognitive training improves biological motion perception",
        "zeitschrift": "NeuroReport",
        "band": "23",
        "seiten": "469-473",
        "url": "https://doi.org/10.1097/WNR.0b013e328353e48a"
      },
      {
        "doi": "10.3389/fpsyg.2013.00323",
        "autoren": [
          "Legault, Isabelle",
          "Allard, Rémy",
          "Faubert, Jocelyn"
        ],
        "weitereAutoren": 0,
        "jahr": 2013,
        "titel": "Healthy Older Observers Show Equivalent Perceptual-Cognitive Training Benefits to Young Adults for Multiple Object Tracking",
        "zeitschrift": "Frontiers in Psychology",
        "band": "4",
        "seiten": null,
        "url": "https://doi.org/10.3389/fpsyg.2013.00323"
      }
    ]
  },
  {
    "key": "simon",
    "label": "Simon",
    "kategorie": null,
    "domaenen": null,
    "paradigma": null,
    "training": null,
    "evidenztext": null,
    "quellenstatus": "kein dokumentierter Beleg",
    "belegt": false,
    "quellen": []
  }
];
