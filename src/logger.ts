// Imports
import * as path from 'path';
import * as winston from 'winston';

// Imports configuration
import { config } from './config';

let transports = [];

if (config.logging.enabled) {
  transports = [
    new (winston.transports.Console)({ level: 'debug' }),
    new (winston.transports.File)({
      filename: path.join(config.logging.path, 'worldofrations_api.log'),
      level: 'debug',
    }),
  ];
}

const logger = new (winston.Logger)({
  transports: transports,
});

export function getLogger(name: string) {

  let transports = [];

  if (config.logging.enabled) {
    transports = [
      new (winston.transports.Console)({ level: 'debug' }),
      new (winston.transports.File)({
        filename: path.join(config.logging.path, `worldofrations_api_${name}.log`),
        level: 'debug',
      }),
    ];
  }

  return new (winston.Logger)({
    transports: transports,
  });
}

// Exports
export { logger };
