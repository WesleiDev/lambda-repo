export type ConfigApp = {
  name: string;
  type: 'api';
  handler: 'string';
};

export type ServerlessConfig = {
  name: string;
  frameworkVersion: string;
  provider: string;
  runtime: string;
  region: string;
};
