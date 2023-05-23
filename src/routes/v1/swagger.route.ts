import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerDefinition from '../../modules/swagger/swagger.definition';

const router = express.Router();

const specs = swaggerJsdoc({
  swaggerDefinition,
  apis: ['packages/components.yaml', 'dist/routes/v1/*.js'],
});

router.get('/swagger.json', (_, res): void => {
  res.setHeader('Content-Type', 'application/json');
  res.send(specs);
});
router.use('/', swaggerUi.serve, swaggerUi.setup({}, { swaggerUrl: '/swagger.json' }));
router.get(
  '/',
  swaggerUi.setup(specs, {
    explorer: true,
  })
);

export default router;
