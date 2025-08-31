const logInfo = (msg, meta = {}) => {
  console.log(`[INFO] ${msg}`, meta);
};

export const logError = (msg, error = {}) => {
  console.error(`[ERROR] ${msg}`, error);
};

export default { logInfo, logError };
