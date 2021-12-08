export const createLogger = (tag: string) =>
  (...args: unknown[]) =>
    console.log(`[${new Date().toISOString()}] ${tag}:`, ...args);
