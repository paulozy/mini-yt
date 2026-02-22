import { defineConfig } from 'drizzle-kit';
import { env } from './src/shared/config/env';

export default defineConfig({
  out: './drizzle',
  schema: './src/infra/database/drizzle/schema.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: env.DATABASE.DB_FILE_NAME,
  },
});
