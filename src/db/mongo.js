import mongoose from 'mongoose';
import logger from '../utils/logger';
import appConf from '../utils/app.conf';

const conf = appConf.getConf();

mongoose.Promise = global.Promise;

class Mongo {
  constructor() {
    this.connectionString = `mongodb://${conf.mongo.user}:${conf.mongo.password}@${conf.mongo.host}:${conf.mongo.port}/${conf.mongo.db}?authSource=admin&w=1`;

    mongoose.set('useNewUrlParser', true);
    mongoose.set('useCreateIndex', true);
    mongoose.set('useUnifiedTopology', true);
    mongoose.set('useFindAndModify', false);

    mongoose.connection.on('reconnected', () => {
      logger.info(`Database re-onnected, worker process: ${process.pid}`);
    });

    mongoose.connection.on('connected', () => {
      logger.info(`Database connected, worker process: ${process.pid}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.info('Database disconnected');
    });

    mongoose.connection.on('close', () => {
      logger.info('Database connection closed');
    });

    mongoose.connection.on('error', (error) => {
      logger.error('Error while trying to connect to database: ' + error);
    });
  }

  async start() {
    try {
      await mongoose.connect(this.connectionString, {
        auth: {
          authdb: 'admin'
        }
      });
    } catch (error) {
      logger.error(
        `Connection to database failed on worker: ${process.pid}, reason: ${error.message}`
      );

      process.exit(1);
    }
  }
}

export default new Mongo();
