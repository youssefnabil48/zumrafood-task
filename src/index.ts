import mongoose from 'mongoose';
import app from './app';
import config from './config/config';
import logger from './utils/logger/logger';

let server: any;
mongoose.connect(config.mongoose.url).then(() => {
  logger.info('Connected to MongoDB');
  server = app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
  });
});

const unexpectedErrorHandler = (error: any) => {
  logger.error(' UNCAUGHT EXCEPTION ');
  logger.error(` [Inside uncaughtException event] ${error.stack}` || error.message);
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
