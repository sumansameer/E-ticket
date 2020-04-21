const he = require('hydra-express');
const express = he.getExpress();
const api = express.Router();
const router = require('./routes/routing');
const app = express();

he.init('./config.json',() => {
  api.use(router);
  he.registerRoutes({'/user':api});
})
