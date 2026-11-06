import { Brand, Promotion, Asset, User, PortalUpdate, ActivityLog } from '../types';

export const DEMO_PASSWORD = 'Demo123!';

export const INITIAL_USERS: User[] = [
  {
    id: 'user_admin',
    name: 'Admin Alviestetic',
    email: 'admin@demo.com',
    company: 'Alviestetic Group S.L.',
    role: 'admin',
    assignedBrandIds: [
      'brand_indiba',
      'brand_mesoestetic',
      'brand_phyts',
      'brand_gernetic',
      'brand_innovapro',
      'brand_starvac',
      'brand_sorisa',
      'brand_dlucanni',
      'brand_weelko',
      'brand_naggura',
      'brand_alvidepil',
      'brand_wishpro',
      'brand_visioderm',
      'brand_silhouettone',
      'brand_innutricosmetica'
    ],
    status: 'active',
    createdAt: '2026-01-10T09:00:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    lastLogin: '2026-11-02T08:15:00Z'
  },
  {
    id: 'user_laura',
    name: 'Laura Martín',
    email: 'laura@cliente-demo.es',
    company: 'Clínica Dermatológica & Estética Martín',
    role: 'client',
    assignedBrandIds: ['brand_indiba', 'brand_mesoestetic', 'brand_phyts', 'brand_innutricosmetica'],
    status: 'active',
    createdAt: '2026-03-15T11:20:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    lastLogin: '2026-11-01T17:40:00Z'
  },
  {
    id: 'user_carlos',
    name: 'Carlos Ruiz',
    email: 'carlos@cliente-demo.es',
    company: 'Centro Médico-Estético Ruiz & Wellness',
    role: 'client',
    assignedBrandIds: ['brand_naggura', 'brand_starvac', 'brand_innovapro', 'brand_visioderm', 'brand_silhouettone'],
    status: 'active',
    createdAt: '2026-04-02T14:10:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    lastLogin: '2026-10-29T10:05:00Z'
  },
  {
    id: 'user_maria',
    name: 'María López',
    email: 'maria@cliente-demo.es',
    company: 'Instituto Facial & Corporal María López',
    role: 'client',
    assignedBrandIds: ['brand_mesoestetic', 'brand_gernetic'],
    status: 'invited',
    createdAt: '2026-10-20T16:45:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_BRANDS: Brand[] = [
  {
    id: 'brand_indiba',
    name: 'INDIBA',
    slug: 'indiba',
    category: 'Aparatología Médico-Estética & Radiofrecuencia',
    description: 'Pioneros mundiales en tecnología de radiofrecuencia monopolar a 448 kHz para bioestimulación celular, rejuvenecimiento facial y remodelación tisular profunda.',
    logoUrl: '/src/assets/images/brand_indiba_device_1793692727283.jpg',
    coverImageUrl: 'https://alviestetic.es/wp-content/uploads/2023/10/indiba-1.jpeg',
    sharepointFolderUrl: 'https://alviestetic.sharepoint.com/sites/Marketing/Marcas/Indiba',
    sharepointDriveId: 'b!Indiba_Graph_Drive_01',
    sharepointFolderPath: '/General/Marketing/2026/Indiba',
    createdAt: '2026-01-15'
  },
  {
    id: 'brand_mesoestetic',
    name: 'MESOESTETIC',
    slug: 'mesoestetic',
    category: 'Alta Cosmética Médica & Nutricosmética',
    description: 'Referente internacional en despigmentación (Cosmelan, Dermamelan), mesoterapia médica, peelings químicos profesionales y soluciones antiedad de máxima evidencia clínica.',
    logoUrl: '/src/assets/images/brand_mesoestetic_cosmetics_1793692727373.jpg',
    coverImageUrl: 'https://alviestetic.es/wp-content/uploads/2023/11/mesoestetic.jpg',
    sharepointFolderUrl: 'https://alviestetic.sharepoint.com/sites/Marketing/Marcas/Mesoestetic',
    sharepointDriveId: 'b!Mesoestetic_Graph_Drive_02',
    sharepointFolderPath: '/General/Marketing/2026/Mesoestetic',
    createdAt: '2026-01-20'
  },
  {
    id: 'brand_phyts',
    name: "PHYT'S",
    slug: 'phyts',
    category: 'Alta Cosmética Orgánica & Nutricosmética Certificada',
    description: 'Tratamientos profesionales de alta cosmética biológica y natural 100% certificada en ampollas de dosis única de vidrio, libres de químicos y conservantes sintéticos.',
    logoUrl: '/src/assets/images/brand_phyts_organic_1793692728581.jpg',
    coverImageUrl: 'https://alviestetic.es/wp-content/uploads/2023/11/1920x600-baniere-homepage-printemps.jpg',
    sharepointFolderUrl: 'https://alviestetic.sharepoint.com/sites/Marketing/Marcas/Phyts',
    sharepointDriveId: 'b!Phyts_Graph_Drive_03',
    sharepointFolderPath: '/General/Marketing/2026/Phyts',
    createdAt: '2026-02-01'
  },
  {
    id: 'brand_naggura',
    name: 'NAGGURA',
    slug: 'naggura',
    category: 'Camillas & Mobiliario Clínico Premium',
    description: 'Diseño vanguardista europeo y ergonomía en camillas de tratamiento motorizadas para medicina estética, clínicas dermatológicas y fisioterapia avanzada.',
    logoUrl: '/src/assets/images/brand_naggura_bed_1793692728849.jpg',
    coverImageUrl: 'https://alviestetic.es/wp-content/uploads/2023/11/4-foto-home-naggura-productos-gamas-13-06-2022-01_to_webp_09-10-2023-09-49-33-scaled.webp',
    sharepointFolderUrl: 'https://alviestetic.sharepoint.com/sites/Marketing/Marcas/Naggura',
    sharepointDriveId: 'b!Naggura_Graph_Drive_04',
    sharepointFolderPath: '/General/Marketing/2026/Naggura',
    createdAt: '2026-02-10'
  },
  {
    id: 'brand_starvac',
    name: 'STARVAC',
    slug: 'starvac',
    category: 'Aparatología Médico-Estética & Drenaje Celular',
    description: 'Sistemas patentados de estiramiento tisular, presoterapia y estimulación celular subcutánea para drenaje linfático y celulitis.',
    logoUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80',
    coverImageUrl: 'https://alviestetic.es/wp-content/uploads/2023/12/lb145987-scaled-1.jpg',
    sharepointFolderUrl: 'https://alviestetic.sharepoint.com/sites/Marketing/Marcas/Starvac',
    sharepointDriveId: 'b!Starvac_Graph_Drive_05',
    sharepointFolderPath: '/General/Marketing/2026/Starvac',
    createdAt: '2026-02-15'
  },
  {
    id: 'brand_innovapro',
    name: 'INNOVAPRO',
    slug: 'innovapro',
    category: 'Láser Médico-Estético & Fotodepilación',
    description: 'Plataformas de láser de diodo de alta potencia, sistemas de depilación médica y radiofrecuencia fraccionada de alto rendimiento.',
    logoUrl: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=800&auto=format&fit=crop&q=80',
    coverImageUrl: 'https://alviestetic.es/wp-content/uploads/2023/11/portada-innovapro.png',
    sharepointFolderUrl: 'https://alviestetic.sharepoint.com/sites/Marketing/Marcas/Innovapro',
    sharepointDriveId: 'b!Innovapro_Graph_Drive_06',
    sharepointFolderPath: '/General/Marketing/2026/Innovapro',
    createdAt: '2026-02-20'
  },
  {
    id: 'brand_gernetic',
    name: 'GERNÉTIC',
    slug: 'gernetic',
    category: 'Alta Cosmética Celular Biológica',
    description: 'Fórmulas celulares biológicas pioneras en nutrición dérmica a través de fitoterapias, vitaminas y aminoácidos para tratamientos de cabina intensivos.',
    logoUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80',
    coverImageUrl: 'https://alviestetic.es/wp-content/uploads/2023/11/gernetic.png',
    sharepointFolderUrl: 'https://alviestetic.sharepoint.com/sites/Marketing/Marcas/Gernetic',
    sharepointDriveId: 'b!Gernetic_Graph_Drive_07',
    sharepointFolderPath: '/General/Marketing/2026/Gernetic',
    createdAt: '2026-03-01'
  },
  {
    id: 'brand_dlucanni',
    name: 'DLUCANNI',
    slug: 'dlucanni',
    category: 'Alta Cosmética Profesional de Cabina',
    description: 'Cosmética científica aplicada al diagnóstico y tratamiento personalizado de las afecciones estéticas cutáneas en centros especializados.',
    logoUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80',
    coverImageUrl: 'https://alviestetic.es/wp-content/uploads/2023/11/corporal-basic.jpg',
    sharepointFolderUrl: 'https://alviestetic.sharepoint.com/sites/Marketing/Marcas/DLucanni',
    sharepointDriveId: 'b!DLucanni_Graph_Drive_08',
    sharepointFolderPath: '/General/Marketing/2026/DLucanni',
    createdAt: '2026-03-05'
  },
  {
    id: 'brand_sorisa',
    name: 'SORISA',
    slug: 'sorisa',
    category: 'Aparatología Médico-Estética',
    description: 'Equipos integrales de fototerapia, ultrasonidos y remodelación corporal con décadas de experiencia en el sector médico-estético.',
    logoUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80',
    coverImageUrl: 'https://alviestetic.es/wp-content/uploads/2023/11/portada-marca.png',
    sharepointFolderUrl: 'https://alviestetic.sharepoint.com/sites/Marketing/Marcas/Sorisa',
    sharepointDriveId: 'b!Sorisa_Graph_Drive_09',
    sharepointFolderPath: '/General/Marketing/2026/Sorisa',
    createdAt: '2026-03-10'
  },
  {
    id: 'brand_weelko',
    name: 'WEELKO',
    slug: 'weelko',
    category: 'Equipamiento Clínico, Mobiliario & Accesorios',
    description: 'Soluciones completas de mobiliario ergonómico, carritos auxiliares, lupas dermatológicas y aparatología básica para cabinas profesionales.',
    logoUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80',
    coverImageUrl: 'https://alviestetic.es/wp-content/uploads/2023/11/portada-weelko.png',
    sharepointFolderUrl: 'https://alviestetic.sharepoint.com/sites/Marketing/Marcas/Weelko',
    sharepointDriveId: 'b!Weelko_Graph_Drive_10',
    sharepointFolderPath: '/General/Marketing/2026/Weelko',
    createdAt: '2026-03-15'
  },
  {
    id: 'brand_alvidepil',
    name: 'ALVIDEPIL',
    slug: 'alvidepil',
    category: 'Sistemas de Depilación Profesional Alviestetic',
    description: 'Línea de formulación propia de Alviestetic en ceras de baja fusión, resinas naturales y cosméticos pre y post-depilación para centros de estética.',
    logoUrl: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=800&auto=format&fit=crop&q=80',
    coverImageUrl: 'https://alviestetic.es/wp-content/uploads/2023/11/alvidepil-marca2.jpg',
    sharepointFolderUrl: 'https://alviestetic.sharepoint.com/sites/Marketing/Marcas/Alvidepil',
    sharepointDriveId: 'b!Alvidepil_Graph_Drive_11',
    sharepointFolderPath: '/General/Marketing/2026/Alvidepil',
    createdAt: '2026-03-20'
  },
  {
    id: 'brand_wishpro',
    name: 'WISHPRO',
    slug: 'wishpro',
    category: 'Aparatología de Magnetoforesis & Cápsulas Activas',
    description: 'Dispositivo facial de tecnología magnética combinada con cápsulas monodosis infusionadas con ácido hialurónico, colágeno y péptidos tensores.',
    logoUrl: 'https://images.unsplash.com/photo-1608248597359-71a2a4b87c7b?w=800&auto=format&fit=crop&q=80',
    coverImageUrl: 'https://alviestetic.es/wp-content/uploads/2023/11/home-slide0.jpg',
    sharepointFolderUrl: 'https://alviestetic.sharepoint.com/sites/Marketing/Marcas/Wishpro',
    sharepointDriveId: 'b!Wishpro_Graph_Drive_12',
    sharepointFolderPath: '/General/Marketing/2026/Wishpro',
    createdAt: '2026-03-25'
  },
  {
    id: 'brand_visioderm',
    name: 'VISIODERM',
    slug: 'visioderm',
    category: 'Aparatología Médico-Estética & Diagnóstico Cutáneo Digital',
    description: 'Sistemas avanzados de imagenología y análisis dermatoscópico digital multiparamétrico para diagnóstico facial, medición de hidratación, poros y manchas.',
    logoUrl: '/src/assets/images/brand_visioderm_diag_1793693215149.jpg',
    coverImageUrl: 'https://alviestetic.es/wp-content/uploads/2023/12/fond-degrade-vdc-site-visage2.webp',
    sharepointFolderUrl: 'https://alviestetic.sharepoint.com/sites/Marketing/Marcas/Visioderm',
    sharepointDriveId: 'b!Visioderm_Graph_Drive_13',
    sharepointFolderPath: '/General/Marketing/2026/Visioderm',
    createdAt: '2026-03-28'
  },
  {
    id: 'brand_silhouettone',
    name: 'SILHOUET-TONE',
    slug: 'silhouet-tone',
    category: 'Depilación Eléctrica Médica & Microdermoabrasión',
    description: 'Líder internacional en equipos de depilación médica definitiva por electrólisis y termólisis computarizada, micropigmentación y exfoliación clínica de alta precisión.',
    logoUrl: 'https://images.unsplash.com/photo-1512290900672-1f55b9679199?w=800&auto=format&fit=crop&q=80',
    coverImageUrl: 'https://alviestetic.es/wp-content/uploads/2025/12/electrolisis.jpg',
    sharepointFolderUrl: 'https://alviestetic.sharepoint.com/sites/Marketing/Marcas/SilhouetTone',
    sharepointDriveId: 'b!SilhouetTone_Graph_Drive_14',
    sharepointFolderPath: '/General/Marketing/2026/SilhouetTone',
    createdAt: '2026-04-01'
  },
  {
    id: 'brand_innutricosmetica',
    name: 'IN. NUTRICOSMÉTICA',
    slug: 'in-nutricosmetica',
    category: 'Nutricosmética Clínica & Suplementación Biológica',
    description: 'Fórmulas orales de biotecnología celular, colágeno marino hidrolizado, antioxidantes y complejos bioactivos sinérgicos para potenciar los tratamientos estéticos desde el interior.',
    logoUrl: '/src/assets/images/brand_innutricosmetica_1793693214883.jpg',
    coverImageUrl: 'https://alviestetic.es/wp-content/uploads/2023/11/in-2.png',
    sharepointFolderUrl: 'https://alviestetic.sharepoint.com/sites/Marketing/Marcas/IN_Nutricosmetica',
    sharepointDriveId: 'b!IN_Nutricosmetica_Graph_Drive_15',
    sharepointFolderPath: '/General/Marketing/2026/IN_Nutricosmetica',
    createdAt: '2026-04-05'
  }
];

export const INITIAL_PROMOTIONS: Promotion[] = [
  // INDIBA
  {
    id: 'promo_indiba_deep_beauty',
    brandId: 'brand_indiba',
    title: 'Campaña INDIBA Deep Beauty 2026 — Protocolos 448 kHz',
    description: 'Kit de prensa y marketing clínico para el lanzamiento de los nuevos protocolos faciales y corporales de rejuvenecimiento tisular.',
    season: 'Primavera 2026',
    coverImageUrl: '/src/assets/images/brand_indiba_device_1793692727283.jpg',
    sharepointSubfolderPath: '/Indiba/Promociones/2026-03_Deep_Beauty_Campaign',
    publishedAt: '2026-03-01T10:00:00Z',
    assetCount: 6
  },
  {
    id: 'promo_indiba_remodela',
    brandId: 'brand_indiba',
    title: 'Campaña Remodelación Corporal & Drenaje Dérmico',
    description: 'Material publicitario para vitrinas, spots de vídeo para pantallas en sala de espera y banners para captación de citas en clínicas.',
    season: 'Verano 2026 Preview',
    coverImageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1600&auto=format&fit=crop&q=80',
    sharepointSubfolderPath: '/Indiba/Promociones/2026-04_Remodelacion_Corporal',
    publishedAt: '2026-04-05T11:30:00Z',
    assetCount: 4
  },

  // MESOESTETIC
  {
    id: 'promo_mesoestetic_cosmelan',
    brandId: 'brand_mesoestetic',
    title: 'Método Cosmelan & Dermamelan 2026 — Campaña Despigmentante',
    description: 'Fotografía médica de antes/después, fichas técnicas de peeling químico médico y material para redes sociales de clínicas asociadas.',
    season: 'Temporada Oficial 2026',
    coverImageUrl: '/src/assets/images/brand_mesoestetic_cosmetics_1793692727373.jpg',
    sharepointSubfolderPath: '/Mesoestetic/Promociones/2026-02_Cosmelan_Method',
    publishedAt: '2026-02-15T09:00:00Z',
    assetCount: 6
  },
  {
    id: 'promo_mesoestetic_peels',
    brandId: 'brand_mesoestetic',
    title: 'Mesopeel & Ampollas Estériles — Guías de Cabina',
    description: 'Catálogo de peelings combinados, posters técnicos para salas de tratamiento y vídeos demostrativos de aplicación dérmica.',
    season: 'Invierno - Primavera 2026',
    coverImageUrl: 'https://images.unsplash.com/photo-1608248597359-71a2a4b87c7b?w=1600&auto=format&fit=crop&q=80',
    sharepointSubfolderPath: '/Mesoestetic/Promociones/2026-01_Mesopeel_Pro',
    publishedAt: '2026-01-20T14:15:00Z',
    assetCount: 4
  },

  // PHYT'S
  {
    id: 'promo_phyts_bio_radiance',
    brandId: 'brand_phyts',
    title: 'Tratamientos Biológicos en Ampollas de Vidrio',
    description: 'Fotografía comercial editorial de ampollas monodosis de activos puros, pósteres ecológicos y spot de cabina orgánica.',
    season: 'Primavera 2026',
    coverImageUrl: '/src/assets/images/brand_phyts_organic_1793692728581.jpg',
    sharepointSubfolderPath: '/Phyts/Promociones/2026-03_Bio_Active_Ampoules',
    publishedAt: '2026-03-10T12:00:00Z',
    assetCount: 5
  },

  // NAGGURA
  {
    id: 'promo_naggura_swop',
    brandId: 'brand_naggura',
    title: 'Colección Camillas Motorizadas SWOP & N’RUN 2026',
    description: 'Fotografías en alta definición para catálogos de arquitectura clínica, vídeos 360° y planos técnicos acotados.',
    season: 'Lanzamiento 2026',
    coverImageUrl: '/src/assets/images/brand_naggura_bed_1793692728849.jpg',
    sharepointSubfolderPath: '/Naggura/Promociones/2026-02_Swop_Collection',
    publishedAt: '2026-02-25T16:00:00Z',
    assetCount: 5
  },

  // STARVAC
  {
    id: 'promo_starvac_dxt',
    brandId: 'brand_starvac',
    title: 'DXTwin Stretching Celular — Material Publicitario',
    description: 'Kits para vitrina en clínicas, infografías de fisiología celular y spots demostrativos de drenaje para pantallas publicitarias.',
    season: 'Campaña 2026',
    coverImageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1600&auto=format&fit=crop&q=80',
    sharepointSubfolderPath: '/Starvac/Promociones/2026-03_DXTwin_Pro',
    publishedAt: '2026-03-18T10:30:00Z',
    assetCount: 4
  },

  // VISIODERM
  {
    id: 'promo_visioderm_connect',
    brandId: 'brand_visioderm',
    title: 'Diagnóstico Cutáneo Digital Visioderm Connect 2026',
    description: 'Manuales de imagenología clínica, plantillas de informe facial para pacientes y recursos gráficos de visualización dermatoscópica.',
    season: 'Temporada Oficial 2026',
    coverImageUrl: '/src/assets/images/brand_visioderm_diag_1793693215149.jpg',
    sharepointSubfolderPath: '/Visioderm/Promociones/2026-03_Visioderm_Connect',
    publishedAt: '2026-03-22T10:00:00Z',
    assetCount: 4
  },

  // SILHOUET-TONE
  {
    id: 'promo_silhouettone_evolution',
    brandId: 'brand_silhouettone',
    title: 'Sistemas de Electrólisis Evolution 7 & Microdermoabrasión',
    description: 'Protocolos de depilación eléctrica definitiva pelo a pelo, guías de ajuste de frecuencia y fichas para consentimiento de pacientes.',
    season: 'Primavera 2026',
    coverImageUrl: 'https://images.unsplash.com/photo-1512290900672-1f55b9679199?w=1600&auto=format&fit=crop&q=80',
    sharepointSubfolderPath: '/SilhouetTone/Promociones/2026-03_Evolution_Series',
    publishedAt: '2026-03-25T11:00:00Z',
    assetCount: 3
  },

  // IN. NUTRICOSMÉTICA
  {
    id: 'promo_innutricosmetica_elixirs',
    brandId: 'brand_innutricosmetica',
    title: 'Gama Elixires Celulares & Colágeno Boost — Colección 2026',
    description: 'Catálogo de prescripción nutricosmética en cabina, posters para expositor de mostrador y vídeos de ritual matinal de belleza.',
    season: 'Lanzamiento 2026',
    coverImageUrl: '/src/assets/images/brand_innutricosmetica_1793693214883.jpg',
    sharepointSubfolderPath: '/IN_Nutricosmetica/Promociones/2026-04_Cellular_Elixirs',
    publishedAt: '2026-04-01T09:30:00Z',
    assetCount: 4
  }
];

export const INITIAL_ASSETS: Asset[] = [
  // INDIBA: Deep Beauty
  {
    id: 'asset_indiba_01',
    promotionId: 'promo_indiba_deep_beauty',
    brandId: 'brand_indiba',
    title: 'INDIBA Dispositivo Clínico 448 kHz en Sala de Tratamiento 4K',
    description: 'Fotografía principal del equipo INDIBA con pantalla táctil y manípulo capacitivo en suite clínica de medicina estética.',
    type: 'image',
    format: 'JPG',
    fileSizeBytes: 5200000,
    fileSizeFormatted: '5.2 MB',
    dimensions: '3840 × 2560',
    url: '/src/assets/images/brand_indiba_device_1793692727283.jpg',
    thumbnailUrl: '/src/assets/images/brand_indiba_device_1793692727283.jpg',
    downloadUrl: '/src/assets/images/brand_indiba_device_1793692727283.jpg',
    publishedAt: '2026-03-01T10:00:00Z',
    tags: ['aparatologia', 'indiba', 'radiofrecuencia', 'clinica', '448khz']
  },
  {
    id: 'asset_indiba_02',
    promotionId: 'promo_indiba_deep_beauty',
    brandId: 'brand_indiba',
    title: 'Spot Audiovisual Campaña Deep Beauty 30s',
    description: 'Vídeo corporativo de 30 segundos con modelo demostrando la aplicación del manípulo capacitivo y la sensación de confort.',
    type: 'video',
    format: 'MP4',
    fileSizeBytes: 24800000,
    fileSizeFormatted: '24.8 MB',
    dimensions: '1920 × 1080',
    duration: '0:30',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: '/src/assets/images/brand_indiba_device_1793692727283.jpg',
    downloadUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    publishedAt: '2026-03-02T11:00:00Z',
    tags: ['video', 'spot', 'clinica', '30s']
  },
  {
    id: 'asset_indiba_03',
    promotionId: 'promo_indiba_deep_beauty',
    brandId: 'brand_indiba',
    title: 'Póster A1 para Mostrador & Recepción de Clínica',
    description: 'Gráfica de alta resolución con reserva para logotipo de la clínica colaboradora y claim de rejuvenecimiento biológico.',
    type: 'image',
    format: 'PNG',
    fileSizeBytes: 8900000,
    fileSizeFormatted: '8.9 MB',
    dimensions: '3508 × 4960',
    url: 'https://images.unsplash.com/photo-1512290900672-1f55b9679199?w=1600&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1512290900672-1f55b9679199?w=800&auto=format&fit=crop&q=80',
    downloadUrl: 'https://images.unsplash.com/photo-1512290900672-1f55b9679199?w=1600&auto=format&fit=crop&q=80',
    publishedAt: '2026-03-03T14:30:00Z',
    tags: ['poster', 'plv', 'impresion', 'recepcion']
  },
  {
    id: 'asset_indiba_04',
    promotionId: 'promo_indiba_deep_beauty',
    brandId: 'brand_indiba',
    title: 'Story Vertical 9:16 para Instagram Reels & TikTok',
    description: 'Vídeo en formato vertical con animaciones y claim promocional de sesiones INDIBA para redes sociales de centros autorizados.',
    type: 'video',
    format: 'MP4',
    fileSizeBytes: 16500000,
    fileSizeFormatted: '16.5 MB',
    dimensions: '1080 × 1920',
    duration: '0:15',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnailUrl: '/src/assets/images/brand_indiba_device_1793692727283.jpg',
    downloadUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    publishedAt: '2026-03-04T16:00:00Z',
    tags: ['reels', 'vertical', 'tiktok', 'redes']
  },
  {
    id: 'asset_indiba_05',
    promotionId: 'promo_indiba_deep_beauty',
    brandId: 'brand_indiba',
    title: 'Banner Web y Firma de Email para Colaboradores',
    description: 'Plantilla gráfica horizontal preparada para newsletters y cabeceras de sitios web de distribuidores.',
    type: 'image',
    format: 'JPG',
    fileSizeBytes: 2100000,
    fileSizeFormatted: '2.1 MB',
    dimensions: '2400 × 800',
    url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1600&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=80',
    downloadUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1600&auto=format&fit=crop&q=80',
    publishedAt: '2026-03-05T09:30:00Z',
    tags: ['banner', 'newsletter', 'email']
  },
  {
    id: 'asset_indiba_06',
    promotionId: 'promo_indiba_deep_beauty',
    brandId: 'brand_indiba',
    title: 'Guía Clínica de Protocolos Terapéuticos PDF Preview',
    description: 'Resumen gráfico de tiempos de emisión, potencias recomendadas y mapas de aplicación anatómica.',
    type: 'image',
    format: 'PNG',
    fileSizeBytes: 4700000,
    fileSizeFormatted: '4.7 MB',
    dimensions: '2480 × 3508',
    url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
    downloadUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600&auto=format&fit=crop&q=80',
    publishedAt: '2026-03-06T12:00:00Z',
    tags: ['protocolo', 'ficha-tecnica', 'medico']
  },

  // MESOESTETIC: Cosmelan
  {
    id: 'asset_meso_01',
    promotionId: 'promo_mesoestetic_cosmelan',
    brandId: 'brand_mesoestetic',
    title: 'Ampollas Médicas & Sueros Dermocosméticos Oficial 4K',
    description: 'Fotografía en estudio farmacéutico de ampollas estériles, frascos de solución exfoliante y goteros de ácido hialurónico.',
    type: 'image',
    format: 'JPG',
    fileSizeBytes: 4900000,
    fileSizeFormatted: '4.9 MB',
    dimensions: '3840 × 2560',
    url: '/src/assets/images/brand_mesoestetic_cosmetics_1793692727373.jpg',
    thumbnailUrl: '/src/assets/images/brand_mesoestetic_cosmetics_1793692727373.jpg',
    downloadUrl: '/src/assets/images/brand_mesoestetic_cosmetics_1793692727373.jpg',
    publishedAt: '2026-02-15T09:00:00Z',
    tags: ['mesoestetic', 'cosmelan', 'packshot', 'farmaceutico']
  },
  {
    id: 'asset_meso_02',
    promotionId: 'promo_mesoestetic_cosmelan',
    brandId: 'brand_mesoestetic',
    title: 'Gotero Sérum Hyaluronic B5 & Exfolia-30 Detalle',
    description: 'Plano macro de gotas translúcidas y dosificador de alta precisión en placa de petri.',
    type: 'image',
    format: 'PNG',
    fileSizeBytes: 3400000,
    fileSizeFormatted: '3.4 MB',
    dimensions: '2800 × 2100',
    url: 'https://images.unsplash.com/photo-1608248597359-71a2a4b87c7b?w=1600&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1608248597359-71a2a4b87c7b?w=800&auto=format&fit=crop&q=80',
    downloadUrl: 'https://images.unsplash.com/photo-1608248597359-71a2a4b87c7b?w=1600&auto=format&fit=crop&q=80',
    publishedAt: '2026-02-16T11:20:00Z',
    tags: ['textura', 'suero', 'macro', 'gotero']
  },
  {
    id: 'asset_meso_03',
    promotionId: 'promo_mesoestetic_cosmelan',
    brandId: 'brand_mesoestetic',
    title: 'Spot Demostrativo: Protocolo Despigmentante Cosmelan 45s',
    description: 'Vídeo técnico en cabina explicando la fase de preparación en consulta y el mantenimiento domiciliario.',
    type: 'video',
    format: 'MP4',
    fileSizeBytes: 32100000,
    fileSizeFormatted: '32.1 MB',
    dimensions: '1920 × 1080',
    duration: '0:45',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumbnailUrl: '/src/assets/images/brand_mesoestetic_cosmetics_1793692727373.jpg',
    downloadUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    publishedAt: '2026-02-17T15:00:00Z',
    tags: ['video', 'protocolo', 'cosmelan', 'cabina']
  },
  {
    id: 'asset_meso_04',
    promotionId: 'promo_mesoestetic_cosmelan',
    brandId: 'brand_mesoestetic',
    title: 'Infografía Científica de Despigmentación en Capas Dérmicas',
    description: 'Gráfico explicativo de la inhibición de la tirosinasa para mostrar a pacientes en consulta médica.',
    type: 'image',
    format: 'PNG',
    fileSizeBytes: 4200000,
    fileSizeFormatted: '4.2 MB',
    dimensions: '2400 × 3200',
    url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1600&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80',
    downloadUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1600&auto=format&fit=crop&q=80',
    publishedAt: '2026-02-18T10:00:00Z',
    tags: ['infografia', 'medicina', 'dermis']
  },

  // PHYT'S: Bio Radiance
  {
    id: 'asset_phyts_01',
    promotionId: 'promo_phyts_bio_radiance',
    brandId: 'brand_phyts',
    title: 'Gama Botánica 100% Orgánica en Vidrio Ámbar 4K',
    description: 'Bodegón oficial de tarros de crema botánica, sérum de neroli & jazmín y monodosis de vidrio cerradas al vacío.',
    type: 'image',
    format: 'JPG',
    fileSizeBytes: 4600000,
    fileSizeFormatted: '4.6 MB',
    dimensions: '3840 × 2560',
    url: '/src/assets/images/brand_phyts_organic_1793692728581.jpg',
    thumbnailUrl: '/src/assets/images/brand_phyts_organic_1793692728581.jpg',
    downloadUrl: '/src/assets/images/brand_phyts_organic_1793692728581.jpg',
    publishedAt: '2026-03-10T12:00:00Z',
    tags: ['phyts', 'bio', 'organico', 'ampollas', 'eco']
  },
  {
    id: 'asset_phyts_02',
    promotionId: 'promo_phyts_bio_radiance',
    brandId: 'brand_phyts',
    title: 'Spot Natural Beauty: El Poder de la Fitocosmética 35s',
    description: 'Vídeo comercial con estética zen y música relajante para salas de espera y pantallas de centros spa/estéticos.',
    type: 'video',
    format: 'MP4',
    fileSizeBytes: 27400000,
    fileSizeFormatted: '27.4 MB',
    dimensions: '1920 × 1080',
    duration: '0:35',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
    thumbnailUrl: '/src/assets/images/brand_phyts_organic_1793692728581.jpg',
    downloadUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
    publishedAt: '2026-03-11T16:00:00Z',
    tags: ['video', 'organico', 'fitoterapia', 'spa']
  },

  // NAGGURA: Swop
  {
    id: 'asset_naggura_01',
    promotionId: 'promo_naggura_swop',
    brandId: 'brand_naggura',
    title: 'Camilla Motorizada Naggura SWOP en Clínica de Diseño 4K',
    description: 'Fotografía arquitectónica en suite clínica minimalista con luz natural matinal y acabados en madera cálida.',
    type: 'image',
    format: 'JPG',
    fileSizeBytes: 5100000,
    fileSizeFormatted: '5.1 MB',
    dimensions: '3840 × 2560',
    url: '/src/assets/images/brand_naggura_bed_1793692728849.jpg',
    thumbnailUrl: '/src/assets/images/brand_naggura_bed_1793692728849.jpg',
    downloadUrl: '/src/assets/images/brand_naggura_bed_1793692728849.jpg',
    publishedAt: '2026-02-25T16:00:00Z',
    tags: ['naggura', 'camilla', 'mobiliario', 'clinica', 'ergonomia']
  },
  {
    id: 'asset_naggura_02',
    promotionId: 'promo_naggura_swop',
    brandId: 'brand_naggura',
    title: 'Vídeo 360° Rotación y Motores Silenciosos Naggura',
    description: 'Clip audiovisual demostrando la suavidad de elevación hidráulico-eléctrica y los paneles intercambiables de color.',
    type: 'video',
    format: 'MP4',
    fileSizeBytes: 29800000,
    fileSizeFormatted: '29.8 MB',
    dimensions: '1920 × 1080',
    duration: '0:40',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    thumbnailUrl: '/src/assets/images/brand_naggura_bed_1793692728849.jpg',
    downloadUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    publishedAt: '2026-02-26T14:00:00Z',
    tags: ['video', '360', 'motores', 'camilla']
  },

  // VISIODERM: Connect
  {
    id: 'asset_visioderm_01',
    promotionId: 'promo_visioderm_connect',
    brandId: 'brand_visioderm',
    title: 'Analizador Dérmico Digital Visioderm en Carrito Clínico 4K',
    description: 'Fotografía en estudio clínico del equipo de análisis facial por imagenología con pantalla táctil y sonda óptica multiespectral.',
    type: 'image',
    format: 'JPG',
    fileSizeBytes: 5400000,
    fileSizeFormatted: '5.4 MB',
    dimensions: '3840 × 2560',
    url: '/src/assets/images/brand_visioderm_diag_1793693215149.jpg',
    thumbnailUrl: '/src/assets/images/brand_visioderm_diag_1793693215149.jpg',
    downloadUrl: '/src/assets/images/brand_visioderm_diag_1793693215149.jpg',
    publishedAt: '2026-03-22T10:00:00Z',
    tags: ['visioderm', 'diagnostico', 'camara', 'dermatoscopia']
  },
  {
    id: 'asset_visioderm_02',
    promotionId: 'promo_visioderm_connect',
    brandId: 'brand_visioderm',
    title: 'Ficha Técnica de Parámetros Dermatoscópicos PDF Preview',
    description: 'Guía de lectura de hidratación, uniformidad del pigmento, niveles de queratina y profundidad de arrugas.',
    type: 'image',
    format: 'PNG',
    fileSizeBytes: 3900000,
    fileSizeFormatted: '3.9 MB',
    dimensions: '2480 × 3508',
    url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
    downloadUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600&auto=format&fit=crop&q=80',
    publishedAt: '2026-03-23T12:00:00Z',
    tags: ['diagnostico', 'ficha', 'cutaneo']
  },

  // SILHOUET-TONE: Evolution
  {
    id: 'asset_silhouet_01',
    promotionId: 'promo_silhouettone_evolution',
    brandId: 'brand_silhouettone',
    title: 'Dispositivo de Electrólisis Silhouet-Tone Evolution 7 en Cabina',
    description: 'Equipo médico de depilación definitiva por termólisis ultrarrápida con pedal ergonómico y porta-agujas esterilizado.',
    type: 'image',
    format: 'PNG',
    fileSizeBytes: 4200000,
    fileSizeFormatted: '4.2 MB',
    dimensions: '2800 × 2100',
    url: 'https://images.unsplash.com/photo-1512290900672-1f55b9679199?w=1600&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1512290900672-1f55b9679199?w=800&auto=format&fit=crop&q=80',
    downloadUrl: 'https://images.unsplash.com/photo-1512290900672-1f55b9679199?w=1600&auto=format&fit=crop&q=80',
    publishedAt: '2026-03-25T11:00:00Z',
    tags: ['electrolisis', 'depilacion-definitiva', 'silhouettone']
  },

  // IN. NUTRICOSMÉTICA: Elixirs
  {
    id: 'asset_innutri_01',
    promotionId: 'promo_innutricosmetica_elixirs',
    brandId: 'brand_innutricosmetica',
    title: 'Gama de Elixires Botánicos & Cápsulas Colágeno Glow 4K',
    description: 'Composición de frascos de vidrio ámbar con dispensadores dorados, elixires antiedad y cápsulas de colágeno marino sobre mármol.',
    type: 'image',
    format: 'JPG',
    fileSizeBytes: 4800000,
    fileSizeFormatted: '4.8 MB',
    dimensions: '3840 × 2560',
    url: '/src/assets/images/brand_innutricosmetica_1793693214883.jpg',
    thumbnailUrl: '/src/assets/images/brand_innutricosmetica_1793693214883.jpg',
    downloadUrl: '/src/assets/images/brand_innutricosmetica_1793693214883.jpg',
    publishedAt: '2026-04-01T09:30:00Z',
    tags: ['nutricosmetica', 'colageno', 'oral', 'belleza-celular']
  },
  {
    id: 'asset_innutri_02',
    promotionId: 'promo_innutricosmetica_elixirs',
    brandId: 'brand_innutricosmetica',
    title: 'Póster Expositor de Mostrador para Clínicas de Estética',
    description: 'Gráfica de prescripción médica de tratamientos combinados: cabina + nutricosmética oral.',
    type: 'image',
    format: 'PNG',
    fileSizeBytes: 6200000,
    fileSizeFormatted: '6.2 MB',
    dimensions: '2400 × 3600',
    url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1600&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80',
    downloadUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1600&auto=format&fit=crop&q=80',
    publishedAt: '2026-04-02T15:00:00Z',
    tags: ['mostrador', 'poster', 'prescripcion']
  }
];

export const INITIAL_UPDATES: PortalUpdate[] = [
  {
    id: 'upd_alvi_05',
    brandId: 'brand_innutricosmetica',
    promotionId: 'promo_innutricosmetica_elixirs',
    title: 'Nueva línea de IN. Nutricosmética disponible para distribución',
    description: 'Ya puedes descargar las composiciones fotográficas 4K, infografías de posología y cartelería para expositores de cabina.',
    newAssetsCount: 4,
    publishedAt: '2026-04-01T09:30:00Z',
    readByUserIds: ['user_admin']
  },
  {
    id: 'upd_alvi_06',
    brandId: 'brand_visioderm',
    promotionId: 'promo_visioderm_connect',
    title: 'Recursos oficiales del sistema de diagnóstico cutáneo Visioderm',
    description: 'Imágenes técnicas de la cámara dermatoscópica digital y plantillas editables para entrega de informes de evaluación cutánea.',
    newAssetsCount: 4,
    publishedAt: '2026-03-22T10:00:00Z',
    readByUserIds: ['user_admin']
  },
  {
    id: 'upd_alvi_01',
    brandId: 'brand_indiba',
    promotionId: 'promo_indiba_deep_beauty',
    title: 'Publicados nuevos materiales oficiales INDIBA Deep Beauty 448 kHz',
    description: 'Se han incorporado al portal 6 nuevos archivos en alta resolución: spot publicitario de 30s, adaptaciones para Instagram Reels y pósteres A1 para recepción.',
    newAssetsCount: 6,
    publishedAt: '2026-03-01T10:00:00Z',
    readByUserIds: ['user_admin']
  },
  {
    id: 'upd_alvi_02',
    brandId: 'brand_mesoestetic',
    promotionId: 'promo_mesoestetic_cosmelan',
    title: 'Kit de Prensa y Campaña Cosmelan 2026 disponible',
    description: 'Material comercial para centros autorizados: fotografías de packshots, spots demostrativos en cabina e infografías dermatológicas.',
    newAssetsCount: 6,
    publishedAt: '2026-02-15T09:00:00Z',
    readByUserIds: ['user_admin', 'user_laura']
  },
  {
    id: 'upd_alvi_03',
    brandId: 'brand_naggura',
    promotionId: 'promo_naggura_swop',
    title: 'Catálogo de Arquitectura y Camillas Naggura SWOP',
    description: 'Imágenes 4K para proyectos de diseño clínico, vídeos de rotación de motores y fichas con cotas ergonómicas.',
    newAssetsCount: 5,
    publishedAt: '2026-02-25T16:00:00Z',
    readByUserIds: ['user_admin']
  },
  {
    id: 'upd_alvi_04',
    brandId: 'brand_phyts',
    promotionId: 'promo_phyts_bio_radiance',
    title: 'Actualización de creatividades PHYT’S Cosmética Orgánica',
    description: 'Nuevas composiciones de ampollas de vidrio y spots sensoriales para cabinas de belleza biológica.',
    newAssetsCount: 5,
    publishedAt: '2026-03-10T12:00:00Z',
    readByUserIds: ['user_admin']
  }
];

export const INITIAL_ACTIVITY: ActivityLog[] = [
  {
    id: 'act_01',
    userId: 'user_laura',
    userName: 'Laura Martín',
    action: 'download_zip',
    description: 'Descargó lote ZIP (4 archivos) de la campaña "INDIBA Deep Beauty 2026"',
    timestamp: '2026-11-01T17:42:00Z'
  },
  {
    id: 'act_02',
    userId: 'user_carlos',
    userName: 'Carlos Ruiz',
    action: 'download_single',
    description: 'Descargó "Camilla Motorizada Naggura SWOP en Clínica de Diseño 4K"',
    timestamp: '2026-10-29T10:12:00Z'
  }
];
