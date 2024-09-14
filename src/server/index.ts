import express from 'express';
import 'express-async-errors';

import { env } from '../application/config/env.js';
import { errorHandler } from '../application/errors/handleError.js';
import routes from '../routes';

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');

  next();
});

app.use(express.json());
app.use(routes);

app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Servidor executando na porta ${env.port}.`);
});
