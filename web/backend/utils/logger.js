
const LOG_LEVELS = {
  DEBUG: "DEBUG",
  INFO: "INFO",
  WARN: "WARN",
  ERROR: "ERROR",
};

const formatMessage = (level, message) => {
  const timestamp = new Date().toISOString();
  return "[" + timestamp + "] [" + level + "] " + message;
}

const logger = {
  info: (message, ...args) => {
    console.log(formatMessage(LOG_LEVELS.INFO, message), ...args);
  },

  warn: (message, ...args) => {
    console.warn(formatMessage(LOG_LEVELS.WARN, message), ...args);
  },

  error: (message, ...args) => {
    console.error(formatMessage(LOG_LEVELS.ERROR, message), ...args);
  },

  debug: (message, ...args) => {
    if (process.env.NODE_ENV != "production") {
      console.debug(formatMessage(LOG_LEVELS.DEBUG, message), ...args);
    }
  },
};

export default logger;
