// Environment configuration
const config = {
  STRAPI_URL: process.env.REACT_APP_STRAPI_URL || 'https://strapi.aymenpromotion-dz.com',
  API_URL: process.env.REACT_APP_API_URL || 'https://backend.aymenpromotion-dz.com',
  GOOGLE_MAPS_API_KEY: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'AIzaSyBIKzck-VsmSzaxvHt2dJ0HjueSC8OfOTY',
  RECAPTCHA_SITE_KEY: process.env.REACT_APP_RECAPTCHA_SITE_KEY || '6Ld5oEYsAAAAAA6BXan55ZEPRTJl-bg7yQevfR23',
};

export default config;
