import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const videosTable = sqliteTable("videos_table", {
  id: text().primaryKey(),
  title: text().notNull(),
  description: text().notNull(),
  category: text().notNull(),
  tags: text(),
  status: text().notNull(),
  videoFilename: text().notNull(),
  videoMimeType: text().notNull(),
  videoSize: int().notNull(),
  videoManifestUrl: text(),
  thumbFilename: text().notNull(),
  thumbMimeType: text().notNull(),
  thumbSize: int().notNull(),
  thumbUrl: text(),
  uploadedAt: int().notNull(),
  createdAt: int().notNull(),
  updatedAt: int().notNull(),
});
