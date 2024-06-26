// swagger.ts

import swaggerJsdoc from 'swagger-jsdoc';
import { Request, Response, Express } from 'express';
import swaggerUi from 'swagger-ui-express';

export default function setupSwagger(app: Express) {
  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Node.js TypeScript API with Swagger',
        version: '1.0.0',
        description: 'Sample API for Node.js TypeScript with Swagger',
      },
    },
    apis: ['./src/routes/*.ts'], // Path to your API routes
  };

  const specs = swaggerJsdoc(options);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
}
