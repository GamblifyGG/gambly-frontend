const { createLogger } = require('@gambly/logger');

const logger = (defaultConfig) => {
  return createLogger({
    ...defaultConfig,
    level: process.env.LOG_LEVEL ?? 'info',
  });
}

module.exports = { logger };
