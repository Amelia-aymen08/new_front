export const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000'
  : 'https://backend.aymenpromotion-dz.com';

export const STRAPI_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:1337'
  : 'https://strapi.aymenpromotion-dz.com'; 

// Configuration du worker PDF pour qu'il pointe vers le fichier local dans public/
export const PDF_WORKER_URL = '/pdf.worker.min.mjs';

export const HUBSPOT_PORTAL_ID = '39983056';
export const HUBSPOT_REGION = 'na1';

export const HUBSPOT_FORM_IDS = {
  home: '',
  contact: '',
  quote: '',
  careers: '',
} as const;

const config = {
  API_BASE_URL,
  STRAPI_URL,
  PDF_WORKER_URL,
  HUBSPOT_PORTAL_ID,
  HUBSPOT_REGION,
  HUBSPOT_FORM_IDS,
};

export default config;
