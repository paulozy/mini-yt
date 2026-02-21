import { drizzle, LibSQLDatabase } from 'drizzle-orm/libsql';
import { env } from '../../../shared/config/env';

export class DrizzleDatabase {
  private static instance: DrizzleDatabase;
  private database: ReturnType<typeof drizzle>;

  private constructor() {
    this.database = drizzle(env.DB_FILE_NAME);
  }

  public static getInstance(): DrizzleDatabase {
    if (!DrizzleDatabase.instance) {
      DrizzleDatabase.instance = new DrizzleDatabase();
    }
    return DrizzleDatabase.instance;
  }

  public getDb(): LibSQLDatabase {
    return this.database as unknown as LibSQLDatabase;
  }
}