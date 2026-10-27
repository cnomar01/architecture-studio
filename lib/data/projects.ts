const emptyText = { en: "", ar: "", it: "" };

export const cityEdgeSections = [
  {
    id: "concept",
    eyebrow: emptyText,
    title: { en: "Concept", ar: "الفكرة التصميمية", it: "Concept" },
    body: {
      en: "Conceived as a vertical mixed-use destination, City Edge brings public, professional, clinical and residential life together within one clear architectural identity. The composition balances a grounded commercial base with lighter residential levels above.",
      ar: "صُمم سيتي إيدج كوجهة رأسية متعددة الاستخدامات تجمع الحياة العامة والعمل والخدمات الطبية والسكن داخل هوية معمارية واحدة وواضحة. يوازن التكوين بين قاعدة تجارية راسخة وطوابق سكنية أكثر خفة في الأعلى.",
      it: "City Edge è concepito come una destinazione verticale polifunzionale, capace di riunire vita pubblica, lavoro, servizi clinici e residenza in un’identità architettonica chiara. La composizione equilibra un basamento commerciale solido con livelli residenziali più leggeri.",
    },
    hero_statement: emptyText,
    layout: "editorial" as const,
    is_visible: true,
    images: [
      {
        id: "city-edge-concept-board",
        image_url: "/images/projects/city-edge/city-edge-concept-board.jpg",
        caption: {
          en: "City Edge — site geometry, yacht inspiration, and façade translation.",
          ar: "سيتي إيدج — هندسة الموقع، وإلهام اليخوت، وترجمة الواجهة.",
          it: "City Edge — geometria del sito, ispirazione nautica e traduzione della facciata.",
        },
        alt_text: {
          en: "City Edge concept board",
          ar: "لوحة الفكرة التصميمية لسيتي إيدج",
          it: "Tavola concettuale di City Edge",
        },
        layout: "drawing" as const,
      },
    ],
  },
  {
    id: "program",
    eyebrow: emptyText,
    title: { en: "Program", ar: "البرنامج", it: "Programma" },
    body: {
      en: "Retail activates the lower levels, followed by offices and medical clinics, while the upper floors provide residential units. A rooftop pool and barbecue area complete the building as a shared destination rather than a collection of isolated uses.",
      ar: "تنشّط المحلات التجارية الطوابق السفلية، تليها المكاتب والعيادات الطبية، بينما تضم الطوابق العليا الوحدات السكنية. ويكمل حمام السباحة ومنطقة الشواء على السطح المبنى كوجهة مشتركة بدلًا من أن يكون مجموعة استخدامات منفصلة.",
      it: "Gli spazi commerciali animano i livelli inferiori, seguiti da uffici e cliniche mediche, mentre i piani superiori ospitano le residenze. La piscina e l’area barbecue in copertura completano l’edificio come destinazione condivisa, non come semplice somma di funzioni separate.",
    },
    hero_statement: emptyText,
    layout: "editorial" as const,
    is_visible: true,
    images: [],
  },
  {
    id: "scope",
    eyebrow: emptyText,
    title: { en: "Scope", ar: "نطاق العمل", it: "Ambito" },
    body: {
      en: "Architecture\nFaçade\nMEP\nHVAC\nVertical Transportation\nInterior Finishing",
      ar: "العمارة\nالواجهات\nأعمال MEP\nالتكييف والتهوية\nالنقل الرأسي\nالتشطيبات الداخلية",
      it: "Architettura\nFacciata\nMEP\nHVAC\nTrasporto verticale\nFiniture interne",
    },
    hero_statement: emptyText,
    layout: "editorial" as const,
    is_visible: true,
    images: [],
  },
  {
    id: "status",
    eyebrow: emptyText,
    title: { en: "Status", ar: "الحالة", it: "Stato" },
    body: {
      en: "Ongoing\nStarted 2025",
      ar: "قيد التنفيذ\nبدأ في ٢٠٢٥",
      it: "In corso\nAvviato nel 2025",
    },
    hero_statement: emptyText,
    layout: "editorial" as const,
    is_visible: true,
    images: [],
  },
  {
    id: "execution",
    eyebrow: emptyText,
    title: { en: "Execution", ar: "التنفيذ", it: "Esecuzione" },
    body: {
      en: "City Edge is being delivered as a fully coordinated mixed-use development, bringing architectural design, building systems, façade construction, vertical transportation, mechanical and electrical works, and interior finishing together as one integrated process.",
      ar: "يُنفَّذ سيتي إيدج كمشروع متعدد الاستخدامات متكامل التنسيق، يجمع التصميم المعماري وأنظمة المبنى وتنفيذ الواجهات والنقل الرأسي والأعمال الميكانيكية والكهربائية والتشطيبات الداخلية ضمن عملية واحدة متكاملة.",
      it: "City Edge viene realizzato come sviluppo polifunzionale pienamente coordinato, riunendo progettazione architettonica, sistemi dell’edificio, facciate, trasporto verticale, impianti meccanici ed elettrici e finiture interne in un unico processo integrato.",
    },
    hero_statement: {
      en: "From\nconcept\nto reality.",
      ar: "من الفكرة\nإلى الواقع.",
      it: "Dal concetto\nalla realtà.",
    },
    layout: "editorial" as const,
    is_visible: true,
    images: [],
  },
  {
    id: "documentation",
    eyebrow: {
      en: "Project Documentation",
      ar: "توثيق المشروع",
      it: "Documentazione di progetto",
    },
    title: { en: "The Work.", ar: "العمل.", it: "Il lavoro." },
    body: emptyText,
    hero_statement: emptyText,
    layout: "full_bleed" as const,
    is_visible: true,
    images: [
      {
        id: "city-edge-the-work",
        image_url: "/images/projects/city-edge/city-edge-exterior-wip.jpeg",
        caption: emptyText,
        alt_text: {
          en: "City Edge exterior",
          ar: "واجهة سيتي إيدج",
          it: "Esterno di City Edge",
        },
        layout: "full_bleed" as const,
      },
    ],
  },
];

export const projects = [
  {
    id: 1,
    slug: "city-edge",
    title: "City Edge",
    location: "Fayoum City, Egypt",
    year: "2025 — Ongoing",

    image: "/images/projects/city-edge/city-edge-exterior-wip.jpeg",

    description:
      "City Edge is a landmark 12-storey mixed-use building in Fayoum City, Egypt, marking Mason & Arc’s first project in the country. It brings retail, offices, medical clinics, residential units, and rooftop amenities together within one integrated development.",

    gallery: [
      "/images/projects/city-edge/city-edge-exterior-wip.jpeg",
    ],
    contentSections: cityEdgeSections,
  },
];
