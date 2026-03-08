export type Project = {
  id: number;
  title: string;
  location: string;
  description: string; // Description courte pour les cartes (Page Projets)
  image: string; // Image principale (Vignette)
  typology?: string;
  isNightMode?: boolean;
  status: "EN COURS" | "FINIS";
  lat?: number;
  lng?: number;
  
  // --- CHAMPS POUR LA PAGE DÉTAILS ---
  coverImage?: string; // Image grand format en haut de page
  fullDescription?: string; // Description longue et détaillée
  galleryFolder?: string; // 📁 Dossier contenant toutes les images de la galerie
  gallery?: string[]; // Pour la compatibilité avec le format existant
  features?: string[]; // Points forts (ex: ["RECEPTION", "DOMOTIQUE"])
  details?: { label: string; value: string }[]; // Infos techniques (ex: Surface, Date)
  plans?: { type: string; area: string; image: string }[]; // Plans avec le nouveau format
};

export type Locality = {
  id: number;
  name: string;
  description: string;
  image: string;
  heroImage?: string;
};

// Plans standards pour toutes les résidences
const STANDARD_PLANS = [
  { type: "F3", area: "67 à 142 m²", image: "/plans/F3.jpg" },
  { type: "F4", area: "80 à 160 m²", image: "/plans/F4.png" },
  { type: "DUPLEX EN F5", area: "150 à 220 m²", image: "/plans/F5.png" },
];

const CYANITE_PLANS = [
  { type: "F3", area: "80 à 130 m²", image: "/plans/f3-cyanite.jpg" },
  { type: "F4", area: "120 à 160 m²", image: "/plans/F4-cyanite.jpg" },
  { type: "F5", area: "150 à 200 m²", image: "/plans/F5.png" },
];

const AZURITE_PLANS = [
  { type: "F3", area: "75 à 110 m²", image: "/plans/F3.jpg" },
  { type: "F4", area: "100 à 140 m²", image: "/plans/F4.png" },
  { type: "DUPLEX", area: "160 à 240 m²", image: "/plans/duplex-azurite.jpg" },
];

const LARIMAR_PLANS = [
  { type: "F2", area: "50 à 70 m²", image: "/plans/f2-larimar.jpg" },
  { type: "F3", area: "80 à 120 m²", image: "/plans/F3.jpg" },
  { type: "F4", area: "110 à 150 m²", image: "/plans/f4-larimar.jpg" },
];

const RUBIS_PLANS = [
  { type: "F3", area: "85 à 125 m²", image: "/plans/f3-2.jpg" },
  { type: "F4", area: "130 à 170 m²", image: "/plans/Rubis F4 + surface.png" },
  { type: "F5", area: "160 à 210 m²", image: "/plans/F5-2.png" },
];

const MIX_PLANS_1 = [
  { type: "F3", area: "70 à 115 m²", image: "/plans/f3-2.jpg" },
  { type: "F4", area: "100 à 145 m²", image: "/plans/F4.png" },
  { type: "F5", area: "140 à 190 m²", image: "/plans/F5-2.png" },
];

const MIX_PLANS_2 = [
  { type: "F3", area: "65 à 110 m²", image: "/plans/F3.jpg" },
  { type: "F4", area: "95 à 135 m²", image: "/plans/F4.png" },
  { type: "DUPLEX", area: "155 à 230 m²", image: "/plans/F5.png" },
];

// Features standards pour toutes les résidences (avec les icônes SVG)
const STANDARD_FEATURES = [
  "RECEPTION",
  "DOMOTIQUE",
  "CLIMATISATION CENTRALISÉE",
  "ABATTOIR",
  "AIRE DE JEUX"
];

export const PROJECTS: Project[] = [
  // --- PROJETS EN COURS ---
  {
    id: 29,
    title: "ALTHEA",
    location: "Chevalley, Alger",
    description: "C’est à Chevalley, quartier résidentiel prisé, qu’Aymen Promotion Immobilière présente la résidence Althéa...",
    image: "/assets/projets/althea.png",
    status: "EN COURS",
    isNightMode: false,  
    coverImage: "/assets/projets/couvertures/althea.png",            
    fullDescription: `C’est à Chevalley, quartier résidentiel prisé, qu’Aymen Promotion Immobilière présente la résidence Althéa, une adresse conçue pour offrir confort, sérénité et accessibilité. Idéalement située, la résidence se trouve à proximité de l’Université de Médecine de Ben Aknoun, de l’Université des Langues, des commerces, marchés et structures hospitalières. Les grands axes routiers, le Complexe Olympique du 5 Juillet et son annexe la mythique Coupole, le terrain de golf, l’hôtel militaire ainsi que les centres commerciaux de Ben Aknoun et d’El Biar complètent un environnement dynamique et pratique. Althéa se distingue par son architecture contemporaine, marquée par des volumes élégants et un éclairage LED qui sublime les façades la nuit`,
    gallery: [
      "/assets/projets/galeries/Althea/1.jpeg",
      "/assets/projets/galeries/Althea/2.jpeg",
      "/assets/projets/galeries/Althea/3.png",
      "/assets/projets/galeries/Althea/4.png",
      "/assets/projets/galeries/Althea/5.png",
      "/assets/projets/galeries/Althea/6.png", 
    ],
    features: STANDARD_FEATURES,
    details: [
      { label: "Adresse", value: "Alger" },
      { label: "Blocs", value: "02" },
      { label: "État d'avancement", value: "00 %" },
    ],
    plans: MIX_PLANS_2
  },

  {
    id: 1,
    title: "CYANITE",
    location: "Chéraga, Alger",
    description: "Fort du succès de notre première résidence Pyrite, nous repoussons encore les limites du raffinement...",
    image: "/assets/projets/cyanite.png", 
    lat: 36.765, 
    lng: 2.977,
    status: "EN COURS",
    isNightMode: false,
    
    coverImage: "/assets/projets/couvertures/cyanite.png",
    fullDescription: `Fort du succès de notre première résidence Pyrite, nous repoussons encore les limites du raffinement avec la résidence Cyanite, une nouvelle adresse prestigieuse au cœur du mythique quartier de Dar Diaf. Ce projet d’exception propose des appartements de haut standing, sublimés par une architecture contemporaine aux lignes épurées. Ses façades élégantes, rehaussées par un éclairage subtil, confèrent à la résidence une signature lumineuse unique dès la tombée de la nuit. Chaque appartement est conçu pour offrir un confort absolu : de grandes baies vitrées inondent les espaces de lumière naturelle, tandis que de superbes balcons et terrasses prolongent harmonieusement les intérieurs avec élégance. Les finitions haut de gamme et les nombreux services disponibles garantissent un cadre de vie exclusif. Pour un bien-être optimal, la résidence Cyanite met à disposition de ses résidents une salle de sport entièrement équipée, des piscines luxueuses ainsi qu’un espace bien-être comprenant un sauna, parfaits pour des instants de détente et de relaxation absolue.`,
    gallery: [
      "/assets/projets/galeries/cyanite/1.png",
      "/assets/projets/galeries/cyanite/2.png",
      "/assets/projets/galeries/cyanite/3.png",
      "/assets/projets/galeries/cyanite/4.png",
      "/assets/projets/galeries/cyanite/5.png",
      "/assets/projets/galeries/cyanite/6.png",
      "/assets/projets/galeries/cyanite/7.png",
    ],
    features: STANDARD_FEATURES,
    details: [
      { label: "Adresse", value: "Chéraga" },
      { label: "Blocs", value: "01" },
      { label: "État d'avancement", value: "10 %" },
    ],
    plans: CYANITE_PLANS
  },

  {
    id: 2,
    title: "AZURITE",
    location: "Kouba, Alger",
    description: "La résidence Azurite, située dans le quartier mythique de Kouba, offre un cadre de vie privilégié...",
    image: "/assets/projets/azurite.png",
    lat: 36.726,
    lng: 3.087,
    status: "EN COURS",
    isNightMode: false,

    coverImage: "/assets/projets/couvertures/azurite.png",
    fullDescription: `La résidence Azurite, située dans le quartier mythique de Kouba, offre un cadre de vie privilégié, à proximité immédiate de l’université, des commerces et des restaurants prisés. Elle bénéficie également d’un emplacement stratégique, à moins de 10 minutes de Riadh El Feth et de l’hôpital Ain Naadja, et à seulement 20 minutes de l’aéroport d’Alger.`,
    gallery: [
      "/assets/projets/galeries/azurite/1.png",
      "/assets/projets/galeries/azurite/2.png",
      "/assets/projets/galeries/azurite/3.png",
      "/assets/projets/galeries/azurite/4.png",
      "/assets/projets/galeries/azurite/5.png",
      "/assets/projets/galeries/azurite/6.png",
      "/assets/projets/galeries/azurite/7.png",
    ],
    features: STANDARD_FEATURES,
    details: [
      { label: "Adresse", value: "Kouba" },
      { label: "Blocs", value: "01" },
      { label: "État d'avancement", value: "10 %" },
    ],
    plans: AZURITE_PLANS
  },

  {
    id: 3,
    title: "AGATE",
    location: "Oued Romane, Alger",
    description: "Située à Oued Romane (El Achour), un quartier calme et verdoyant...",
    image: "/assets/projets/agate.png",
    status: "EN COURS",
    isNightMode: false,

    coverImage: "/assets/projets/couvertures/agate.png",
    fullDescription: `Située à Oued Romane (El Achour), un quartier calme et verdoyant, la résidence offre un cadre de vie paisible, propice à la sérénité. Cette résidence contemporaine se compose de deux blocs regroupant 67 appartements aux typologies variées : F2, F3, F4, F5 et duplex. Dans la continuité de notre volonté d’innover et d’améliorer constamment nos réalisations, AGATE propose des espaces de vie conçus pour allier modernité, confort et qualité de finition, garantis dans un cadre harmonieux et élégant. Idéale pour les familles comme pour les jeunes actifs, la résidence AGATE représente un véritable havre de paix où bien-être et raffinement se rencontrent.`,
    gallery: [
      "/assets/projets/galeries/agate/1.png",
      "/assets/projets/galeries/agate/2.png",
      "/assets/projets/galeries/agate/3.png",
      "/assets/projets/galeries/agate/4.png",
      "/assets/projets/galeries/agate/5.png",
      "/assets/projets/galeries/agate/6.png",
    ],
    features: STANDARD_FEATURES,
    details: [
      { label: "Adresse", value: "El Achour" },
      { label: "Blocs", value: "02" },
      { label: "État d'avancement", value: "76 %" },
    ],
    plans: MIX_PLANS_1
  },

  {
    id: 4,
    title: "AMÉTRINE",
    location: "Said Hamdine, Alger",
    description: "Résidence Amétrine, le récent chef-d'œuvre d'Aymen Promotion Immobilière...",
    image: "/assets/projets/ametrine.png",
    status: "EN COURS",
    isNightMode: false,

    coverImage: "/assets/projets/couvertures/ametrine.jpg",
    fullDescription: `Résidence Amétrine , le récent chef-d'œuvre d'Aymen Promotion Immobilière, se distingue par son caractère intimiste et son emplacement privilégié à Saïd Hamdine, dans la commune de Bir Mourad Raïs. Ce projet d'exception propose 27 appartements de haut standing , avec diverses typologies s'étendant du F2 de 49 m² au somptueux F5 de 321 m². Le design contemporain des trois façades révèle une esthétique avant-gardiste, s'intégrant harmonieusement dans l'environnement urbain moderne.

Chaque appartement bénéficie d'une finition haut de gamme, avec des matériaux de qualité , et de vastes baies vitrées permettant une luminosité naturelle optimale tout au long de la journée. Certains logements exclusifs disposent de terrasses privées agrémentées de piscines, offrant un espace de détente privilégié à leurs résidents.

La Résidence Amétrine se distingue également par sa situation géographique stratégique, avec un accès direct à l'autoroute, et sa proximité immédiate des entreprises, universités, salles de sport, des boutiques prisées de Sidi Yahia, ainsi que des commodités et services de la commune d'Hydra.`,
    gallery: [
      "/assets/projets/galeries/ametrine/1.jpg",
      "/assets/projets/galeries/ametrine/2.jpg",
      "/assets/projets/galeries/ametrine/3.jpg",  
      "/assets/projets/galeries/ametrine/4.jpg",
      "/assets/projets/galeries/ametrine/5.jpg",
      "/assets/projets/galeries/ametrine/6.jpg",       
    ],
    features: STANDARD_FEATURES,
    details: [
      { label: "Adresse", value: "Said Hamdine" },
      { label: "Blocs", value: "01" },
      { label: "État d'avancement", value: "79 %" },
    ],
    plans: MIX_PLANS_2
  },

  {
    id: 5,
    title: "CORNALINE",
    location: "Hydra, Alger",
    description: "Érigée au cœur de la commune de Hydra, la résidence Cornaline dévoile ses atouts...",
    image: "/assets/projets/cornaline.png",
    status: "EN COURS",
    isNightMode: false,

    coverImage: "/assets/projets/couvertures/cornaline.png",
    fullDescription: `Érigée au cœur de la commune de Hydra, la résidence Cornaline dévoile ses atouts de caractère dans un cadre propice au développement et à la relaxation.

Aymen Promotion Immobilière vous convie à découvrir cette résidence one building intimiste, alliant charme et élégance contemporaine. Véritable écrin de prestige, cette résidence se compose d’appartements F2, F3, F4 et F5 en simplex et en duplex, soigneusement répartis au sein d'un bloc unique, avec des superficies variées.

Baignés de lumière naturelle grâce à une conception ingénieuse, les intérieurs offrent une ambiance chaleureuse et accueillante, où il fait bon vivre. Les appartements, aux finitions raffinées et aux matériaux nobles importés d’Italie, dévoilent des espaces généreux et fonctionnels. Chaque détail a été pensé avec soin pour répondre aux exigences les plus élevées. Certains logements bénéficient même d'agréables terrasses privatives, parfaites pour savourer les douceurs du climat méditerranéen.

Au cœur de ce havre de paix, les résidents pourront également profiter de parkings en sous-sol sécurisés, offrant un accès direct aux différents paliers. La résidence Cornaline est l'adresse de choix pour les amateurs de calme, à la recherche d'un cadre privilégié à Hydra. Un pur condensé de raffinement et d'élégance, pour une vie résidentielle digne des plus grands.
`,
    gallery: [
      "/assets/projets/galeries/cornaline/1.png",
      "/assets/projets/galeries/cornaline/2.png",     
    ],
    features: STANDARD_FEATURES,
    details: [
      { label: "Adresse", value: "Hydra" },
      { label: "Blocs", value: "01" },
      { label: "État d'avancement", value: "98 %" },
    ],
    plans: MIX_PLANS_1
  },

  {
    id: 6,
    title: "SÉRAPHINITE",
    location: "Ruisseau, Alger",
    description: "C'est à Ruisseau, quartier prisé des Algérois, qu'Aymen Promotion...",
    image: "/assets/projets/seraphinite.png",
    status: "EN COURS",
    isNightMode: false,

    coverImage: "/assets/projets/couvertures/seraphinite.png",
    fullDescription: `C’est à Ruisseau, quartier prisé des Algérois, qu’Aymen Promotion Immobilière a choisi d’implanter son nouveau joyau immobilier : la résidence Séraphinite. Ce projet se situe à proximité du jardin d’Essai d’EL Hamma, l’un des jardins botaniques les plus remarquables au monde, de la gare ferroviaire, du tramway, du métro et de l’iconique hôtel Sofitel.

Cette adresse est un trait d’union entre patrimoine et modernité, offrant une architecture s’inspirant des charmes méditerranéens et proposant des appartements luxueux allant du F2 au F5 en simplex, ainsi que de somptueux Triplex pour un confort optimal. Certains appartements disposent même d’une piscine privative pour des moments de détente privilégiés.

En plus des intérieurs raffinés, ce complexe résidentiel offre diverses commodités telles qu’une piscine collective, une salle de sport, une réception style hôtelier ainsi qu’une aire de jeux pour le plaisir des petits et des grands.

Optez pour le confort luxueux de la résidence Séraphinite à Ruisseau et de ses commodités incomparables.`,
    gallery: [
      "/assets/projets/galeries/seraphinite/1.jpg",
      "/assets/projets/galeries/seraphinite/2.jpg",
      "/assets/projets/galeries/seraphinite/3.jpg",
      "/assets/projets/galeries/seraphinite/4.jpg",
      "/assets/projets/galeries/seraphinite/5.jpg",
      "/assets/projets/galeries/seraphinite/6.jpg",
    ],
    features: STANDARD_FEATURES,
    details: [
      { label: "Adresse", value: "Ruisseau" },
      { label: "Blocs", value: "03" },
      { label: "État d'avancement", value: "63 %" },
    ],
    plans: MIX_PLANS_2
  },

  {
    id: 7,
    title: "CÉLESTINE",
    location: "Bab Ezzouar, Alger",
    description: "Aymen Promotion Immobilière lance son premier projet dans la commune dynamique...",
    image: "/assets/projets/celestine.png",
    status: "EN COURS",
    isNightMode: false,

    coverImage: "/assets/projets/couvertures/celestine.jpg",
    fullDescription: `Aymen Promotion Immobilière lance son premier projet dans la commune dynamique de Bab Ezzouar !

Ce complexe résidentiel arbore un design extérieur résolument contemporain et dynamique, apportant une touche d'élégance à son environnement urbain immédiat, qui lui-même regorge de nombreux attraits. Bab Ezzouar, en tant que pôle d'affaires et de commerce de premier plan, offre une gamme variée de commodités, notamment des centres commerciaux, des restaurants renommés, une multitude d'entreprises, ainsi que plusieurs installations de divertissement et de bien-être.

Cette résidence de choix se compose de 07 blocs distincts, s'étendant sur plusieurs étages. Vous y trouverez une variété d'appartements de différentes typologies, allant du F2 de 55 m² au Triplex de 339 m², de quoi satisfaire les attentes de tous.

Aymen Promotion Immobilière s'engage à offrir à ses clients un cadre de vie d'exception, en sélectionnant avec soin des matériaux et des finitions de haute qualité. De la conception à la réalisation, nos équipes sont mobilisées pour créer des appartements qui allient confort, sécurité et esthétique.`,
    gallery: [
      "/assets/projets/galeries/celestine/1.png",
      "/assets/projets/galeries/celestine/2.png",
      "/assets/projets/galeries/celestine/3.jpg", 
    ],
    features: STANDARD_FEATURES,
    details: [
      { label: "Adresse", value: "Bab Ezzouar" },
      { label: "Blocs", value: "07" },
      { label: "État d'avancement", value: "71 %" },
    ],
    plans: MIX_PLANS_1
  },

  {
    id: 8,
    title: "LARIMAR",
    location: "Birkhadem, Alger",
    description: "Idéalement située à Tixeraïne, Birkhadem, la résidence Larimar est une perle rare...",
    image: "/assets/projets/larimar.png",
    status: "EN COURS",
    isNightMode: false,

    coverImage: "/assets/projets/couvertures/larimar.png",
    fullDescription: `Idéalement située à Tixeraïne, Birkhadem, la résidence Larimar est une perle rare qui émerge en réponse au succès retentissant de la résidence Aymen, également située à Tixeraïne. Forts de l'engouement rencontré par la résidence Aymen, nous avons pris l'initiative de créer Larimar, une résidence d'exception qui promet un cadre de vie unique.

Dotée de deux parkings souterrains, Larimar assure une expérience résidentielle sans stress. Une vingtaine d’appartements, allant du F3 au F4, sont disponibles et offrent des espaces de vie spacieux, variant de 80 m² à 141 m². Les pièces raffinées allient astucieusement fonctionnalité et bien-être, grâce à un agencement pensé par des experts et à une finition apportée avec minutie. La résidence abrite également en son sein un bloc administratif.

Plongez dans un cadre urbain moderne et élégant, où le confort se marie harmonieusement avec des résidences conçues avec goût, alliant fonctionnalité et esthétique. Larimar incarne l'évolution naturelle de notre engagement envers l'excellence résidentielle, tout en tirant profit des commodités exceptionnelles proposées par la commune de Birkhadem.`,
    gallery: [
      "/assets/projets/galeries/larimar/1.png",
      "/assets/projets/galeries/larimar/2.png",
      "/assets/projets/galeries/larimar/3.png", 
      "/assets/projets/galeries/larimar/4.png",
      "/assets/projets/galeries/larimar/5.png",
      "/assets/projets/galeries/larimar/6.png",   
    ],
    features: STANDARD_FEATURES,
    details: [
      { label: "Adresse", value: "Tixeraïne" },
      { label: "Blocs", value: "02" },
      { label: "État d'avancement", value: "71 %" },
    ],
    plans: LARIMAR_PLANS
  },

  {
    id: 9,
    title: "SELENITE",
    location: "Birkhadem, Alger",
    description: "Conçue pour allier esthétisme et fonctionnalité, la résidence one building Sélenite...",
    image: "/assets/projets/selenite.png",
    status: "FINIS",
    isNightMode: true,

    coverImage: "/assets/projets/couvertures/selenite.png",
    fullDescription: `Conçue pour allier esthétisme et fonctionnalité, la résidence one building Sélénite incarne le summum de la modernité. Cet édifice élégant se positionne judicieusement dans la commune affectionnée de Birkhadem.

Redéfinissant les concepts de confort et d’élégance, la résidence Sélénite vous offre le choix entre des appartements de typologies F4 et F5, avec des surfaces allant de 104 m² à 251 m².

En plus d’une sécurité optimale assurée 24h/24, deux niveaux souterrains dédiés au stationnement sont disponibles, vous garantissant une tranquillité d’esprit au quotidien.

Vivez une expérience résidentielle paisible dans ce projet intimiste, où le calme règne en maître.`,
    gallery: [
      "/assets/projets/galeries/selenite/1.png",
      "/assets/projets/galeries/selenite/2.png",
      "/assets/projets/galeries/selenite/3.png",
      "/assets/projets/galeries/selenite/4.png",
      "/assets/projets/galeries/selenite/5.png",
      "/assets/projets/galeries/selenite/6.png", 
      "/assets/projets/galeries/selenite/7.png",  
    ],
    features: STANDARD_FEATURES,
    details: [
      { label: "Adresse", value: "Birkhadem" },
      { label: "Blocs", value: "01" },
      { label: "État d'avancement", value: "100 %" },
    ],
    plans: MIX_PLANS_1
  },

  {
    id: 10,
    title: "DIAR EL AMANE",
    location: "Birkhadem, Alger",
    description: "Connue autrefois pour ses champs d'arbres fruitiers à perte de vue...",
    image: "/assets/projets/diar-el-amane.png",
    status: "EN COURS",
    isNightMode: false,

    coverImage: "/assets/projets/couvertures/diar-el-amane.jpg",
    fullDescription: `Connue autrefois pour ses champs d’arbres fruitiers à perte de vue, la région des Vergers à Birkhadem connaît depuis quelque temps une croissance importante. Devenue une région très recherchée par les acquéreurs, elle abrite aujourd’hui un symbole de la nouvelle génération de résidences en Algérie qui sublime son patrimoine urbain : la résidence Diar El Amane de la prestigieuse promotion immobilière Aymen.

Cette merveille architecturale transcende l'idée de résidence. En effet, en plus de son design épuré et contemporain, les espaces intérieurs bénéficient également d’une conception ingénieuse et d’espaces de vie idéalement agencés. Un vaste choix de typologies vous attend, allant du charmant F2 de 54 m² au spacieux F5 de 188 m² en simplex. Si vous souhaitez plus d’espace, vous pouvez découvrir des duplex exclusifs d'une opulence inégalée, variant du F4 de 134 m² à 188 m².

De plus, une myriade de commodités a été méticuleusement aménagée pour élever chaque instant de votre quotidien. Découvrez une piscine extérieure, une salle de sport ultramoderne, et un spa luxueux avec sauna et hammam, le tout au sein de votre résidence.

En définitive, la résidence Diar El Amane est une allégorie de l’art de vivre, ou luxe et fonctionnalité subsistent en parfaite symbiose.`,
    gallery: [
      "/assets/projets/galeries/diar-el-amane/1.jpg",
      "/assets/projets/galeries/diar-el-amane/2.jpg",
      "/assets/projets/galeries/diar-el-amane/3.jpg", 
      "/assets/projets/galeries/diar-el-amane/4.jpg",
      "/assets/projets/galeries/diar-el-amane/5.jpg",
      "/assets/projets/galeries/diar-el-amane/6.png",  
    ],
    features: STANDARD_FEATURES,
    details: [
      { label: "Adresse", value: "Birkhadem" },
      { label: "Blocs", value: "04" },
      { label: "État d'avancement", value: "94 %" },
    ],
    plans: MIX_PLANS_2
  },

  {
    id: 11,
    title: "PYRITE",
    location: "Cheraga, Alger",
    description: "Située à Dar Diaf, au cœur de la commune de Chéraga...",
    image: "/assets/projets/pyrite.png",
    status: "FINIS",
    isNightMode: true,

    coverImage: "/assets/projets/couvertures/pyrite.png",
    fullDescription: `Située à Dar Diaf, au cœur de la commune dynamique de Chéraga, la résidence Haut Standing Pyrite s'étend sur 3 blocs et propose une large variété de logements d'exception. Ce projet innovant donne sur les accès autoroutiers, facilitant grandement les déplacements des résidents.

En plus de profiter d’une mobilité aisée et rapide au quotidien, les habitants bénéficient d’un cadre de vie unique dans des appartements idéalement aménagés et équipés avec les dernières technologies : climatisation centralisée, fenêtres en aluminium avec double vitrage, volets électriques, etc. Une large variété de superficie est également disponible, allant du F2 de 45 m², au F5 de 165 m². De plus, cette somptueuse résidence offre un environnement paisible et sécurisé, gage de tranquillité pour ses résidents, grâce à un service de gardiennage et de maintenance dévoué en permanence, ainsi qu'à des accès contrôlés via un système sophistiqué de digicode.`,
    gallery: [
      "/assets/projets/galeries/pyrite/1.JPG",
      "/assets/projets/galeries/pyrite/2.JPG",
      "/assets/projets/galeries/pyrite/3.JPG", 
      "/assets/projets/galeries/pyrite/4.JPG",
      "/assets/projets/galeries/pyrite/5.JPG",
      "/assets/projets/galeries/pyrite/6.JPG",      
      "/assets/projets/galeries/pyrite/7.png",  
    ],
    features: STANDARD_FEATURES,
    details: [
      { label: "Adresse", value: "Chéraga" },
      { label: "Blocs", value: "03" },
      { label: "État d'avancement", value: "100 %" },
      
    ],
    plans: MIX_PLANS_1
  },

  {
    id: 12,
    title: "JAIS",
    location: "Draria, Alger",
    description: "La résidence Jais, véritable joyau d'Aymen Promotion Immobilière...",
    image: "/assets/projets/jais.png",
    status: "FINIS",
    isNightMode: true,

    coverImage: "/assets/projets/couvertures/jais.png",
    fullDescription: `La résidence Jais, véritable joyau d’Aymen Promotion Immobilière, incarne le calme et la sophistication à l’état pur et offre une multitude d'aménagements pour un cadre de vie des plus confortables.

Idéalement situé à Sebala, dans la commune résidentielle de Draria à Alger, Jais bénéficie de toutes les commodités qu'offre cette région. Entre ses restaurants réputés et ses rues commerçantes animées, les environs sauront vous captiver et vous divertir.

Cette résidence propose une gamme variée d'appartements, allant du F3 au F5 en duplex, avec des superficies allant de 79 m² à 226 m², afin de répondre aux besoins et aux attentes de chacun. Alliant qualité et innovation, ce projet haut standing est construit avec des matériaux nobles et équipés des dernières technologies.

Que vous recherchiez de vastes espaces intérieurs ou un appartement de taille moyenne, avec un agencement idéal, vous frappez à la bonne porte !`,
    gallery: [
      "/assets/projets/galeries/jais/1.JPG",
      "/assets/projets/galeries/jais/2.JPG",
      "/assets/projets/galeries/jais/3.JPG",
      "/assets/projets/galeries/jais/4.JPG",    
    ],
    features: STANDARD_FEATURES,
    details: [
      { label: "Adresse", value: "Draria" },
      { label: "Blocs", value: "02" },
      { label: "État d'avancement", value: "100 %" },
    ],
    plans: MIX_PLANS_2
  },

  {
    id: 13,
    title: "LES CRÊTES",
    location: "Draria, Alger",
    description: "Au cœur d'un des quartiers les plus prestigieux de la commune de Draria...",
    image: "/assets/projets/les-cretes.png",
    status: "FINIS",
    isNightMode: true,

    coverImage: "/assets/projets/couvertures/les-cretes.png",
    fullDescription: `Au cœur d'un des quartiers les plus prestigieux de la commune de Draria, se dévoile la somptueuse Résidence Les Crêtes. Présentant un design moderne et raffiné, cette résidence se distingue par ses façades ornées de magnifiques angles vitrés. Implanté sur plusieurs niveaux, ce projet immobilier contemporain s'intègre harmonieusement au tissu urbain environnant. Il offre une gamme d'appartements allant du F2 de 47 m² au F5 de 210 m² en simplex, répartis sur quatre blocs disposés autour d'une esplanade, espace de détente et de convivialité agrémenté d'une aire de jeux, pour le plus grand plaisir des petits et des grands !

Cette résidence offre également toutes les commodités essentielles pour une vie quotidienne dynamique et épanouissante. En effet, vous serez idéalement situés à proximité des axes autoroutiers pour une mobilité optimale, ainsi que des artères commerçantes, des salles de sport de premier plan et diverses infrastructures dédiées au bien-être et aux loisirs.`,
    gallery: [
      "/assets/projets/galeries/les-cretes/1.JPG",
      "/assets/projets/galeries/les-cretes/2.JPG",
      "/assets/projets/galeries/les-cretes/3.JPG",
      "/assets/projets/galeries/les-cretes/4.JPG",
      "/assets/projets/galeries/les-cretes/5.JPG",
      "/assets/projets/galeries/les-cretes/6.JPG",
      "/assets/projets/galeries/les-cretes/7.png",
      "/assets/projets/galeries/les-cretes/8.png",  
    ],
    features: STANDARD_FEATURES,
    details: [
      { label: "Adresse", value: "Draria" },
      { label: "Blocs", value: "04" },
      { label: "État d'avancement", value: "100 %" },
    ],
    plans: MIX_PLANS_1
  },

  // --- PROJETS FINIS ---
  {
    id: 14,
    title: "TURQUOISE",
    location: "Les Sources, Alger",
    description: "Aymen Promotion Immobilière détient l'art subtil de créer des résidences...",
    image: "/assets/projets/turquoise.png", 
    status: "FINIS",
    isNightMode: true,
    coverImage: "/assets/projets/couvertures/turquoise.jpg",
    fullDescription: `Aymen Promotion Immobilière détient l'art subtil de créer des résidences raffinées et intimistes. Parmi ces créations prestigieuses, se trouve la résidence Turquoise, un véritable havre de paix niché au cœur des Sources à Alger.

Cette résidence d'exception se compose de 14 appartements, allant du F2 au F7 en attique, offrant un confort sans pareil. L'intérieur de ces appartements a été pensé avec minutie pour allier modernité et praticité, procurant ainsi un cadre de vie harmonieux et fonctionnel aux résidents. Située à seulement 4 kilomètres du centre d'Alger, la résidence Turquoise jouit d'une situation privilégiée, offrant une proximité enviable avec divers points stratégiques de la capitale. Les résidents ont la chance de se retrouver à quelques pas des musées fascinants, des monuments historiques emblématiques, de restaurants raffinés, et des rues commerçantes animées. La résidence Turquoise représente ainsi bien plus qu'un simple lieu de vie, c'est un véritable joyau architectural et fonctionnel.`,
    gallery: [
      "/assets/projets/galeries/turquoise/1.jpg",
    ],
    features: STANDARD_FEATURES,
    details: [
      { label: "Adresse", value: "Les Sources" },
      { label: "Blocs", value: "01" },
      { label: "État d'avancement", value: "100 %" },
    ],
    plans: MIX_PLANS_2
  },

  {
    id: 15,
    title: "SPINELLE",
    location: "Les Sources, Alger",
    description: "Nous vous présentons la Résidence Spinelle d'Aymen Promotion Immobilière...",
    image: "/assets/projets/spinelle.png", 
    status: "FINIS",
    isNightMode: true,
    coverImage: "/assets/projets/couvertures/spinelle.png",
    fullDescription: `Nous vous présentons la Résidence Spinelle d’Aymen Promotion Immobilière, un havre de tranquillité niché au cœur de la paisible localité des Sources. Avec un souci constant de qualité et de haut standing, notre résidence exclusive offre une opportunité unique de vivre dans le confort moderne, entouré par la sérénité de son environnement.

La Résidence Spinelle se distingue par ses 12 logements fonctionnels conçus pour répondre aux normes les plus élevées de qualité et de design. Ces espaces de vie vont du F2 de 78 m² au F4 de 140 m² en simplex, offrant ainsi une variété d'options pour répondre aux besoins et préférences spécifiques de chacun. Les intérieurs élégamment aménagés reflètent une attention minutieuse aux détails, mettant en valeur les matériaux de première qualité et les finitions soignées. Située dans une impasse, la Résidence Spinelle offre une retraite paisible loin de l'agitation urbaine, tout en étant à proximité des commodités essentielles et des axes routiers.`,
    gallery: [
      "/assets/projets/galeries/spinelle/1.JPG",
      "/assets/projets/galeries/spinelle/2.JPG",
      "/assets/projets/galeries/spinelle/3.JPG",
      "/assets/projets/galeries/spinelle/4.JPG",    
    ],
    features: STANDARD_FEATURES,
    details: [
      { label: "Adresse", value: "Les Sources" },
      { label: "Blocs", value: "01" },
      { label: "État d'avancement", value: "100 %" },
    ],
    plans: MIX_PLANS_1
  },

  {
    id: 16,
    title: "BERYL",
    location: "Dely Ibrahim, Alger",
    description: "Idéalement nichée au cœur de la charmante commune de Dely Ibrahim...",
    image: "/assets/projets/beryl.png", 
    status: "FINIS",
    isNightMode: true,
    coverImage: "/assets/projets/couvertures/beryl.jpg",
    fullDescription: `Idéalement nichée au cœur de la charmante commune de Dély Ibrahim, la résidence Béryl se dresse dans un environnement des plus prisés, à proximité immédiate de prestigieux restaurants, de boutiques raffinées, d'établissements de remise en forme, et même d'un parc verdoyant.

Cette résidence d’exception déploie ses attraits luxueux dans une atmosphère intime, offrant à ses résidents une harmonie parfaite entre sécurité et bien-être. Elle est composée d’appartements haut standing, allant du F3 de 78 m² au F5 de 298 m².

Chaque logement est conçu avec soin pour offrir des espaces à vivre généreux et accueillants, agrémentés de plusieurs salles d'eau pour une commodité absolue, de balcons pittoresques et de terrasses baignées de soleil invitant la lumière naturelle et l'air frais à entrer. Au-delà des finitions impeccables, soigneusement proposées par Aymen Promotion Immobilière, vous aurez le plaisir de découvrir au sein de certaines propriétés exclusives de rafraîchissantes piscines intérieures, une véritable évasion aquatique pour vous ressourcer durant les chaudes journées d’été.`,
    gallery: [
      "/assets/projets/galeries/beryl/1.jpg",
      "/assets/projets/galeries/beryl/2.jpg",
      "/assets/projets/galeries/beryl/3.jpg",
    ],
    features: STANDARD_FEATURES,
    details: [
      { label: "Adresse", value: "Dely Ibrahim" },
      { label: "Blocs", value: "01" },
      { label: "État d'avancement", value: "100 %" },
    ],
    plans: MIX_PLANS_2
  },

  {
    id: 17,
    title: "BOIS DES CARS",
    location: "Dely Ibrahim, Alger",
    description: "La résidence Bois des Cars, sise à Dely Ibrahim...",
    image: "/assets/projets/bois-des-cars.png", 
    status: "FINIS",
    isNightMode: true,
    coverImage: "/assets/projets/couvertures/bois-des-cars.jpg",
    fullDescription: `La résidence Bois des Cars, sise à Dely Ibrahim, représente un projet exclusif et sophistiqué de la société Aymen Promotion Immobilière. Ce projet propose une gamme d'appartements spacieux, allant du F3 de 105 m² au F5 en duplex dépassant les 160 m². Outre les avantages inhérents à la localité de Dely Ibrahim, tels que les commerces de proximité et les infrastructures de divertissement et de bien-être, la résidence offre des commodités pratiques, simplifiant le quotidien de ses résidents. En effet, les divers appartements sont facilement accessibles depuis les différents niveaux du parking souterrain, bénéficient d'une isolation de qualité, sont équipés de systèmes de climatisation et de chauffage centralisés, ainsi que de cuisines et salles d'eau entièrement équipées.`,
    gallery: [
      "/assets/projets/galeries/bois-des-cars/1.jpg", 
    ],
    features: STANDARD_FEATURES,
    details: [
      { label: "Adresse", value: "Dely Ibrahim" },
      { label: "Blocs", value: "01" },
      { label: "État d'avancement", value: "100 %" },
    ],
    plans: MIX_PLANS_1
  },

  {
    id: 18,
    title: "PÉRIDOT",
    location: "Hydra, Alger",
    description: "Raffinée et discrète, la résidence Péridot...",
    image: "/assets/projets/peridot.png", 
    status: "FINIS",
    isNightMode: true,
    coverImage: "/assets/projets/couvertures/peridot.jpg",
    fullDescription: `Raffinée et discrète, la résidence Péridot d'Aymen Promotion Immobilière représente un véritable refuge de tranquillité, niché au cœur de la prestigieuse commune d'Hydra.

Idéalement situé à seulement 3 minutes des principaux axes autoroutiers, ce projet offre à ses résidents une multitude d'avantages pour rendre leur quotidien remarquablement agréable. La résidence propose une aire de détente et de jeux dédiée aux enfants, un accès sécurisé via un digicode, ainsi que des ascenseurs reliant les parkings souterrains aux différents étages. Les appartements, conçus avec minutie, offrent des aménagements intérieurs soignés et complets. Chaque espace est méticuleusement agencé, des cuisines entièrement équipées aux salles d'eau finement aménagées, chaque détail est pensé pour répondre aux besoins et aux attentes les plus exigeants.`,
    gallery: [
      "/assets/projets/galeries/peridot/1.jpg",
    ],
    features: STANDARD_FEATURES,
    details: [
      { label: "Adresse", value: "Hydra" },
      { label: "Blocs", value: "02" },
      { label: "État d'avancement", value: "100 %" },
    ],
    plans: MIX_PLANS_2
  },

  {
    id: 19,
    title: "CORAIL",
    location: "Hydra, Alger",
    description: "La résidence Corail, un joyau au cœur d'Hydra...",
    image: "/assets/projets/corail.png", 
    status: "FINIS",
    isNightMode: true,
    coverImage: "/assets/projets/couvertures/corail.png",
    fullDescription: `Découvrez la résidence Corail, un véritable bijou immobilier au cœur de Hydra !

Notre résidence offre une expérience de vie luxueuse et moderne grâce à des logements d'exception, allant du F3 de 77 m² au spacieux penthouses en F6 de 322 m². Chaque espace est conçu avec soin, mis en valeur par un design contemporain et des finitions de qualité qui sont réalisées par les meilleurs artisans du pays.

Située dans un quartier résidentiel calme et familial, la résidence Corail bénéficie également d'un accès facile et rapide à toutes les infrastructures de divertissement et commerces de proximité proposés par la commune dynamique de Hydra.

Pour ceux qui recherchent un niveau de confort optimal, certains appartements disposent de vastes terrasses avec piscine extérieure privée, idéales pour se détendre et profiter des beaux jours.

Chaque résident pourra personnaliser son expérience selon ses préférences. Aussi, les suites parentales avec dressings ajoutent une touche de raffinement, tandis que les vastes séjours et les cuisines modernes offrent des espaces conviviaux et pratiques pour toute la famille.`,
    gallery: [
      "/assets/projets/galeries/corail/1.png",
      "/assets/projets/galeries/corail/2.png",  
    ],
    features: STANDARD_FEATURES,
    details: [
      { label: "Adresse", value: "Hydra" },
      { label: "Blocs", value: "01" },
      { label: "État d'avancement", value: "100 %" },
    ],
    plans: MIX_PLANS_1
  },

  {
    id: 20,
    title: "OPALE",
    location: "El Achour, Alger",
    description: "La résidence Opale, une référence à El Achour...",
    image: "/assets/projets/opale.png", 
    status: "FINIS",
    isNightMode: true,
    coverImage: "/assets/projets/couvertures/opale.png",
    fullDescription: `Plongez au cœur de la résidence Opale d’Aymen Promotion Immobilière, là où confort, modernité et sécurité se marient joliment.

Au-delà de son emplacement stratégique à Oued Romane, El Achour, qui vous offre une connexion aisée avec la ville et les autres localités d’Alger, cette résidence bénéficie de prestations de qualité supérieure. Les appartements sont conçus pour baigner dans une luminosité constante grâce à des ouvertures pensivement positionnées, invitant les rayons du soleil à envahir chaque recoin, tandis qu'une brise rafraîchissante traverse chaque espace grâce à une conception favorisant une ventilation naturelle.

L'architecture innovante en forme de H redéfinit l'art de vivre avec des intérieurs traversants et multi-orientés s’étendant vers l'extérieur à travers de spacieux balcons et terrasses.

Au sein de ce projet immobilier, vous avez la possibilité de choisir parmi une gamme variée d'appartements, allant du studio douillet de 30 m² aux vastes F5 de 247 m².

Même si les typologies de ces logements divergent, ils ont en commun une finition d'une qualité supérieure qui témoigne d'un souci méticuleux du détail. Chaque espace est judicieusement agencé pour une utilisation optimale, vous permettant de vivre et de travailler au sein d’un cadre serein.`,
    gallery: [
      "/assets/projets/galeries/opale/1.JPG",
      "/assets/projets/galeries/opale/2.JPG",
      "/assets/projets/galeries/opale/3.JPG", 
      "/assets/projets/galeries/opale/4.JPG",    
    ],
    features: STANDARD_FEATURES,
    details: [
      { label: "Adresse", value: "El Achour" },
      { label: "Blocs", value: "02" },
      { label: "État d'avancement", value: "100 %" },
    ],
    plans: MIX_PLANS_2
  },

  {
    id: 21,
    title: "CITRINE",
    location: "Birkhadem, Alger",
    description: "La résidence Citrine, un projet d'exception à Birkhadem...",
    image: "/assets/projets/citrine.png", 
    status: "FINIS",
    isNightMode: true,
    coverImage: "/assets/projets/couvertures/citrine.png",
    fullDescription: `Plongez au cœur de la résidence Opale d’Aymen Promotion Immobilière, là où confort, modernité et sécurité se marient joliment.

Au-delà de son emplacement stratégique à Oued Romane, El Achour, qui vous offre une connexion aisée avec la ville et les autres localités d’Alger, cette résidence bénéficie de prestations de qualité supérieure. Les appartements sont conçus pour baigner dans une luminosité constante grâce à des ouvertures pensivement positionnées, invitant les rayons du soleil à envahir chaque recoin, tandis qu'une brise rafraîchissante traverse chaque espace grâce à une conception favorisant une ventilation naturelle.

L'architecture innovante en forme de H redéfinit l'art de vivre avec des intérieurs traversants et multi-orientés s’étendant vers l'extérieur à travers de spacieux balcons et terrasses.

Au sein de ce projet immobilier, vous avez la possibilité de choisir parmi une gamme variée d'appartements, allant du studio douillet de 30 m² aux vastes F5 de 247 m².

Même si les typologies de ces logements divergent, ils ont en commun une finition d'une qualité supérieure qui témoigne d'un souci méticuleux du détail. Chaque espace est judicieusement agencé pour une utilisation optimale, vous permettant de vivre et de travailler au sein d’un cadre serein.`,
    gallery: [
      "/assets/projets/galeries/citrine/1.JPG",
      "/assets/projets/galeries/citrine/2.JPG",
      "/assets/projets/galeries/citrine/3.JPG",
      "/assets/projets/galeries/citrine/4.JPG",
      "/assets/projets/galeries/citrine/5.JPG",
      "/assets/projets/galeries/citrine/6.png",
    ],
    features: STANDARD_FEATURES,
    details: [
      { label: "Adresse", value: "Birkhadem" },
      { label: "Blocs", value: "03" },
      { label: "État d'avancement", value: "100 %" },
    ],
    plans: MIX_PLANS_1
  },

  {
    id: 22,
    title: "ANGÉLITE",
    location: "Dar El Beïda, Alger",
    description: "Idéalement nichée au coeur de la charmante commune...",
    image: "/assets/projets/angelite.png", 
    status: "FINIS",
    isNightMode: true,
    coverImage: "/assets/projets/couvertures/angelite.jpg",   
    fullDescription: `Découvrez la splendeur de la Résidence Angélite, un bijou de l'immobilier signé Aymen Promotion, situé dans la charmante commune de Dar El Beïda.

Des appartements F3 de 70 m² aux somptueux F5 en attique de 207 m², chacun des logements a été pensé pour vous offrir un confort exceptionnel.

Certains s'étendent gracieusement sur de vastes terrasses, invitant à des moments de détente en plein air. Les espaces intérieurs, quant à eux, se distinguent également grâce à des séjours spacieux et des pièces à vivre baignés par la lumière naturelle. Aussi, comme pour chaque résidence d’Aymen Promotion Immobilière, les exigences de confort et de modernité sont respectées: salles d’eau équipées, cuisines ouvertes sur salon et ascenseurs qui donnent du parking aux divers niveaux du bâtiment.

Ce projet immobilier bénéficie d'un emplacement privilégié à proximité de centres commerciaux, de divertissements tels que le bowling et le karting, de piscines, ainsi que de centres de remise en forme pour une vie dynamique et équilibrée, offrant ainsi une harmonie parfaite entre confort intérieur et commodités extérieures.`,
    gallery: [  
      "/assets/projets/galeries/angelite/1.jpg",
      "/assets/projets/galeries/angelite/2.jpg",
      "/assets/projets/galeries/angelite/3.jpg",
    ],
    features: STANDARD_FEATURES,
    details: [
      { label: "Adresse", value: "Dar El Beïda" },
      { label: "Blocs", value: "01" },
      { label: "État d'avancement", value: "100 %" },
    ],
    plans: MIX_PLANS_2
  },

  {
    id: 23,
    title: "RUBIS",
    location: "El Achour, Alger",
    description: "Véritable bijou de la promotion immobilière Aymen...",
    image: "/assets/projets/rubis.png", 
    status: "FINIS",
    isNightMode: true,
    coverImage: "/assets/projets/couvertures/rubis.jpg",
    fullDescription: `Véritable bijou de la promotion immobilière Aymen, la résidence Rubis se situe au niveau de la commune de Oued Romane, dans un quartier à caractère résidentiel, calme et sécurisé.

Cette résidence haut standing, au design épuré, embellit subtilement le tissu urbain environnant et propose des prestations de qualité pour ses habitants. Au sein de la résidence, vous bénéficiez d’une sécurité garantie 24h/24, d’accès par ascenseur à tous les paliers à partir du parking, ainsi que de l’entretien et de la maintenance des équipements et espaces communs au quotidien.

Les espaces intérieurs sont également conçus avec minutie et une attention particulière est apportée aux détails. Du F2 de 60 m² idéalement agencé, au spacieux F4 de 143 m², les disponibilités répondent à tous les besoins.

Que vous recherchiez un espace confortable pour votre vie quotidienne ou un investissement immobilier prometteur, la résidence Rubis est l'adresse parfaite.`,
    gallery: [
      "/assets/projets/galeries/rubis/1.png",
      "/assets/projets/galeries/rubis/2.png",
      "/assets/projets/galeries/rubis/3.png",
      "/assets/projets/galeries/rubis/4.png",
      "/assets/projets/galeries/rubis/5.jpg",   
    ],
    features: STANDARD_FEATURES,
    details: [
      { label: "Adresse", value: "El Achour" },
      { label: "Blocs", value: "02" },
      { label: "État d'avancement", value: "100 %" },
    ],
    plans: RUBIS_PLANS
  },
  
  {
    id: 24,
    title: "ONYX",
    location: "Oued Romane, Alger",
    description: "Aymen Promotion Immobilière, reconnue pour ses résidences...",
    image: "/assets/projets/onyx.png", 
    status: "FINIS",
    isNightMode: true,
    coverImage: "/assets/projets/couvertures/onyx.jpg", 
    fullDescription: `Aymen Promotion Immobilière, reconnue pour ses résidences haut standing, tient une fois de plus sa promesse de qualité avec la résidence Onyx, située à Oued Romane. Cette somptueuse résidence achevée se compose de deux blocs, proposant une qualité de vie supérieure à ses résidents. Les appartements en simplex, allant du F2 au F5 et d'une superficie variant entre 52 m² et 157 m², sont conçus pour répondre à toutes les attentes.

Chaque détail a été soigneusement pensé pour offrir un confort optimal. Les cuisines et salles de bains sont équipées avec les meilleurs matériaux et équipements, garantissant ainsi une expérience de vie agréable au quotidien. La résidence Onyx bénéficie de tous les équipements et services haut de gamme qui caractérisent les résidences d'Aymen Promotion. Les résidents profiteront ainsi d'accès contrôlés via digicode, de places de parking, et d'un ascenseur depuis le sous-sol. Découvrez une nouvelle dimension de vie haut standing grâce aux appartements des résidences Aymen Promotion immobilière !`,
    gallery: [
      "/assets/projets/galeries/onyx/1.jpg",
    ],
    features: STANDARD_FEATURES,
    details: [
      { label: "Adresse", value: "Oued Romane" },
      { label: "Blocs", value: "02" },
      { label: "État d'avancement", value: "100 %" },
    ],
    plans: MIX_PLANS_1
  },

  {
    id: 25,
    title: "EL MORDJANE",
    location: "Said Hamdine, Alger",
    description: "Au cœur d'Alger, dans le quartier de Said Hamdine...",
    image: "/assets/projets/el-mordjane.png", 
    status: "FINIS",
    isNightMode: true,
    coverImage: "/assets/projets/couvertures/mordjan.jpg",
    fullDescription: `Au cœur d'Alger, dans le quartier de Saïd Hamdine, à quelques pas de la prestigieuse rue Sidi Yahia, se dresse fièrement la résidence El Mordjane d’Aymen Promotion Immobilière. Cette résidence propose une sélection variée de logements, allant du F3 de 88 m² au spacieux F5 de 162 m², répondant parfaitement aux besoins divers de sa clientèle exigeante.

Autour de la résidence, on retrouve des lieux de vie élégants tels que des restaurants chics, des cafés branchés et des boutiques haut de gamme, offrant ainsi une expérience urbaine vibrante. L'intérieur de la résidence est conçu avec une finesse et une attention aux détails qui crée un cadre de vie véritablement unique.`,
    gallery: [
      "/assets/projets/galeries/el-mordjane/1.jpg",
    ],
    features: STANDARD_FEATURES,
    details: [
      { label: "Adresse", value: "Said Hamdine" },
      { label: "Blocs", value: "02" },
      { label: "État d'avancement", value: "100 %" },
    ],
    plans: MIX_PLANS_2
  },

  {
    id: 26,
    title: "Aymen",
    location: "Birkhadem, Alger",
    description: "Située à proximité de la petite ville Birkhadem...",
    image: "/assets/projets/136.png", 
    status: "FINIS",
    isNightMode: true,  
    coverImage: "/assets/projets/couvertures/aymen.jpg",            
    fullDescription: `Située à proximité de la petite ville Birkhadem, plus précisément à Tixeraïne, la résidence Aymen se distingue en tant que projet emblématique ayant marqué le début de l'aventure d’Aymen Promotion Immobilière.

Cette résidence exceptionnelle s'ouvre sur une vaste réception aux allures hôtelières, accessible même par une rampe dédiée aux personnes à mobilité réduite (PMR). Les deux blocs architecturaux sont harmonieusement reliés par une cour agrémentée d'une aire de jeux pour les plus jeunes. L'accès aux appartements se fait aisément grâce à des ascenseurs reliant les différents niveaux de stationnement souterrain du projet.

Offrant une variété d'options, les appartements de la résidence Aymen s'étendent du F3 de 59 m² à des unités spacieuses de 198 m². En outre, le projet s'engage à assurer confort et praticité en intégrant une crèche et une salle de sport au sein de la résidence, contribuant ainsi à une vie active et épanouissante pour ses résidents.`,
    gallery: [
      "/assets/projets/galeries/Aymen/1.JPG",
      "/assets/projets/galeries/Aymen/2.JPG",
      "/assets/projets/galeries/Aymen/3.JPG",
      "/assets/projets/galeries/Aymen/4.JPG",
      "/assets/projets/galeries/Aymen/5.JPG",
      "/assets/projets/galeries/Aymen/6.JPG",
      "/assets/projets/galeries/Aymen/7.JPG",
    ],
    features: STANDARD_FEATURES,
    details: [
      { label: "Adresse", value: "Birkhadem" },
      { label: "Blocs", value: "05" },
      { label: "État d'avancement", value: "100 %" },
    ],
    plans: MIX_PLANS_1
  },
  
  {
    id: 27,
    title: "COQUELICOT",
    location: "Hydra, Alger",
    description: "Découvrez le nouvel opus urbain exceptionnel...",
    image: "/assets/projets/coquelicot.png", 
    status: "FINIS",
    isNightMode: true,  
    coverImage: "/assets/projets/couvertures/coquelicot.png",            
    fullDescription: `Découvrez le nouvel opus urbain exceptionnel d’Aymen Promotion Immobilière, pour un style de vie luxueux et des prestations de qualité supérieure !

Située dans un quartier prestigieux dans les hauteurs de Hydra, la résidence Coquelicot est composée de 4 blocs idéalement orientés ainsi que d’une esplanade aménagée qui se double d’une aire de jeux pour les enfants et d’une aire de repos pour les adultes.

Ce projet immobilier propose une gamme d'appartements haut standing allant du 3 pièces en simplex au 6 pièces en duplex. Chaque appartement est soigneusement conçu pour offrir un espace de vie pratique empreint d’élégance. Les balcons et les terrasses ensoleillés prolongent votre espace de vie vers l'extérieur, créant un lien harmonieux avec la nature environnante. Les superficies, quant à elles, varient entre 63 m² et 403 m², de quoi répondre aux attentes de tous les potentiels acquéreurs.

Aussi, vous pouvez vivre en toute sérénité en sachant que votre foyer est protégé en permanence, le tout au sein d'un cadre de vie relaxant !`,
    gallery: [
      "/assets/projets/galeries/coquelicot/1.JPG",
      "/assets/projets/galeries/coquelicot/2.JPG",
      "/assets/projets/galeries/coquelicot/3.JPG",
      "/assets/projets/galeries/coquelicot/4.JPG",
      "/assets/projets/galeries/coquelicot/5.JPG",
    ],
    features: STANDARD_FEATURES,
    details: [
      { label: "Adresse", value: "Hydra" },
      { label: "Blocs", value: "04" },
      { label: "État d'avancement", value: "100 %" },
    ],
    plans: MIX_PLANS_2
  },

  {
    id: 28,
    title: "PERLA",
    location: "Dar El Beïda, Alger",
    description: "Aymen Promotion Immobilière, reconnue pour ses résidences...",
    image: "/assets/projets/perla.png", 
    status: "FINIS",
    isNightMode: true,  
    coverImage: "/assets/projets/couvertures/perla.png",            
    fullDescription: `Qui ne rêve pas de la quiétude et de la tranquillité que propose le projet phare d’ Aymen Promotion Immobilière : Perla.

L'aspect contemporain de cette résidence intimiste située à Dar el Beïda se marie parfaitement à la praticité de son agencement intérieur. Elle offre également une multitude de typologies d'appartements, variant entre le F3 à 90 m² et le Penthouse en F6 à 310 m².

Un soin tout particulier est apporté aux finitions intérieures de cette résidence. Les appartements disposent de salles d’eau et cuisines équipées avec les dernières technologies, de climatisation et de chauffage centralisés et d’une isolation phonique, visuelle et thermique pour une intimité optimale. Aussi, plusieurs appartements se prolongent sur de vastes terrasses, pour profiter d’une magnifique vue et du soleil en famille.

La résidence offre également une aire de jeu sécurisée pour le divertissement des enfants, ainsi qu'un parking. De plus, elle bénéficie d'un accès rapide aux autoroutes, aux centres commerciaux et à l'aéroport d'Alger Houari Boumediene.`,
    gallery: [
      "/assets/projets/galeries/perla/1.JPG",
      "/assets/projets/galeries/perla/2.JPG",
      "/assets/projets/galeries/perla/3.JPG",
      "/assets/projets/galeries/perla/4.JPG",
      "/assets/projets/galeries/perla/5.JPG",
      "/assets/projets/galeries/perla/6.JPG",
      "/assets/projets/galeries/perla/7.JPG",
    ],
    features: STANDARD_FEATURES,    
    details: [
      { label: "Adresse", value: "Dar El Beïda" },  
      { label: "Blocs", value: "02" },
      { label: "État d'avancement", value: "100 %" },
     
    ],
    plans: MIX_PLANS_1
  },
  
];

export const LOCALITIES: Locality[] = [
  {
    id: 1,
    name: "KOUBA, ALGER",
    description: "Située sur les hauteurs d'Alger, Kouba est un quartier résidentiel prisé pour son cadre de vie agréable et sa proximité avec le centre-ville. Elle offre un équilibre parfait entre calme et accessibilité, avec de nombreuses commodités à proximité.",
    image: "/assets/locality-icon/kouba-icon.png",
    heroImage: "/assets/locality/kouba.png",
  },
  {
    id: 2,
    name: "HYDRA, ALGER",
    description: "Fièrement dressée sur les hauteurs d'Alger, Hydra est l'un des quartiers les plus prestigieux de la capitale. Réputée pour ses ambassades, ses résidences de luxe et ses espaces verts, elle incarne l'élégance et le raffinement.",
    image: "/assets/locality-icon/hydra-icon.png",
    heroImage: "/assets/locality/hydra.png",
  },
  {
    id: 3,
    name: "BIRKHADEM, ALGER",
    description: "Autrefois célèbre pour ses vastes vergers, Birkhadem a su préserver son âme tout en se développant harmonieusement. Ce quartier résidentiel offre un cadre de vie paisible à proximité des principaux axes de la capitale.",
    image: "/assets/locality-icon/birkhadem-icon.png",
    heroImage: "/assets/locality/birkhadem.png",
  },
  {
    id: 4,
    name: "DAR EL BEIDA, ALGER",
    description: "Porte d'entrée stratégique d'Alger avec son aéroport international, Dar El Beida est un pôle économique en pleine expansion. Le quartier allie dynamisme commercial et zones résidentielles en développement.",
    image: "/assets/locality-icon/dar-el-beida-icon.png",
    heroImage: "/assets/locality/dar-el-beida.png",
  },
  {
    id: 5,
    name: "DELY IBRAHIM, ALGER",
    description: "Dely Ibrahim est une commune prisée pour son cadre verdoyant et sa qualité de vie. Ses villas cossues et ses résidences modernes en font un lieu de résidence recherché par les familles.",
    image: "/assets/locality-icon/dely-ibrahim-icon.png",
    heroImage: "/assets/locality/dely-ibrahim.png",
  },
  {
    id: 6,
    name: "BAB EZZOUAR, ALGER",
    description: "Pôle universitaire et technologique majeur, Bab Ezzouar est un quartier dynamique et moderne. Son grand centre commercial, ses universités et ses zones d'activités en font un lieu de vie animé et connecté.",
    image: "/assets/locality-icon/beb-ezzouar-icon.png",
    heroImage: "/assets/locality/beb-ezzouar.png",
  },
  {
    id: 7,
    name: "CHÉRAGA, ALGER",
    description: "Située sur les hauteurs d'Alger, Chéraga est une commune résidentielle qui a su préserver son caractère authentique. Elle offre un cadre de vie agréable avec des quartiers calmes et verdoyants.",
    image: "/assets/locality-icon/cheraga-icon.png",
    heroImage: "/assets/locality/cheraga.png",
  },
  {
    id: 8,
    name: "DRARIA, ALGER",
    description: "Fièrement dressée sur les hauteurs d'Alger, Draria est un quartier résidentiel en plein essor. Elle séduit par son cadre de vie agréable et sa proximité avec les principaux axes routiers.",
    image: "/assets/locality-icon/draria-icon.png",
    heroImage: "/assets/locality/draria.png",
  },
  {
    id: 9,
    name: "EL ACHOUR, ALGER",
    description: "Voisine de Draria et de Dely Ibrahim, El Achour est un quartier résidentiel paisible qui offre un cadre de vie agréable à ses habitants. Ses rues calmes et ses espaces verts en font un lieu de résidence prisé.",
    image: "/assets/locality-icon/el-achour-icon.png",
    heroImage: "/assets/locality/el-achour.png",
  },
  {
    id: 10,
    name: "SAID HAMDINE, ALGER",
    description: "Quartier résidentiel et administratif, Said Hamdine est réputé pour son cadre de vie agréable et sa proximité avec le centre-ville. Ses rues arborées et ses résidences de standing en font un lieu de résidence prisé.",
    image: "/assets/locality-icon/said-hamdine-icon.png",
    heroImage: "/assets/locality/said-hamdine.png",
  },
  {
    id: 11,
    name: "RUISSEAU, ALGER",
    description: "Carrefour stratégique entre le centre-ville et les hauteurs d'Alger, le Ruisseau est un quartier dynamique et bien desservi. Il offre un cadre de vie urbain avec toutes les commodités à proximité.",
    image: "/assets/locality-icon/ruisseau-icon.png",
    heroImage: "/assets/locality/ruisseau.png",
  },
];