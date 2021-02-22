import winston from 'winston';

const options = {
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
    format: winston.format.combine(
      winston.format.label({ label: 'API' }),
      winston.format.timestamp(),
      winston.format.colorize(),
      winston.format.printf(({ level, message, label, timestamp }) => {
        return `[${label}]: ${timestamp} ${level}: ${message}`;
      })
    )
  }
};

// eslint-disable-next-line new-cap
const logger = new winston.createLogger({
  transports: [new winston.transports.Console(options.console)],
  exitOnError: false
});

logger.stream = {
  write: (message, encoding) => {
    logger.info(message);
  }
};

export default logger;
