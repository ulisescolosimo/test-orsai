module.exports = [
  'strapi::logger',
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: ['*'],  // Esto permite solicitudes desde cualquier origen
      headers: ['*'],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      credentials: false,
    },
  },
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
