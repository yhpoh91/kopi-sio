import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import helmet from 'helmet';

import apiRouter from './api';

const environment = process.env.NODE_ENV;
const listenIp = '0.0.0.0';
const listenPort = process.env.PORT || 8080;
const isHeroku = (process.env.IS_HEROKU || 'false').toLowerCase() === 'true';
const publicHost = isHeroku ? `https://${process.env.HEROKU_APP_NAME}.herokuapp.com` : process.env.PUBLIC_HOST;

// Always use UTC Timezone
const timezone = process.env.TIMEZONE || 'Etc/UTC';
console.log(`Using Timezone: ${timezone}`);
process.env.TZ = timezone;

// Application
const app = express();

app.set('trust proxy', true);
app.set('view engine', 'jade');

app.use(helmet());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (_, res) => res.send('You have reached Kopi SIO'));

// Api Router
app.use('/api', apiRouter);

// Server
const httpServer = http.createServer(app);
httpServer.listen(listenPort, listenIp, () => {
  console.log(`Server (${environment}) listening on ${listenIp}:${listenPort}`)
  console.log(`Server is now accessible at ${publicHost}`)
});
