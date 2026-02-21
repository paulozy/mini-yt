import 'dotenv/config';

export const env = {
  DB_FILE_NAME: process.env.DB_FILE_NAME || "file:./sqlite/database.db",
}