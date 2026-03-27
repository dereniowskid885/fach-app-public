import type { ConfigFile } from '@rtk-query/codegen-openapi';

const config: ConfigFile = {
  schemaFile: '../schemas/account_service_schema.json',
  apiFile: '../services/account/index.ts',
  apiImport: 'api',
  outputFile: '../accountApi.ts',
  exportName: 'accountApi',
  hooks: true,
  tag: true
};

export default config;
