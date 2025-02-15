import type { ConfigFile } from '@rtk-query/codegen-openapi';

const config: ConfigFile = {
  schemaFile: '../schemas/ticketing_service_schema.json',
  apiFile: '../services/ticketing/index.ts',
  apiImport: 'api',
  outputFile: '../ticketingApi.ts',
  exportName: 'ticketingApi',
  hooks: true
};

export default config;
