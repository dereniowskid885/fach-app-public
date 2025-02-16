const swaggerJsDoc = require('swagger-jsdoc');
const ROUTES = require('../constants/routeConstants');
const ROUTES_SWAGGER = require('@constants/swaggerConstants');
require('dotenv').config({ path: require.resolve('@root/.env.shared') });

const swaggerConfig = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Issue solver - Ticketing Service',
      version: '1.0.0',
      description: `<h5>API documentation</h5><a href="${process.env.TICKETING_SERVICE_BASE_URL + ROUTES_SWAGGER.EXPORT}" download="ticketing_service_schema"><button>Download Swagger JSON</button></a>`,
    },
    servers: [
      {
        url: process.env.TICKETING_SERVICE_BASE_URL + ROUTES.BASE,
      },
    ],
  },
  apis: [__dirname + '/../routes/*.js'],
};

module.exports = swaggerJsDoc(swaggerConfig);
