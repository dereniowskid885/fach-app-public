import express from 'express';
const router = express.Router();

import swaggerUi from 'swagger-ui-express';
import swaggerConfig from '@constants/swaggerConfig';

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerConfig));
router.get('/export', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerConfig);
});

export default router;
