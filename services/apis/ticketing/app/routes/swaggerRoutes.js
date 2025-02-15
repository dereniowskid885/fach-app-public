const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerConfig = require('../utils/swaggerConfig');

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerConfig));
router.get('/export', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerConfig);
});

module.exports = router;
