import { Video, VideoCategory, VideoStatus } from "../../../../domain/entities/video.entity";
import { VideosMapper } from "./videos.mapper";

describe("VideosMapper", () => {
  describe("toDomain", () => {
    it("should convert raw database data to Video entity", () => {
      const rawData = {
        id: "video-123",
        title: "Test Video",
        description: "A test video description",
        category: VideoCategory.EDUCATION,
        tags: "javascript,typescript,testing",
        status: VideoStatus.PROCESSED,
        mimeType: "video/mp4",
        size: 1024000,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-02"),
        uploadedAt: new Date("2024-01-01T10:00:00"),
      };

      const video = VideosMapper.toDomain(rawData);

      expect(video).toBeInstanceOf(Video);
      expect(video.id).toBe("video-123");
      expect(video.title).toBe("Test Video");
      expect(video.description).toBe("A test video description");
      expect(video.category).toBe(VideoCategory.EDUCATION);
      expect(video.tags).toEqual(["javascript", "typescript", "testing"]);
      expect(video.status).toBe(VideoStatus.PROCESSED);
      expect(video.mimeType).toBe("video/mp4");
      expect(video.size).toBe(1024000);
      expect(video.createdAt).toEqual(new Date("2024-01-01"));
      expect(video.updatedAt).toEqual(new Date("2024-01-02"));
      expect(video.uploadedAt).toEqual(new Date("2024-01-01T10:00:00"));
    });

    it("should handle empty tags string", () => {
      const rawData = {
        id: "video-456",
        title: "Video Without Tags",
        description: "A video without tags",
        category: VideoCategory.ENTERTAINMENT,
        tags: "",
        status: VideoStatus.UPLOADED,
        mimeType: "video/webm",
        size: 2048000,
        createdAt: new Date(),
        updatedAt: new Date(),
        uploadedAt: new Date(),
      };

      const video = VideosMapper.toDomain(rawData);

      expect(video.tags).toEqual([""]);
    });

    it("should handle single tag", () => {
      const rawData = {
        id: "video-789",
        title: "Video With Single Tag",
        description: "A video with one tag",
        category: VideoCategory.MUSIC,
        tags: "music",
        status: VideoStatus.PROCESSING,
        mimeType: "video/avi",
        size: 512000,
        createdAt: new Date(),
        updatedAt: new Date(),
        uploadedAt: new Date(),
      };

      const video = VideosMapper.toDomain(rawData);

      expect(video.tags).toEqual(["music"]);
    });

    it("should handle multiple tags with spaces", () => {
      const rawData = {
        id: "video-000",
        title: "Video With Multiple Tags",
        description: "A video with many tags",
        category: VideoCategory.SPORTS,
        tags: "football, basketball, sports",
        status: VideoStatus.FAILED,
        mimeType: "video/mov",
        size: 4096000,
        createdAt: new Date(),
        updatedAt: new Date(),
        uploadedAt: new Date(),
      };

      const video = VideosMapper.toDomain(rawData);

      expect(video.tags).toEqual(["football", " basketball", " sports"]);
    });

    it("should handle all video statuses", () => {
      const statuses = [
        VideoStatus.UPLOADING,
        VideoStatus.UPLOADED,
        VideoStatus.PROCESSING,
        VideoStatus.PROCESSED,
        VideoStatus.FAILED,
      ];

      statuses.forEach((status) => {
        const rawData = {
          id: `video-${status}`,
          title: `Video with ${status} status`,
          description: "Test",
          category: VideoCategory.OTHER,
          tags: "test",
          status: status,
          mimeType: "video/mp4",
          size: 1000,
          createdAt: new Date(),
          updatedAt: new Date(),
          uploadedAt: new Date(),
        };

        const video = VideosMapper.toDomain(rawData);

        expect(video.status).toBe(status);
      });
    });

    it("should handle all video categories", () => {
      const categories = [
        VideoCategory.EDUCATION,
        VideoCategory.ENTERTAINMENT,
        VideoCategory.GAMING,
        VideoCategory.MUSIC,
        VideoCategory.NEWS,
        VideoCategory.SPORTS,
        VideoCategory.TECHNOLOGY,
        VideoCategory.TRAVEL,
        VideoCategory.OTHER,
      ];

      categories.forEach((category) => {
        const rawData = {
          id: `video-${category}`,
          title: `Video in ${category}`,
          description: "Test",
          category: category,
          tags: "test",
          status: VideoStatus.UPLOADED,
          mimeType: "video/mp4",
          size: 1000,
          createdAt: new Date(),
          updatedAt: new Date(),
          uploadedAt: new Date(),
        };

        const video = VideosMapper.toDomain(rawData);

        expect(video.category).toBe(category);
      });
    });
  });

  describe("toPersistence", () => {
    it("should convert Video entity to persistence format", () => {
      const video = Video.create({
        id: "video-123",
        title: "Test Video",
        description: "A test video description",
        category: VideoCategory.EDUCATION,
        tags: ["javascript", "typescript", "testing"],
        status: VideoStatus.PROCESSED,
        mimeType: "video/mp4",
        size: 1024000,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-02"),
        uploadedAt: new Date("2024-01-01T10:00:00"),
      });

      const persistence = VideosMapper.toPersistence(video);

      expect(persistence).toEqual({
        id: "video-123",
        title: "Test Video",
        description: "A test video description",
        category: VideoCategory.EDUCATION,
        tags: "javascript,typescript,testing",
        status: VideoStatus.PROCESSED,
        mimeType: "video/mp4",
        size: 1024000,
        createdAt: new Date("2024-01-01").getTime(),
        updatedAt: new Date("2024-01-02").getTime(),
        uploadedAt: new Date("2024-01-01T10:00:00").getTime(),
      });
    });

    it("should handle empty tags array", () => {
      const video = Video.create({
        id: "video-456",
        title: "Video Without Tags",
        category: VideoCategory.ENTERTAINMENT,
        tags: [],
        mimeType: "video/webm",
        size: 2048000,
      });

      const persistence = VideosMapper.toPersistence(video);

      expect(persistence.tags).toBe("");
    });

    it("should handle single tag", () => {
      const video = Video.create({
        id: "video-789",
        title: "Video With Single Tag",
        category: VideoCategory.MUSIC,
        tags: ["music"],
        mimeType: "video/avi",
        size: 512000,
      });

      const persistence = VideosMapper.toPersistence(video);

      expect(persistence.tags).toBe("music");
    });

    it("should handle multiple tags", () => {
      const video = Video.create({
        id: "video-000",
        title: "Video With Multiple Tags",
        category: VideoCategory.SPORTS,
        tags: ["football", "basketball", "sports"],
        mimeType: "video/mov",
        size: 4096000,
      });

      const persistence = VideosMapper.toPersistence(video);

      expect(persistence.tags).toBe("football,basketball,sports");
    });

    it("should handle undefined optional fields", () => {
      const video = Video.create({
        id: "video-111",
        title: "Minimal Video",
        category: VideoCategory.OTHER,
        mimeType: "video/mp4",
        size: 1000,
      });

      const persistence = VideosMapper.toPersistence(video);

      expect(persistence.id).toBe("video-111");
      expect(persistence.title).toBe("Minimal Video");
      expect(persistence.category).toBe(VideoCategory.OTHER);
      expect(persistence.mimeType).toBe("video/mp4");
      expect(persistence.size).toBe(1000);
      expect(persistence.tags).toBe("");
      expect(persistence).toHaveProperty("createdAt");
      expect(persistence).toHaveProperty("updatedAt");
      expect(persistence).toHaveProperty("uploadedAt");
    });
  });

  describe("round-trip conversion", () => {
    it("should convert Video to persistence and back to domain without data loss", () => {
      const originalVideo = Video.create({
        id: "video-round-trip",
        title: "Round Trip Test",
        description: "Testing round-trip conversion",
        category: VideoCategory.TECHNOLOGY,
        tags: ["typescript", "testing", "node"],
        status: VideoStatus.PROCESSED,
        mimeType: "video/mp4",
        size: 5242880,
        createdAt: new Date("2024-02-01"),
        updatedAt: new Date("2024-02-02"),
        uploadedAt: new Date("2024-02-01T12:00:00"),
      });

      const persistence = VideosMapper.toPersistence(originalVideo);
      const restoredVideo = VideosMapper.toDomain(persistence);

      expect(restoredVideo.id).toBe(originalVideo.id);
      expect(restoredVideo.title).toBe(originalVideo.title);
      expect(restoredVideo.description).toBe(originalVideo.description);
      expect(restoredVideo.category).toBe(originalVideo.category);
      expect(restoredVideo.tags).toEqual(originalVideo.tags);
      expect(restoredVideo.status).toBe(originalVideo.status);
      expect(restoredVideo.mimeType).toBe(originalVideo.mimeType);
      expect(restoredVideo.size).toBe(originalVideo.size);
      expect(restoredVideo.createdAt).toEqual(originalVideo.createdAt.getTime());
      expect(restoredVideo.updatedAt).toEqual(originalVideo.updatedAt.getTime());
      expect(restoredVideo.uploadedAt).toEqual(originalVideo.uploadedAt.getTime());
    });
  });
});
