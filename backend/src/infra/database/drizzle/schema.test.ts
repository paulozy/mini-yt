import { getTableColumns, getTableName } from "drizzle-orm";
import { videosTable } from "./schema";

describe("Drizzle Schema - Videos Table", () => {
  describe("table structure", () => {
    it("should have the correct table name", () => {
      const tableName = getTableName(videosTable);
      expect(tableName).toBe("videos_table");
    });

    it("should have all required columns", () => {
      const columns = getTableColumns(videosTable);
      const columnNames = Object.keys(columns);

      expect(columnNames).toContain("id");
      expect(columnNames).toContain("title");
      expect(columnNames).toContain("description");
      expect(columnNames).toContain("category");
      expect(columnNames).toContain("tags");
      expect(columnNames).toContain("status");
      expect(columnNames).toContain("mimeType");
      expect(columnNames).toContain("size");
      expect(columnNames).toContain("uploadedAt");
      expect(columnNames).toContain("createdAt");
      expect(columnNames).toContain("updatedAt");
    });

    it("should have exactly 11 columns", () => {
      const columns = getTableColumns(videosTable);
      expect(Object.keys(columns)).toHaveLength(11);
    });
  });

  describe("column types and constraints", () => {
    it("should have id as primary key", () => {
      const columns = getTableColumns(videosTable);
      expect(columns.id.primary).toBe(true);
    });

    it("should have id as string dataType", () => {
      const columns = getTableColumns(videosTable);
      expect(columns.id.dataType).toBe("string");
    });

    it("should have title as non-nullable", () => {
      const columns = getTableColumns(videosTable);
      expect(columns.title.notNull).toBe(true);
    });

    it("should have description as non-nullable", () => {
      const columns = getTableColumns(videosTable);
      expect(columns.description.notNull).toBe(true);
    });

    it("should have category as non-nullable", () => {
      const columns = getTableColumns(videosTable);
      expect(columns.category.notNull).toBe(true);
    });

    it("should have tags as nullable", () => {
      const columns = getTableColumns(videosTable);
      expect(columns.tags.notNull).toBeFalsy();
    });

    it("should have status as non-nullable", () => {
      const columns = getTableColumns(videosTable);
      expect(columns.status.notNull).toBe(true);
    });

    it("should have mimeType as non-nullable", () => {
      const columns = getTableColumns(videosTable);
      expect(columns.mimeType.notNull).toBe(true);
    });

    it("should have size as non-nullable integer", () => {
      const columns = getTableColumns(videosTable);
      expect(columns.size.dataType).toBe("number");
      expect(columns.size.notNull).toBe(true);
    });

    it("should have uploadedAt as non-nullable integer", () => {
      const columns = getTableColumns(videosTable);
      expect(columns.uploadedAt.dataType).toBe("number");
      expect(columns.uploadedAt.notNull).toBe(true);
    });

    it("should have createdAt as non-nullable integer", () => {
      const columns = getTableColumns(videosTable);
      expect(columns.createdAt.dataType).toBe("number");
      expect(columns.createdAt.notNull).toBe(true);
    });

    it("should have updatedAt as non-nullable integer", () => {
      const columns = getTableColumns(videosTable);
      expect(columns.updatedAt.dataType).toBe("number");
      expect(columns.updatedAt.notNull).toBe(true);
    });
  });

  describe("schema integrity", () => {
    it("should have one primary key column", () => {
      const columns = getTableColumns(videosTable);
      const primaryKeyColumns = Object.values(columns).filter(col => col.primary);
      expect(primaryKeyColumns).toHaveLength(1);
    });

    it("should have timestamps as required fields", () => {
      const columns = getTableColumns(videosTable);
      expect(columns.createdAt.notNull).toBe(true);
      expect(columns.updatedAt.notNull).toBe(true);
      expect(columns.uploadedAt.notNull).toBe(true);
    });

    it("should have all text-based enums as required", () => {
      const columns = getTableColumns(videosTable);
      expect(columns.status.notNull).toBe(true);
      expect(columns.category.notNull).toBe(true);
    });

    it("should have correct non-nullable fields count", () => {
      const columns = getTableColumns(videosTable);
      const notNullColumns = Object.values(columns).filter(col => col.notNull);
      expect(notNullColumns.length).toBe(10);
    });

    it("should have exactly one nullable column (tags)", () => {
      const columns = getTableColumns(videosTable);
      const nullableColumns = Object.values(columns).filter(col => !col.notNull);
      expect(nullableColumns).toHaveLength(1);
      expect(nullableColumns[0].name).toBe("tags");
    });
  });

  describe("schema design patterns", () => {
    it("should use consistent naming for timestamp fields", () => {
      const columns = getTableColumns(videosTable);
      expect(columns).toHaveProperty("createdAt");
      expect(columns).toHaveProperty("updatedAt");
      expect(columns).toHaveProperty("uploadedAt");
    });

    it("should have id as the only unique identifier", () => {
      const columns = getTableColumns(videosTable);
      expect(columns.id.primary).toBe(true);
    });

    it("should separate metadata fields from content fields", () => {
      const columns = getTableColumns(videosTable);
      const metadataFields = ["id", "status", "createdAt", "updatedAt", "uploadedAt"];
      const contentFields = ["title", "description", "category", "tags", "mimeType", "size"];

      metadataFields.forEach(field => {
        expect(columns).toHaveProperty(field);
      });

      contentFields.forEach(field => {
        expect(columns).toHaveProperty(field);
      });
    });

    it("should handle video properties appropriately", () => {
      const columns = getTableColumns(videosTable);

      // Video identifiers and metadata
      expect(columns.id.dataType).toBe("string");
      expect(columns.mimeType.dataType).toBe("string");
      expect(columns.size.dataType).toBe("number");

      // Video content
      expect(columns.title.notNull).toBe(true);
      expect(columns.category.notNull).toBe(true);
      expect(columns.tags.notNull).toBeFalsy();
    });
  });

  describe("column properties", () => {
    it("should have all expected column keys", () => {
      const columns = getTableColumns(videosTable);
      const expectedKeys = [
        "id",
        "title",
        "description",
        "category",
        "tags",
        "status",
        "mimeType",
        "size",
        "uploadedAt",
        "createdAt",
        "updatedAt",
      ];

      expectedKeys.forEach(key => {
        expect(columns).toHaveProperty(key);
      });
    });

    it("should have correct column data types", () => {
      const columns = getTableColumns(videosTable);

      // String dataType columns
      const stringColumns = ["id", "title", "description", "category", "tags", "status", "mimeType"];
      stringColumns.forEach(col => {
        expect(columns[col as keyof typeof columns].dataType).toBe("string");
      });

      // Number dataType columns
      const numberColumns = ["size", "uploadedAt", "createdAt", "updatedAt"];
      numberColumns.forEach(col => {
        expect(columns[col as keyof typeof columns].dataType).toBe("number");
      });
    });
  });

  describe("schema constraints validation", () => {
    it("primary key should be non-nullable", () => {
      const columns = getTableColumns(videosTable);
      expect(columns.id.primary).toBe(true);
      expect(columns.id.notNull).toBe(true);
    });

    it("should enforce not-null on required fields", () => {
      const columns = getTableColumns(videosTable);
      const requiredFields = ["title", "description", "category", "status", "mimeType", "size"];

      requiredFields.forEach(field => {
        expect(columns[field as keyof typeof columns].notNull).toBe(true);
      });
    });

    it("should allow nullable tags field", () => {
      const columns = getTableColumns(videosTable);
      expect(columns.tags.notNull).toBeFalsy();
    });
  });
});
