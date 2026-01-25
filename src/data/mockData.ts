export type Project = {
  id: number;
  title: string;
  location: string;
  description: string;
  image: string;
  typology?: string;
  isNightMode?: boolean;
  lat?: number;
  lng?: number;
};

export type Locality = {
  id: number;
  name: string; // e.g. "Kouba, Alger"
  description: string;
  image: string; // Path to the PNG icon
  heroImage?: string; // Path to the hero image (optional, inferred if missing)
};

export const PROJECTS: Project[] = [
  // --- CURRENT PROJECTS (Cube Style) ---
  {
    id: 1,
    title: "RÉSIDENCE CYANITE",
    location: "Chéraga, Alger",
    description: "Fort du succès de notre première résidence Pyrite, nous repoussons encore les limites du raffinement...",
    image: "/assets/projets/cyanite.png", 
    lat: 36.76501740797911, 
    lng: 2.9774939658426853,
  },
  {
    id: 2,
    title: "RÉSIDENCE AZURITE",
    location: "Kouba, Alger",
    description: "La résidence Azurite, située dans le quartier mythique de Kouba, offre un cadre de vie privilégié...",
    image: "/assets/projets/azurite.png",
    lat: 36.726,
    lng: 3.087,
  },
  {
    id: 3,
    title: "RÉSIDENCE AGATE",
    location: "Oued Romane, Alger",
    description: "Située à Oued Romane (El Achour), un quartier calme et verdoyant, la résidence offre un cadre de vie paisible...",
    image: "/assets/projets/agate.png",
    lat: 36.735,
    lng: 2.995,
  },
  {
    id: 4,
    title: "RÉSIDENCE AMÉTRINE",
    location: "Said Hamdine, Alger",
    description: "Résidence Amétrine, le récent chef-d'œuvre d'Aymen Promotion Immobilière, se distingue par...",
    image: "/assets/projets/ametrine.png",
    lat: 36.745,
    lng: 3.045,
  },
  {
    id: 5,
    title: "RÉSIDENCE CORNALINE",
    location: "Hydra, Alger",
    description: "Érigée au cœur de la commune de Hydra, la résidence Cornaline dévoile ses atouts de caractère...",
    image: "/assets/projets/cornaline.png",
    lat: 36.750,
    lng: 3.035,
  },
  {
    id: 6,
    title: "RÉSIDENCE SÉRAPHINITE",
    location: "Ruisseau, Alger",
    description: "C'est à Ruisseau, quartier prisé des Algérois, qu'Aymen Promotion Immobilière a choisi d'implanter son nouveau...",
    image: "/assets/projets/seraphinite.png",
    lat: 36.738,
    lng: 3.065,
  },
  {
    id: 7,
    title: "RÉSIDENCE CÉLESTINE",
    location: "Bab Ezzouar, Alger",
    description: "Aymen Promotion Immobilière lance son premier projet dans la commune dynamique de Bab Ezzouar...",
    image: "/assets/projets/celestine.png",
  },
  {
    id: 8,
    title: "RÉSIDENCE LARIMAR",
    location: "Birkhadem, Alger",
    description: "Idéalement située à Tixeraïne, Birkhadem, la résidence Larimar est une perle rare qui émerge en réponse...",
    image: "/assets/projets/cornaline.png", 
  },
  {
    id: 9,
    title: "RÉSIDENCE SELENITE",
    location: "Birkhadem, Alger",
    description: "Conçue pour allier esthétisme et fonctionnalité, la résidence one building Sélenite incarne le summum de la modernité...",
    image: "/assets/projets/agate.png", 
  },

  // --- FINISHED PROJECTS (Cube Style) ---
  {
    id: 10,
    title: "RÉSIDENCE DIAR EL AMANE",
    location: "Birkhadem, Alger",
    description: "Connue autrefois pour ses champs d'arbres fruitiers à perte de vue, la région des Vergers a...",
    image: "/assets/projets/diar-el-amane.png",
    isNightMode: false, 
  },
  {
    id: 11,
    title: "RÉSIDENCE PYRITE",
    location: "Cheraga, Alger",
    description: "Située à Dar Diaf, au cœur de la commune de Chéraga, la résidence Haut Standing Pyrite s'étend sur...",
    image: "/assets/projets/pyrite.png",
    isNightMode: false, 
  },
  {
    id: 12,
    title: "RÉSIDENCE JAIS",
    location: "Draria, Alger",
    description: "La résidence Jais, véritable joyau d'Aymen Promotion Immobilière, incarne le calme et la sophistication à l'état...",
    image: "/assets/projets/jais.png",
    isNightMode: false, 
  },
  {
    id: 13,
    title: "RÉSIDENCE LES CRÊTES",
    location: "Draria, Alger",
    description: "Au cœur d'un des quartiers les plus prestigieux de la commune de Draria, se dévoile la somptueuse Résidence...",
    image: "/assets/projets/les-cretes.png",
    isNightMode: false, 
  },

  // --- FINISHED PROJECTS (Night Mode / Photo Style) ---
  {
    id: 14,
    title: "RÉSIDENCE TURQUOISE",
    location: "Les Sources, Alger",
    description: "Aymen Promotion Immobilière détient l'art subtil de créer des résidences raffinées et intimistes. Parmi...",
    image: "/assets/projets/turquoise.png", 
    isNightMode: true,
  },
  {
    id: 15,
    title: "RÉSIDENCE SPINELLE",
    location: "Les Sources, Alger",
    description: "Nous vous présentons la Résidence Spinelle d'Aymen Promotion Immobilière, un havre de tranquillité niché au cœur de la paisible localité...",
    image: "/assets/projets/spinelle.png", 
    isNightMode: true,
  },
  {
    id: 16,
    title: "RÉSIDENCE BERYL",
    location: "Dely Ibrahim, Alger",
    description: "Idéalement nichée au cœur de la charmante commune de Dely Ibrahim, la résidence Béryl se dresse dans...",
    image: "/assets/projets/beryl.png", 
    isNightMode: true,
  },
  {
    id: 17,
    title: "RÉSIDENCE BOIS DES CARS",
    location: "Dely Ibrahim, Alger",
    description: "La résidence Bois des Cars, sise à Dely Ibrahim, représente un projet exclusif et sophistiqué de la société Aymen Promotion...",
    image: "/assets/projets/bois-des-cars.png", 
    isNightMode: true,
  },
  {
    id: 18,
    title: "RÉSIDENCE PÉRIDOT",
    location: "Hydra, Alger",
    description: "Raffinée et discrète, la résidence Péridot d'Aymen Promotion Immobilière représente un...",
    image: "/assets/projets/peridot.png", 
    isNightMode: true,
  },
  {
    id: 19,
    title: "RÉSIDENCE CORAIL",
    location: "Hydra, Alger",
    description: "Raffinée et discrète, la résidence Péridot d'Aymen Promotion Immobilière représente un...",
    image: "/assets/projets/corail.png", 
    isNightMode: true,
  },
  {
    id: 20,
    title: "RÉSIDENCE OPALE",
    location: "El Achour, Alger",
    description: "Raffinée et discrète, la résidence Péridot d'Aymen Promotion Immobilière représente...",
    image: "/assets/projets/opale.png", 
    isNightMode: true,
  },
  {
    id: 21,
    title: "RÉSIDENCE CITRINE",
    location: "Birkhadem, Alger",
    description: "Nous vous présentons la Résidence Spinelle d'Aymen Promotion Immobilière, un havre...",
    image: "/assets/projets/citrine.png", 
    isNightMode: true,
  },
  {
    id: 22,
    title: "RÉSIDENCE ANGÉLITE",
    location: "Dar El Beïda, Alger",
    description: "Idéalement nichée au coeur de la charmante commune de Dély Ibrahim...",
    image: "/assets/projets/angelite.png", 
    isNightMode: true,
  },
  {
    id: 23,
    title: "RÉSIDENCE RUBIS",
    location: "El Achour, Alger",
    description: "Véritable bijou de la promotion immobilière Aymen, la résidence Rubis se d...",
    image: "/assets/projets/rubis.png", 
    isNightMode: true,
  },
  {
    id: 24,
    title: "RÉSIDENCE ONYX",
    location: "Oued Romane, Alger",
    description: "Aymen Promotion Immobilière, reconnue pour ses résidences haut standing, tient une fois ...",
    image: "/assets/projets/onyx.png", 
    isNightMode: true,
  },
  {
    id: 25,
    title: "RÉSIDENCE EL MORDJANE",
    location: "Said Hamdine, Alger",
    description: "Au cœur d'Alger, dans le quartier de Said Hamdine, à quelques pas de la prestigieuse...",
    image: "/assets/projets/el-mordjane.png", 
    isNightMode: true,
  },
  {
    id: 26,
    title: "RÉSIDENCE 136",
    location: "Birkhadem, Alger",
    description: "Située à proximité de la petite ville Birkhadem, plus précisément à Tixeraïne, la résidence...",
    image: "/assets/projets/136.png", 
    isNightMode: true,
  },
  {
    id: 27,
    title: "RÉSIDENCE COQUELICOT",
    location: "Hydra, Alger",
    description: "Découvrez le nouvel opus urbain exceptionnel d'Aymen Promotion Immobilière...",
    image: "/assets/projets/coquelicot.png", 
    isNightMode: true,
  },
  {
    id: 28,
    title: "RÉSIDENCE PERLA",
    location: "Dal El Beïda, Alger",
    description: "Aymen Promotion Immobilière, reconnue pour ses résidences haut standing, tient une...",
    image: "/assets/projets/perla.png", 
    isNightMode: true,
  },
];

export const LOCALITIES: Locality[] = [
  {
    id: 1,
    name: "KOUBA, ALGER",
    description:
      "Située sur les hauteurs d'Alger, la commune de Kouba séduit par son équilibre entre patrimoine, dynamisme et cadre de vie résidentiel avec une riche histoire marquée par des édifices emblématiques comme le Fort Ottoman et l’ancienne Église Saint-Vincent-de-Paul, elle abrite également le Palais de la Culture Moufdi Zakaria, haut lieu de la scène artistique algérienne Pour ceux en quête de nature, la Forêt de Kouba propose un espace vert idéal pour la détente et les activités en plein air qui est proche du parc zoologique de Ben Aknoun, du centre commercial de Bab Ezzouar et de plusieurs établissements d’enseignement supérieur, Kouba attire autant les familles que les investisseurs grâce à son cadre de vie harmonieux alliant modernité et commodités",
    image: "/assets/locality-icon/kouba-icon.png",
    heroImage: "/assets/locality/kouba.png",
  },
  {
    id: 2,
    name: "HYDRA, ALGER",
    description:
      "Fièrement dressée sur les hauteurs de la wilaya d'Alger en Algérie, la commune de Hydra incarne le prestige et le raffinement. Réputée pour ses quartiers résidentiels huppés, ses ambassades et ses espaces verts luxuriants, Hydra offre un cadre de vie exclusif et sécurisé.",
    image: "/assets/locality-icon/hydra-icon.png",
    heroImage: "/assets/locality/hydra.png",
  },
  {
    id: 3,
    name: "BIRKHADEM, ALGER",
    description:
      "Autrefois célèbre pour ses vastes vergers et ses gracieuses villas mauresques, la commune de Birkhadem a su conserver son charme d'antan tout en s'ouvrant à la modernité. Située à proximité immédiate d'Alger Centre, elle offre un compromis idéal entre tranquillité résidentielle et accessibilité urbaine.",
    image: "/assets/locality-icon/birkhadem-icon.png",
    heroImage: "/assets/locality/birkhadem.png",
  },
  {
    id: 4,
    name: "DAR EL BEIDA, ALGER",
    description:
      "Porte d'entrée stratégique de la capitale, Dar El Beïda est une commune dynamique et en plein essor. Abritant l'aéroport international Houari Boumédiène, elle constitue un hub économique majeur et attire de nombreuses entreprises et zones d'activités.",
    image: "/assets/locality-icon/dar-el-beida-icon.png",
    heroImage: "/assets/locality/dar-el-beida.png",
  },
  {
    id: 5,
    name: "DELY IBRAHIM, ALGER",
    description:
      "Dely Ibrahim est une commune prisée pour son ambiance cosmopolite et ses infrastructures modernes. Connue pour ses grands centres commerciaux, ses installations sportives de haut niveau et ses quartiers résidentiels paisibles, elle attire une population jeune et dynamique.",
    image: "/assets/locality-icon/dely-ibrahim-icon.png",
    heroImage: "/assets/locality/dely-ibrahim.png",
  },
  {
    id: 6,
    name: "BAB EZZOUAR, ALGER",
    description:
      "Pôle universitaire et technologique par excellence, Bab Ezzouar est une commune vibrante et tournée vers l'avenir. Elle abrite l'Université des Sciences et de la Technologie Houari Boumédiène (USTHB) ainsi qu'un important quartier d'affaires.",
    image: "/assets/locality-icon/beb-ezzouar-icon.png",
    heroImage: "/assets/locality/beb-ezzouar.png",
  },
  {
    id: 7,
    name: "CHÉRAGA, ALGER",
    description:
      "Située sur les hauteurs d'Alger, la commune de Chéraga séduit par son équilibre entre urbanisme maîtrisé et espaces naturels préservés. Porte d'entrée vers le littoral ouest, elle offre un cadre de vie agréable avec ses commerces, ses restaurants et sa proximité avec la forêt de Bouchaoui.",
    image: "/assets/locality-icon/cheraga-icon.png",
    heroImage: "/assets/locality/cheraga.png",
  },
  {
    id: 8,
    name: "DRARIA, ALGER",
    description:
      "Fièrement dressée sur les hauteurs de la wilaya d'Alger en Algérie, la commune de Draria offre des panoramas exceptionnels sur la capitale et la mer. Appréciée pour son climat doux et son ambiance paisible, elle constitue un refuge idéal loin de l'agitation du centre-ville.",
    image: "/assets/locality-icon/draria-icon.png",
    heroImage: "/assets/locality/draria.png",
  },
  {
    id: 9,
    name: "EL ACHOUR, ALGER",
    description:
      "Voisine de Draria et de Dely Ibrahim, El Achour est une commune résidentielle en plein développement. Elle séduit par ses nouveaux projets immobiliers, ses espaces de loisirs comme le parc zoologique et sa proximité avec les axes routiers majeurs.",
    image: "/assets/locality-icon/el-achour-icon.png",
    heroImage: "/assets/locality/el-achour.png",
  },
  {
    id: 10,
    name: "SAID HAMDINE, ALGER",
    description:
      "Quartier résidentiel et administratif situé sur les hauteurs d'Hydra, Said Hamdine est réputé pour son calme et sa sécurité. Il abrite de nombreuses institutions judiciaires et administratives, ainsi que des résidences de standing.",
    image: "/assets/locality-icon/said-hamdine-icon.png",
    heroImage: "/assets/locality/said-hamdine.png",
  },
  {
    id: 11,
    name: "RUISSEAU, ALGER",
    description:
      "Carrefour stratégique entre le centre-ville et la banlieue est, Ruisseau est un quartier en pleine mutation. Mêlant habitat traditionnel et constructions modernes, il bénéficie d'une excellente desserte en transports en commun (métro, tramway, téléphérique).",
    image: "/assets/locality-icon/ruisseau-icon.png",
    heroImage: "/assets/locality/ruisseau.png",
  },
];