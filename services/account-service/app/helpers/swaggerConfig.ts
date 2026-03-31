import swaggerJsDoc from 'swagger-jsdoc';
import { ROUTES } from '../constants/routeConstants';
import { SWAGGER_ROUTES } from 'shared-types';

const swaggerConfig = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'FachApp - Account Service',
      version: '1.0.0',
      description: `<h5>API documentation</h5><a href="${process.env.ACCOUNT_SERVICE_BASE_URL + SWAGGER_ROUTES.EXPORT}" download="account_service_schema"><button>Download Swagger JSON</button></a>`,
    },
    servers: [
      {
        url: process.env.ACCOUNT_SERVICE_BASE_URL + ROUTES.BASE,
      },
    ],
  },
  apis: [__dirname + '/../routes/*.ts', __dirname + '/../swagger/*.ts'],
};

export default swaggerJsDoc(swaggerConfig);
