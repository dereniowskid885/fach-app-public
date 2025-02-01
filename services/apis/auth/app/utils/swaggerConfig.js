const swaggerJsDoc = require('swagger-jsdoc');

const swaggerConfig = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Issue solver - Auth Service',
      version: '1.0.0',
      description:
        '<h5>API documentation</h5><a href="http://localhost:5000/api/swagger/export" download="auth_service_schema"><button>Download Swagger JSON</button></a>',
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
      },
    ],
  },
  apis: [__dirname + '/../routes/*.js'],
};

module.exports = swaggerJsDoc(swaggerConfig);
