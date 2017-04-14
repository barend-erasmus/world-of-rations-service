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
      filename: path.join(config.logging.path, 'world-of-rations-api.log'),
      level: 'debug',
    }),
  ];
}

const logger = new (winston.Logger)({
  transports,
});

export function getLogger(name: string) {

  let transports = [];

  if (config.logging.enabled) {
    transports = [
      new (winston.transports.Console)({ level: 'debug' }),
      new (winston.transports.File)({
        filename: path.join(config.logging.path, `world-of-rations-api-${name}.log`),
        level: 'debug',
      }),
    ];
  }

  return new (winston.Logger)({
    transports,
  });
}

// Exports
export { logger };
