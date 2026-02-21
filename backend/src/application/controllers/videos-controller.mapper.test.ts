import { Video, VideoCategory, VideoStatus } from "../../domain/entities/video.entity";
import { VideosControllerMapper } from "./videos-controller.mapper";

describe("VideosControllerMapper", () => {
  describe("toHttp", () => {
    it("should convert Video entity to HTTP response with all fields", () => {
      const createdAt = new Date("2024-01-01T10:00:00Z");
      const updatedAt = new Date("2024-01-02T10:00:00Z");
      const uploadedAt = new Date("2024-01-01T12:00:00Z");

      const video = Video.create({
        id: "video-123",
        title: "Test Video",
        description: "A test video description",
        category: VideoCategory.EDUCATION,
        tags: ["javascript", "typescript", "testing"],
        status: VideoStatus.PROCESSED,
        videoFilename: "video123.mp4",
        videoMimeType: "video/mp4",
        videoSize: 1024000,
        videoManifestUrl: "https://example.com/manifest/video123.m3u8",
        thumbFilename: "thumb123.jpg",
        thumbMimeType: "image/jpeg",
        thumbSize: 51200,
        thumbUrl: "https://example.com/thumbs/thumb123.jpg",
        createdAt,
        updatedAt,
        uploadedAt,
      });

      const httpResponse = VideosControllerMapper.toHttp(video);

      expect(httpResponse).toEqual({
        id: "video-123",
        title: "Test Video",
        description: "A test video description",
        category: VideoCategory.EDUCATION,
        tags: ["javascript", "typescript", "testing"],
        status: VideoStatus.PROCESSED,
        videoFilename: "video123.mp4",
        videoMimeType: "video/mp4",
        videoSize: 1024000,
        videoManifestUrl: "https://example.com/manifest/video123.m3u8",
        thumbFilename: "thumb123.jpg",
        thumbMimeType: "image/jpeg",
        thumbSize: 51200,
        thumbUrl: "https://example.com/thumbs/thumb123.jpg",
        createdAt: createdAt.toISOString(),
        updatedAt: updatedAt.toISOString(),
        uploadedAt: uploadedAt.toISOString(),
      });
    });

    it("should convert Date objects to ISO string format", () => {
      const now = new Date();
      const video = Video.create({
        id: "video-dates",
        title: "Video",
        category: VideoCategory.OTHER,
        videoFilename: "video.mp4",
        videoMimeType: "video/mp4",
        videoSize: 1000,
        thumbFilename: "thumb.jpg",
        thumbMimeType: "image/jpeg",
        thumbSize: 50000,
        createdAt: now,
        updatedAt: now,
        uploadedAt: now,
      });

      const httpResponse = VideosControllerMapper.toHttp(video);

      expect(httpResponse.createdAt).toBe(now.toISOString());
      expect(httpResponse.updatedAt).toBe(now.toISOString());
      expect(httpResponse.uploadedAt).toBe(now.toISOString());
      expect(typeof httpResponse.createdAt).toBe("string");
      expect(typeof httpResponse.updatedAt).toBe("string");
      expect(typeof httpResponse.uploadedAt).toBe("string");
    });

    it("should handle video without description", () => {
      const video = Video.create({
        id: "video-no-desc",
        title: "Video Without Description",
        category: VideoCategory.MUSIC,
        videoFilename: "video.webm",
        videoMimeType: "video/webm",
        videoSize: 2048000,
        thumbFilename: "thumb.jpg",
        thumbMimeType: "image/jpeg",
        thumbSize: 50000,
      });

      const httpResponse = VideosControllerMapper.toHttp(video);

      expect(httpResponse.description).toBeUndefined();
      expect(httpResponse.id).toBe("video-no-desc");
      expect(httpResponse.title).toBe("Video Without Description");
    });

    it("should map all video statuses correctly", () => {
      const statuses = [
        VideoStatus.UPLOADING,
        VideoStatus.UPLOADED,
        VideoStatus.PROCESSING,
        VideoStatus.PROCESSED,
        VideoStatus.FAILED,
      ];

      statuses.forEach((status) => {
        const video = Video.create({
          id: `video-${status}`,
          title: `Video with ${status}`,
          category: VideoCategory.OTHER,
          videoFilename: "video.mp4",
          videoMimeType: "video/mp4",
          videoSize: 1000,
          thumbFilename: "thumb.jpg",
          thumbMimeType: "image/jpeg",
          thumbSize: 50000,
          status,
        });

        const httpResponse = VideosControllerMapper.toHttp(video);

        expect(httpResponse.status).toBe(status);
      });
    });

    it("should map all video categories correctly", () => {
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
        const video = Video.create({
          id: `video-${category}`,
          title: `Video in ${category}`,
          category,
          videoFilename: "video.mp4",
          videoMimeType: "video/mp4",
          videoSize: 1000,
          thumbFilename: "thumb.jpg",
          thumbMimeType: "image/jpeg",
          thumbSize: 50000,
        });

        const httpResponse = VideosControllerMapper.toHttp(video);

        expect(httpResponse.category).toBe(category);
      });
    });

    it("should preserve all string fields", () => {
      const video = Video.create({
        id: "video-id-test",
        title: "Exact Title",
        description: "Exact Description",
        category: VideoCategory.ENTERTAINMENT,
        tags: ["tag1", "tag2", "tag3"],
        videoFilename: "video.avi",
        videoMimeType: "video/avi",
        videoSize: 5000000,
        thumbFilename: "thumb.jpg",
        thumbMimeType: "image/jpeg",
        thumbSize: 50000,
        status: VideoStatus.PROCESSING,
      });

      const httpResponse = VideosControllerMapper.toHttp(video);

      expect(httpResponse.id).toBe("video-id-test");
      expect(httpResponse.title).toBe("Exact Title");
      expect(httpResponse.description).toBe("Exact Description");
      expect(httpResponse.videoMimeType).toBe("video/avi");
    });

    it("should preserve numeric fields", () => {
      const video = Video.create({
        id: "video-numbers",
        title: "Video with Numbers",
        category: VideoCategory.OTHER,
        videoFilename: "video.mp4",
        videoMimeType: "video/mp4",
        videoSize: 1572864,
        thumbFilename: "thumb.jpg",
        thumbMimeType: "image/jpeg",
        thumbSize: 50000,
      });

      const httpResponse = VideosControllerMapper.toHttp(video);

      expect(httpResponse.videoSize).toBe(1572864);
      expect(typeof httpResponse.videoSize).toBe("number");
    });

    it("should preserve tags array", () => {
      const tags = ["javascript", "tutorial", "beginners", "web-development"];
      const video = Video.create({
        id: "video-tags",
        title: "Video with Tags",
        category: VideoCategory.EDUCATION,
        tags,
        videoFilename: "video.mp4",
        videoMimeType: "video/mp4",
        videoSize: 2000000,
        thumbFilename: "thumb.jpg",
        thumbMimeType: "image/jpeg",
        thumbSize: 50000,
      });

      const httpResponse = VideosControllerMapper.toHttp(video);

      expect(httpResponse.tags).toEqual(tags);
      expect(Array.isArray(httpResponse.tags)).toBe(true);
    });

    it("should handle empty tags array", () => {
      const video = Video.create({
        id: "video-empty-tags",
        title: "Video with Empty Tags",
        category: VideoCategory.OTHER,
        tags: [],
        videoFilename: "video.mp4",
        videoMimeType: "video/mp4",
        videoSize: 1000,
        thumbFilename: "thumb.jpg",
        thumbMimeType: "image/jpeg",
        thumbSize: 50000,
      });

      const httpResponse = VideosControllerMapper.toHttp(video);

      expect(httpResponse.tags).toEqual([]);
    });

    it("should return proper HTTP response structure", () => {
      const video = Video.create({
        id: "video-structure",
        title: "Structural Test",
        description: "Testing structure",
        category: VideoCategory.NEWS,
        tags: ["news", "updates"],
        status: VideoStatus.UPLOADED,
        videoFilename: "video.mp4",
        videoMimeType: "video/mp4",
        videoSize: 3000,
        thumbFilename: "thumb.jpg",
        thumbMimeType: "image/jpeg",
        thumbSize: 25000,
      });

      const httpResponse = VideosControllerMapper.toHttp(video);

      // Verify all expected properties exist
      expect(httpResponse).toHaveProperty("id");
      expect(httpResponse).toHaveProperty("title");
      expect(httpResponse).toHaveProperty("description");
      expect(httpResponse).toHaveProperty("category");
      expect(httpResponse).toHaveProperty("tags");
      expect(httpResponse).toHaveProperty("status");
      expect(httpResponse).toHaveProperty("videoFilename");
      expect(httpResponse).toHaveProperty("videoMimeType");
      expect(httpResponse).toHaveProperty("videoSize");
      expect(httpResponse).toHaveProperty("videoManifestUrl");
      expect(httpResponse).toHaveProperty("thumbFilename");
      expect(httpResponse).toHaveProperty("thumbMimeType");
      expect(httpResponse).toHaveProperty("thumbSize");
      expect(httpResponse).toHaveProperty("thumbUrl");
      expect(httpResponse).toHaveProperty("createdAt");
      expect(httpResponse).toHaveProperty("updatedAt");
      expect(httpResponse).toHaveProperty("uploadedAt");

      // Verify property count (17 properties)
      expect(Object.keys(httpResponse)).toHaveLength(17);
    });

    it("should not modify original Video entity", () => {
      const createdAt = new Date("2024-01-01");
      const video = Video.create({
        id: "video-immutable",
        title: "Original Title",
        category: VideoCategory.TECHNOLOGY,
        videoFilename: "video.mp4",
        videoMimeType: "video/mp4",
        videoSize: 1000,
        thumbFilename: "thumb.jpg",
        thumbMimeType: "image/jpeg",
        thumbSize: 50000,
        createdAt,
      });

      const originalTitle = video.title;
      const originalId = video.id;

      VideosControllerMapper.toHttp(video);

      expect(video.title).toBe(originalTitle);
      expect(video.id).toBe(originalId);
    });

    it("should format different date scenarios correctly", () => {
      const pastDate = new Date("2023-06-15T08:30:00Z");
      const recentDate = new Date("2024-12-31T23:59:59Z");
      const futureDate = new Date("2025-10-20T14:45:30Z");

      const video = Video.create({
        id: "video-dates-scenario",
        title: "Date Scenarios",
        category: VideoCategory.OTHER,
        videoFilename: "video.mp4",
        videoMimeType: "video/mp4",
        videoSize: 1000,
        thumbFilename: "thumb.jpg",
        thumbMimeType: "image/jpeg",
        thumbSize: 50000,
        createdAt: pastDate,
        updatedAt: recentDate,
        uploadedAt: futureDate,
      });

      const httpResponse = VideosControllerMapper.toHttp(video);

      expect(httpResponse.createdAt).toBe("2023-06-15T08:30:00.000Z");
      expect(httpResponse.updatedAt).toBe("2024-12-31T23:59:59.000Z");
      expect(httpResponse.uploadedAt).toBe("2025-10-20T14:45:30.000Z");
    });

    it("should handle large file sizes", () => {
      const largeSize = 5368709120; // 5 GB in bytes
      const video = Video.create({
        id: "video-large",
        title: "Large Video",
        category: VideoCategory.OTHER,
        videoFilename: "video.mp4",
        videoMimeType: "video/mp4",
        videoSize: largeSize,
        thumbFilename: "thumb.jpg",
        thumbMimeType: "image/jpeg",
        thumbSize: 50000,
      });

      const httpResponse = VideosControllerMapper.toHttp(video);

      expect(httpResponse.videoSize).toBe(largeSize);
    });

    it("should handle minimal video creation", () => {
      const video = Video.create({
        id: "video-minimal",
        title: "Minimal",
        category: VideoCategory.OTHER,
        videoFilename: "video.mp4",
        videoMimeType: "video/mp4",
        videoSize: 1,
        thumbFilename: "thumb.jpg",
        thumbMimeType: "image/jpeg",
        thumbSize: 50000,
      });

      const httpResponse = VideosControllerMapper.toHttp(video);

      expect(httpResponse.id).toBe("video-minimal");
      expect(httpResponse.title).toBe("Minimal");
      expect(httpResponse.videoSize).toBe(1);
      expect(httpResponse.createdAt).toBeDefined();
      expect(httpResponse.updatedAt).toBeDefined();
      expect(httpResponse.uploadedAt).toBeDefined();
    });

    it("should handle special characters in title and description", () => {
      const specialTitle = "Video: Test & Demo (2024) <New>";
      const specialDescription = 'Description with "quotes" and \'apostrophes\' & symbols!@#$%';

      const video = Video.create({
        id: "video-special",
        title: specialTitle,
        description: specialDescription,
        category: VideoCategory.OTHER,
        videoFilename: "video.mp4",
        videoMimeType: "video/mp4",
        videoSize: 1000,
        thumbFilename: "thumb.jpg",
        thumbMimeType: "image/jpeg",
        thumbSize: 50000,
      });

      const httpResponse = VideosControllerMapper.toHttp(video);

      expect(httpResponse.title).toBe(specialTitle);
      expect(httpResponse.description).toBe(specialDescription);
    });

    it("should handle tags with special characters", () => {
      const tags = ["c++", "c#", "node.js", "web-api", "learning_path"];
      const video = Video.create({
        id: "video-special-tags",
        title: "Video with Special Tags",
        category: VideoCategory.TECHNOLOGY,
        tags,
        videoFilename: "video.mp4",
        videoMimeType: "video/mp4",
        videoSize: 1000,
        thumbFilename: "thumb.jpg",
        thumbMimeType: "image/jpeg",
        thumbSize: 50000,
      });

      const httpResponse = VideosControllerMapper.toHttp(video);

      expect(httpResponse.tags).toEqual(tags);
    });

    it("should return response suitable for JSON serialization", () => {
      const video = Video.create({
        id: "video-json",
        title: "JSON Serialization Test",
        description: "Testing JSON",
        category: VideoCategory.ENTERTAINMENT,
        tags: ["json", "serialization"],
        status: VideoStatus.PROCESSED,
        videoFilename: "video.mp4",
        videoMimeType: "video/mp4",
        videoSize: 2048,
        thumbFilename: "thumb.jpg",
        thumbMimeType: "image/jpeg",
        thumbSize: 50000,
      });

      const httpResponse = VideosControllerMapper.toHttp(video);
      const jsonString = JSON.stringify(httpResponse);
      const parsed = JSON.parse(jsonString);

      expect(parsed.id).toBe(video.id);
      expect(parsed.title).toBe(video.title);
      expect(parsed.createdAt).toBe(video.createdAt.toISOString());
    });
  });
});
