import { CreateMultipartUploadCommand, PutObjectCommand, S3Client, UploadPartCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3StorageService } from "./s3";

// Mock only the S3Client and getSignedUrl, not the command classes
jest.mock("@aws-sdk/client-s3", () => ({
  ...jest.requireActual("@aws-sdk/client-s3"),
  S3Client: jest.fn(),
}));

jest.mock("@aws-sdk/s3-request-presigner", () => ({
  ...jest.requireActual("@aws-sdk/s3-request-presigner"),
  getSignedUrl: jest.fn(),
}));

describe("S3StorageService", () => {
  let service: S3StorageService;
  let mockS3Client: any;
  let mockGetSignedUrl: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockS3Client = {
      send: jest.fn() as jest.Mock,
    };

    (S3Client as jest.Mock).mockImplementation(() => mockS3Client);

    mockGetSignedUrl = getSignedUrl as unknown as jest.Mock;
    mockGetSignedUrl.mockResolvedValue("https://example.com/presigned-url");

    service = new S3StorageService();
  });

  describe("presign", () => {
    it("should presign a single file upload", async () => {
      const params = {
        id: "video-123",
        filename: "video.mp4",
        mimeType: "video/mp4",
        resourceType: "video" as const,
      };

      const url = await service.presign(params);

      expect(mockGetSignedUrl).toHaveBeenCalledWith(
        mockS3Client,
        expect.any(PutObjectCommand),
        { expiresIn: 3600 }
      );
      expect(url).toBe("https://example.com/presigned-url");
    });

    it("should presign a multipart upload part", async () => {
      const params = {
        id: "video-123",
        filename: "video.mp4",
        mimeType: "video/mp4",
        resourceType: "video" as const,
        uploadId: "upload-123",
        part: 1,
      };

      const url = await service.presign(params);

      expect(mockGetSignedUrl).toHaveBeenCalledWith(
        mockS3Client,
        expect.any(UploadPartCommand),
        { expiresIn: 3600 }
      );
      expect(url).toBe("https://example.com/presigned-url");
    });

    it("should include correct S3 key format", async () => {
      const params = {
        id: "video-123",
        filename: "video.mp4",
        mimeType: "video/mp4",
        resourceType: "video" as const,
      };

      await service.presign(params);

      const putCommand = (mockGetSignedUrl.mock.calls[0][1] as any);
      expect(putCommand.input.Key).toBe("video/video-123/video.mp4");
      expect(putCommand.input.Bucket).toBe("videos");
      expect(putCommand.input.ContentType).toBe("video/mp4");
    });

    it("should set correct expiration time", async () => {
      const params = {
        id: "video-123",
        filename: "video.mp4",
        mimeType: "video/mp4",
        resourceType: "video" as const,
      };

      await service.presign(params);

      expect(mockGetSignedUrl).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        { expiresIn: 3600 }
      );
    });

    it("should handle thumbnail resource type", async () => {
      const params = {
        id: "video-123",
        filename: "thumb.jpg",
        mimeType: "image/jpeg",
        resourceType: "thumb" as const,
      };

      await service.presign(params);

      const putCommand = (mockGetSignedUrl.mock.calls[0][1] as any);
      expect(putCommand.input.Key).toBe("thumb/video-123/thumb.jpg");
      expect(putCommand.input.ContentType).toBe("image/jpeg");
    });

    it("should handle multipart upload with correct part number", async () => {
      const params = {
        id: "video-123",
        filename: "video.mp4",
        mimeType: "video/mp4",
        resourceType: "video" as const,
        uploadId: "upload-123",
        part: 2,
      };

      await service.presign(params);

      const uploadPartCommand = (mockGetSignedUrl.mock.calls[0][1] as any);
      expect(uploadPartCommand.input.PartNumber).toBe(2);
      expect(uploadPartCommand.input.UploadId).toBe("upload-123");
      expect(uploadPartCommand.input.Key).toBe("video/video-123/video.mp4");
    });
  });

  describe("initiateMultipartUpload", () => {
    it("should initiate multipart upload and return uploadId and url", async () => {
      mockS3Client.send.mockResolvedValueOnce({ UploadId: "upload-123" });

      const params = {
        id: "video-123",
        filename: "video.mp4",
        mimeType: "video/mp4",
        resourceType: "video" as const,
      };

      const result = await service.initiateMultipartUpload(params);

      expect(mockS3Client.send).toHaveBeenCalledWith(
        expect.any(CreateMultipartUploadCommand)
      );
      expect(result.uploadId).toBe("upload-123");
      expect(result.url).toBe("https://example.com/presigned-url");
    });

    it("should send CreateMultipartUploadCommand with correct parameters", async () => {
      mockS3Client.send.mockResolvedValueOnce({ UploadId: "upload-123" });

      const params = {
        id: "video-123",
        filename: "video.mp4",
        mimeType: "video/mp4",
        resourceType: "video" as const,
      };

      await service.initiateMultipartUpload(params);

      expect(mockS3Client.send).toHaveBeenCalledTimes(1);
      const command = (mockS3Client.send.mock.calls[0][0] as any);
      expect(command.input.Bucket).toBe("videos");
      expect(command.input.Key).toBe("video/video-123/video.mp4");
      expect(command.input.ContentType).toBe("video/mp4");
    });

    it("should generate presigned URL for first part after upload initiation", async () => {
      mockS3Client.send.mockResolvedValueOnce({ UploadId: "upload-123" });

      const params = {
        id: "video-123",
        filename: "video.mp4",
        mimeType: "video/mp4",
        resourceType: "video" as const,
      };

      await service.initiateMultipartUpload(params);

      expect(mockGetSignedUrl).toHaveBeenCalled();
      const uploadPartCommand = (mockGetSignedUrl.mock.calls[0][1] as any);
      expect(uploadPartCommand.input.UploadId).toBe("upload-123");
    });

    it("should handle thumbnail multipart uploads", async () => {
      mockS3Client.send.mockResolvedValueOnce({ UploadId: "upload-456" });

      const params = {
        id: "video-456",
        filename: "thumb.jpg",
        mimeType: "image/jpeg",
        resourceType: "thumb" as const,
      };

      const result = await service.initiateMultipartUpload(params);

      expect(result.uploadId).toBe("upload-456");
      const createCommand = (mockS3Client.send.mock.calls[0][0] as any);
      expect(createCommand.input.Key).toBe("thumb/video-456/thumb.jpg");
      expect(createCommand.input.ContentType).toBe("image/jpeg");
    });

    it("should return both uploadId and presigned URL", async () => {
      mockS3Client.send.mockResolvedValueOnce({ UploadId: "upload-789" });
      mockGetSignedUrl.mockResolvedValueOnce("https://example.com/upload-url");

      const params = {
        id: "video-789",
        filename: "video.mp4",
        mimeType: "video/mp4",
        resourceType: "video" as const,
      };

      const result = await service.initiateMultipartUpload(params);

      expect(result).toEqual({
        uploadId: "upload-789",
        url: "https://example.com/upload-url",
      });
    });
  });

  describe("S3Client initialization", () => {
    it("should initialize S3Client with correct configuration", () => {
      new S3StorageService();

      expect(S3Client).toHaveBeenCalledWith({
        region: expect.any(String),
        endpoint: expect.any(String),
        credentials: {
          accessKeyId: expect.any(String),
          secretAccessKey: expect.any(String),
        },
        forcePathStyle: true,
      });
    });

    it("should use environment variables for configuration", () => {
      new S3StorageService();

      const config = (S3Client as jest.Mock).mock.calls[0][0];
      expect(config.region).toBeDefined();
      expect(config.endpoint).toBeDefined();
      expect(config.credentials.accessKeyId).toBeDefined();
      expect(config.credentials.secretAccessKey).toBeDefined();
    });
  });

  describe("edge cases", () => {
    it("should handle special characters in filename", async () => {
      const params = {
        id: "video-123",
        filename: "my video (2024) [final].mp4",
        mimeType: "video/mp4",
        resourceType: "video" as const,
      };

      await service.presign(params);

      const putCommand = (mockGetSignedUrl.mock.calls[0][1] as any);
      expect(putCommand.input.Key).toContain("my video (2024) [final].mp4");
    });

    it("should handle different MIME types", async () => {
      const mimeTypes = ["video/mp4", "video/webm", "video/avi", "image/jpeg", "image/png"];

      for (const mimeType of mimeTypes) {
        mockGetSignedUrl.mockResolvedValueOnce("https://example.com/url");

        const params = {
          id: "video-123",
          filename: "file.ext",
          mimeType,
          resourceType: "video" as const,
        };

        await service.presign(params);
      }

      expect(mockGetSignedUrl).toHaveBeenCalledTimes(5);
    });

    it("should handle large part numbers in multipart upload", async () => {
      const params = {
        id: "video-123",
        filename: "video.mp4",
        mimeType: "video/mp4",
        resourceType: "video" as const,
        uploadId: "upload-123",
        part: 10000,
      };

      await service.presign(params);

      const uploadPartCommand = (mockGetSignedUrl.mock.calls[0][1] as any);
      expect(uploadPartCommand.input.PartNumber).toBe(10000);
    });
  });

  describe("integration scenarios", () => {
    it("should handle sequential multipart uploads", async () => {
      mockS3Client.send.mockResolvedValue({ UploadId: "upload-123" });
      mockGetSignedUrl.mockResolvedValue("https://example.com/presigned-url");

      const params = {
        id: "video-123",
        filename: "video.mp4",
        mimeType: "video/mp4",
        resourceType: "video" as const,
      };

      // Initiate upload
      const result1 = await service.initiateMultipartUpload(params);
      expect(result1.uploadId).toBeDefined();

      // Get presigned URL for part 2
      const result2 = await service.presign({
        ...params,
        uploadId: result1.uploadId,
        part: 2,
      });

      expect(result2).toBe("https://example.com/presigned-url");
      expect(mockGetSignedUrl).toHaveBeenCalledTimes(2); // Once for init, once for part 2
    });

    it("should handle concurrent presign requests", async () => {
      mockGetSignedUrl.mockResolvedValue("https://example.com/presigned-url");

      const params1 = {
        id: "video-1",
        filename: "video1.mp4",
        mimeType: "video/mp4",
        resourceType: "video" as const,
      };

      const params2 = {
        id: "video-2",
        filename: "video2.mp4",
        mimeType: "video/mp4",
        resourceType: "video" as const,
      };

      const [url1, url2] = await Promise.all([
        service.presign(params1),
        service.presign(params2),
      ]);

      expect(url1).toBe("https://example.com/presigned-url");
      expect(url2).toBe("https://example.com/presigned-url");
      expect(mockGetSignedUrl).toHaveBeenCalledTimes(2);
    });

    it("should handle upload with thumbnail in sequence", async () => {
      mockS3Client.send.mockResolvedValue({ UploadId: "upload-123" });
      mockGetSignedUrl.mockResolvedValue("https://example.com/presigned-url");

      // Video upload
      const videoResult = await service.initiateMultipartUpload({
        id: "video-123",
        filename: "video.mp4",
        mimeType: "video/mp4",
        resourceType: "video",
      });

      // Thumbnail presign (usually single upload, not multipart)
      const thumbResult = await service.presign({
        id: "video-123",
        filename: "thumb.jpg",
        mimeType: "image/jpeg",
        resourceType: "thumb",
      });

      expect(videoResult.uploadId).toBe("upload-123");
      expect(thumbResult).toBe("https://example.com/presigned-url");
    });
  });
});
