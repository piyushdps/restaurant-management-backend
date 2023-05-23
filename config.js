const swaggerJSDoc = require('swagger-jsdoc');

const specs = swaggerJSDoc({
  options: {
    openapi: '3.0.0',
    info: {
      title: 'node-express-typescript-boilerplate API documentation',
      version: '0.0.1',
      description: 'This is a node express mongoose boilerplate in typescript',
      license: {
        name: 'MIT',
        url: 'https://github.com/saisilinus/node-express-mongoose-typescript-boilerplate.git',
      },
    },
    servers: [
      {
        url: `http://localhost:9000/v1`,
        description: 'Development Server',
      },
    ],
  },
  apis: ['/packages/components.yaml', '/dist/routes/v1/*.js'],
});

module.exports = specs;
