declare const process: { env: { [key: string]: string | undefined } };

export const isTestEnvironment = () => typeof process !== 'undefined' && process.env.NODE_ENV === 'test';

