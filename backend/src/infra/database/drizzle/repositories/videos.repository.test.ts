import { Video, VideoCategory, VideoStatus } from "../../../../domain/entities/video.entity";
import { DrizzleVideosRepository } from "./videos.repository";

describe("DrizzleVideosRepository", () => {
  let repository: DrizzleVideosRepository;
  let mockDrizzleClient: any;

  beforeEach(() => {
    mockDrizzleClient = {
      insert: jest.fn(),
      select: jest.fn(),
    };
    repository = new DrizzleVideosRepository(mockDrizzleClient);
  });

  describe("save", () => {
    it("should insert a video into the database", async () => {
      const video = Video.create({
        id: "video-123",
        title: "Test Video",
        description: "Test Description",
        category: VideoCategory.EDUCATION,
        tags: ["javascript", "testing"],
        status: VideoStatus.UPLOADED,
        mimeType: "video/mp4",
        size: 1024000,
      });

      const mockInsertChain = {
        values: jest.fn().mockResolvedValue(undefined),
      };
      mockDrizzleClient.insert.mockReturnValue(mockInsertChain);

      await repository.save(video);

      expect(mockDrizzleClient.insert).toHaveBeenCalled();
      expect(mockInsertChain.values).toHaveBeenCalled();

      const insertedValue = mockInsertChain.values.mock.calls[0][0];
      expect(insertedValue.id).toBe("video-123");
      expect(insertedValue.title).toBe("Test Video");
      expect(insertedValue.tags).toBe("javascript,testing");
      expect(insertedValue.mimeType).toBe("video/mp4");
    });

    it("should map video properties correctly when saving", async () => {
      const video = Video.create({
        id: "video-456",
        title: "Another Video",
        category: VideoCategory.MUSIC,
        tags: ["pop", "rock"],
        mimeType: "video/webm",
        size: 2048000,
        status: VideoStatus.PROCESSING,
      });

      const mockInsertChain = {
        values: jest.fn().mockResolvedValue(undefined),
      };
      mockDrizzleClient.insert.mockReturnValue(mockInsertChain);

      await repository.save(video);

      const insertedValue = mockInsertChain.values.mock.calls[0][0];
      expect(insertedValue).toHaveProperty("id");
      expect(insertedValue).toHaveProperty("title");
      expect(insertedValue).toHaveProperty("description");
      expect(insertedValue).toHaveProperty("category");
      expect(insertedValue).toHaveProperty("tags");
      expect(insertedValue).toHaveProperty("mimeType");
      expect(insertedValue).toHaveProperty("size");
      expect(insertedValue).toHaveProperty("status");
      expect(insertedValue).toHaveProperty("createdAt");
      expect(insertedValue).toHaveProperty("updatedAt");
      expect(insertedValue).toHaveProperty("uploadedAt");
    });

    it("should handle videos without optional fields", async () => {
      const video = Video.create({
        id: "video-789",
        title: "Minimal Video",
        category: VideoCategory.OTHER,
        mimeType: "video/avi",
        size: 512000,
      });

      const mockInsertChain = {
        values: jest.fn().mockResolvedValue(undefined),
      };
      mockDrizzleClient.insert.mockReturnValue(mockInsertChain);

      await repository.save(video);

      const insertedValue = mockInsertChain.values.mock.calls[0][0];
      expect(insertedValue.id).toBe("video-789");
      expect(insertedValue.tags).toBe("");
    });
  });

  describe("findById", () => {
    it("should return a video when found", async () => {
      const rawVideoData = {
        id: "video-123",
        title: "Test Video",
        description: "Test Description",
        category: VideoCategory.EDUCATION,
        tags: "javascript,testing",
        status: VideoStatus.UPLOADED,
        mimeType: "video/mp4",
        size: 1024000,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-02"),
        uploadedAt: new Date("2024-01-01T10:00:00"),
      };

      const mockSelectChain = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        get: jest.fn().mockResolvedValue(rawVideoData),
      };
      mockDrizzleClient.select.mockReturnValue(mockSelectChain);

      const result = await repository.findById("video-123");

      expect(result).toBeInstanceOf(Video);
      expect(result?.id).toBe("video-123");
      expect(result?.title).toBe("Test Video");
      expect(mockDrizzleClient.select).toHaveBeenCalled();
      expect(mockSelectChain.get).toHaveBeenCalled();
    });

    it("should return null when video is not found", async () => {
      const mockSelectChain = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        get: jest.fn().mockResolvedValue(null),
      };
      mockDrizzleClient.select.mockReturnValue(mockSelectChain);

      const result = await repository.findById("non-existent-id");

      expect(result).toBeNull();
      expect(mockSelectChain.get).toHaveBeenCalled();
    });

    it("should properly filter by id in the where clause", async () => {
      const mockSelectChain = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        get: jest.fn().mockResolvedValue(null),
      };
      mockDrizzleClient.select.mockReturnValue(mockSelectChain);

      await repository.findById("video-456");

      expect(mockSelectChain.where).toHaveBeenCalled();
    });

    it("should map database result to Video entity with all properties", async () => {
      const rawVideoData = {
        id: "video-complete",
        title: "Complete Video",
        description: "Full description",
        category: VideoCategory.TECHNOLOGY,
        tags: "typescript,jest,testing",
        status: VideoStatus.PROCESSED,
        mimeType: "video/mp4",
        size: 5242880,
        createdAt: new Date("2024-02-01"),
        updatedAt: new Date("2024-02-02"),
        uploadedAt: new Date("2024-02-01T12:00:00"),
      };

      const mockSelectChain = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        get: jest.fn().mockResolvedValue(rawVideoData),
      };
      mockDrizzleClient.select.mockReturnValue(mockSelectChain);

      const result = await repository.findById("video-complete");

      expect(result?.id).toBe("video-complete");
      expect(result?.title).toBe("Complete Video");
      expect(result?.description).toBe("Full description");
      expect(result?.category).toBe(VideoCategory.TECHNOLOGY);
      expect(result?.tags).toEqual(["typescript", "jest", "testing"]);
      expect(result?.status).toBe(VideoStatus.PROCESSED);
      expect(result?.mimeType).toBe("video/mp4");
      expect(result?.size).toBe(5242880);
    });
  });

  describe("findAll", () => {
    it("should return all videos from the database", async () => {
      const rawVideosData = [
        {
          id: "video-1",
          title: "Video 1",
          description: "Description 1",
          category: VideoCategory.EDUCATION,
          tags: "tag1,tag2",
          status: VideoStatus.UPLOADED,
          mimeType: "video/mp4",
          size: 1024000,
          createdAt: new Date(),
          updatedAt: new Date(),
          uploadedAt: new Date(),
        },
        {
          id: "video-2",
          title: "Video 2",
          description: "Description 2",
          category: VideoCategory.ENTERTAINMENT,
          tags: "tag3,tag4",
          status: VideoStatus.PROCESSING,
          mimeType: "video/webm",
          size: 2048000,
          createdAt: new Date(),
          updatedAt: new Date(),
          uploadedAt: new Date(),
        },
      ];

      const mockSelectChain = {
        from: jest.fn().mockReturnThis(),
        all: jest.fn().mockResolvedValue(rawVideosData),
      };
      mockDrizzleClient.select.mockReturnValue(mockSelectChain);

      const result = await repository.findAll();

      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(Video);
      expect(result[1]).toBeInstanceOf(Video);
      expect(result[0].id).toBe("video-1");
      expect(result[1].id).toBe("video-2");
    });

    it("should return an empty array when no videos exist", async () => {
      const mockSelectChain = {
        from: jest.fn().mockReturnThis(),
        all: jest.fn().mockResolvedValue([]),
      };
      mockDrizzleClient.select.mockReturnValue(mockSelectChain);

      const result = await repository.findAll();

      expect(result).toEqual([]);
    });

    it("should map all database results to Video entities", async () => {
      const rawVideosData = [
        {
          id: "video-a",
          title: "Video A",
          description: "Description A",
          category: VideoCategory.MUSIC,
          tags: "music,pop",
          status: VideoStatus.UPLOADED,
          mimeType: "video/mp4",
          size: 1500000,
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-01-02"),
          uploadedAt: new Date("2024-01-01T10:00:00"),
        },
        {
          id: "video-b",
          title: "Video B",
          description: "Description B",
          category: VideoCategory.SPORTS,
          tags: "sports,football",
          status: VideoStatus.PROCESSED,
          mimeType: "video/avi",
          size: 3000000,
          createdAt: new Date("2024-01-05"),
          updatedAt: new Date("2024-01-06"),
          uploadedAt: new Date("2024-01-05T15:00:00"),
        },
      ];

      const mockSelectChain = {
        from: jest.fn().mockReturnThis(),
        all: jest.fn().mockResolvedValue(rawVideosData),
      };
      mockDrizzleClient.select.mockReturnValue(mockSelectChain);

      const result = await repository.findAll();

      expect(result[0].title).toBe("Video A");
      expect(result[0].category).toBe(VideoCategory.MUSIC);
      expect(result[0].tags).toEqual(["music", "pop"]);

      expect(result[1].title).toBe("Video B");
      expect(result[1].category).toBe(VideoCategory.SPORTS);
      expect(result[1].tags).toEqual(["sports", "football"]);
    });

    it("should call select().from() chain correctly", async () => {
      const mockSelectChain = {
        from: jest.fn().mockReturnThis(),
        all: jest.fn().mockResolvedValue([]),
      };
      mockDrizzleClient.select.mockReturnValue(mockSelectChain);

      await repository.findAll();

      expect(mockDrizzleClient.select).toHaveBeenCalled();
      expect(mockSelectChain.from).toHaveBeenCalled();
      expect(mockSelectChain.all).toHaveBeenCalled();
    });
  });

  describe("integration scenarios", () => {
    it("should implement IVideosRepository interface", () => {
      expect(repository).toHaveProperty("save");
      expect(repository).toHaveProperty("findById");
      expect(repository).toHaveProperty("findAll");
      expect(typeof repository.save).toBe("function");
      expect(typeof repository.findById).toBe("function");
      expect(typeof repository.findAll).toBe("function");
    });

    it("should handle concurrent operations", async () => {
      const mockInsertChain = {
        values: jest.fn().mockResolvedValue(undefined),
      };
      mockDrizzleClient.insert.mockReturnValue(mockInsertChain);

      const video1 = Video.create({
        id: "video-1",
        title: "Video 1",
        category: VideoCategory.OTHER,
        mimeType: "video/mp4",
        size: 1000,
      });

      const video2 = Video.create({
        id: "video-2",
        title: "Video 2",
        category: VideoCategory.OTHER,
        mimeType: "video/mp4",
        size: 2000,
      });

      await Promise.all([repository.save(video1), repository.save(video2)]);

      expect(mockInsertChain.values).toHaveBeenCalledTimes(2);
    });
  });
});
