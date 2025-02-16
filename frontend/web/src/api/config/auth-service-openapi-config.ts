import type { ConfigFile } from '@rtk-query/codegen-openapi';

const config: ConfigFile = {
  schemaFile: '../schemas/auth_service_schema.json',
  apiFile: '../services/auth/index.ts',
  apiImport: 'api',
  outputFile: '../authApi.ts',
  exportName: 'authApi',
  hooks: true
};

export default config;
