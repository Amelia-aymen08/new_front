export const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000'
  : 'https://backend.test.aymenpromotion-dz.com';

export const STRAPI_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:1337'
  : 'https://aymen-strapi.aymenpromotion-dz.com'; 

// Configuration du worker PDF pour qu'il pointe vers le fichier local dans public/
export const PDF_WORKER_URL = '/pdf.worker.min.mjs';

const config = {
  API_BASE_URL,
  STRAPI_URL,
  PDF_WORKER_URL
};

export default config;
