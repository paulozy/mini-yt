import 'dotenv/config';

export const env = {
  DATABASE: {
    DB_FILE_NAME: process.env.DB_FILE_NAME || "file:./sqlite/database.db",
  },
  STORAGE: {
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME || "videos",
    S3_ENDPOINT: process.env.S3_ENDPOINT || "http://localhost:4566",
    AWS_REGION: process.env.AWS_DEFAULT_REGION || "us-east-1",
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || "test",
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || "test",
  },
}