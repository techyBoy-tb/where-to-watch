import * as Updates from 'expo-updates';

export enum Environment {
  //
  // Local development
  local = 'local',
  //
  // Published app environments
  beta = 'beta',
  production = 'production',
}

const getEnvironment = () => {
  const c = Updates.channel;

  const isLocal = !c || c.startsWith('default');
  const isBeta = c && c.startsWith('beta');

  const isProduction = !isLocal && !isBeta;

  if (isLocal) return Environment.local;
  if (isBeta) return Environment.beta;
  if (isProduction) return Environment.production;

  // default
  return Environment.local;
};

export const currentEnv = getEnvironment() as keyof typeof Environment;
