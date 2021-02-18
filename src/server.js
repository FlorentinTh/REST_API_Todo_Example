import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import httpStatus from 'http-status';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';

import winston from './utils/logger';
import appConf from './utils/app.conf';
import apiError from './utils/api.error';

import mongo from './db/mongo';

import tasksRoutes from './task/task.routes';

const conf = appConf.getConf();
const isDev = conf.env === 'development';

const app = express();
const APIv1 = express();

const appServer = http.createServer(app);

isDev ? app.use(morgan('dev')) : app.use(morgan('combined'), { stream: winston.stream });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compression());
app.use(helmet());
app.use(cors());

mongo.start();

APIv1.use('/v1/tasks', tasksRoutes);
app.use('/api', APIv1);

app.use((req, res, next) => {
  const err = new apiError('API not found', httpStatus.NOT_FOUND);
  next(err);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  winston.error(
    `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${
      req.ip
    }`
  );

  res.status(err.status || 500).json({
    status: 'error',
    code: err.status,
    message: err.message
  });
});

export { app, appServer };
