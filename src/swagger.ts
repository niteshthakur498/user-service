// swagger.ts

import swaggerJsdoc from 'swagger-jsdoc';
import { Request, Response, Express } from 'express';
import swaggerUi from 'swagger-ui-express';

export default function setupSwagger(app: Express) {
  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'User Service Findoc',
        version: '1.0.0',
        description: 'Endpoints for API of User-Service',
      },
    },
    apis: ['./src/routes/*.ts'], // Path to your API routes
  };

  const specs = swaggerJsdoc(options);
  app.use('/user-service/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
}
