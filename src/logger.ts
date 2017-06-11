// Imports
import * as path from 'path';
import * as winston from 'winston';

// Import configurations
let config = require('./config').config;

const argv = require('yargs').argv;

if (argv.prod) {
  config = require('./config.prod').config;
}

let transportsArr = [];

if (config.logging.enabled) {
  transportsArr = [
    new (winston.transports.Console)({ level: 'debug' }),
    new (winston.transports.File)({
      filename: path.join(config.logging.path, 'world-of-rations-api.log'),
      level: 'debug',
    }),
  ];
}

const logger = new (winston.Logger)({
  transports: transportsArr,
});

// Exports
export { logger };
