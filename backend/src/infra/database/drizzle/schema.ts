import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const videosTable = sqliteTable("videos_table", {
  id: text().primaryKey(),
  title: text().notNull(),
  description: text().notNull(),
  category: text().notNull(),
  tags: text(),
  status: text().notNull(),
  mimeType: text().notNull(),
  size: int().notNull(),
  uploadedAt: int().notNull(),
  createdAt: int().notNull(),
  updatedAt: int().notNull(),
});
