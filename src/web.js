import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import helmet from 'helmet';

import apiRouter from './api';
import loggerService from './services/logger';
import errorHandler from './services/errorHandler';

const environment = process.env.NODE_ENV || 'development';
const listenIp = '0.0.0.0';
const listenPort = process.env.PORT || 8080;
const isHeroku = (process.env.IS_HEROKU || 'false').toLowerCase() === 'true';
const publicHost = isHeroku ? `https://${process.env.HEROKU_APP_NAME}.herokuapp.com` : process.env.PUBLIC_HOST;

const { L } = loggerService('Web Application');

// Always use UTC Timezone
const timezone = process.env.TIMEZONE || 'Etc/UTC';
L.info(`Using Timezone: ${timezone}`);
process.env.TZ = timezone;

// Application
const app = express();

app.set('trust proxy', true);
app.set('view engine', 'jade');

app.use(helmet());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Api Router
app.get('/', (_, res) => res.send('You have reached Kopi SIO'));
app.get('/oauth/google/redirect', (req, res) => {
  console.log('Redirect GET');
  console.log(req.query);
});
app.post('/oauth/google/redirect', (req, res) => {
  console.log('Redirect POST');
  console.log(req.query);
  console.log(req.body);
});
app.use('/api', apiRouter);
app.use(errorHandler.handleUnmatched);
app.use(errorHandler.handleError);

// Server
const httpServer = http.createServer(app);
httpServer.listen(listenPort, listenIp, () => {
  L.info(`Server (${environment}) listening on ${listenIp}:${listenPort}`);
  L.info(`Server is now accessible at ${publicHost}`);
});
