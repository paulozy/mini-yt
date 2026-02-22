import { IStorageService } from '../../domain/services/storage/storage.interface';
import { GetVideoPartPresignUrlDTO } from '../dtos/get-video-part-presign.dto';
import { GetVideoPartPresignUrlUseCase } from './get-video-part-presign-url.usecase';

describe('GetVideoPartPresignUrlUseCase', () => {
  let usecase: GetVideoPartPresignUrlUseCase;
  let mockStorageService: jest.Mocked<IStorageService>;

  beforeEach(() => {
    mockStorageService = {
      presign: jest.fn().mockResolvedValue('https://example.com/presigned/video-part'),
      initiateMultipartUpload: jest.fn(),
    };

    usecase = new GetVideoPartPresignUrlUseCase(mockStorageService);
  });

  const validPayload: GetVideoPartPresignUrlDTO = {
    videoId: 'video-123',
    filename: 'video.mp4',
    mimeType: 'video/mp4',
    uploadId: 'upload-456',
    partNumber: 1,
  };

  describe('execute', () => {
    it('should return a presigned URL for a video part', async () => {
      const result = await usecase.execute(validPayload);

      expect(result).toBe('https://example.com/presigned/video-part');
    });

    it('should call storageService.presign with correct parameters', async () => {
      await usecase.execute(validPayload);

      expect(mockStorageService.presign).toHaveBeenCalledTimes(1);
      expect(mockStorageService.presign).toHaveBeenCalledWith({
        id: 'video-123',
        filename: 'video.mp4',
        mimeType: 'video/mp4',
        uploadId: 'upload-456',
        part: 1,
        resourceType: 'video',
      });
    });

    it('should pass correct partNumber to storage service', async () => {
      const payload = {
        ...validPayload,
        partNumber: 3,
      };

      await usecase.execute(payload);

      const callArg = mockStorageService.presign.mock.calls[0][0];
      expect(callArg.part).toBe(3);
    });

    it('should pass correct uploadId to storage service', async () => {
      const payload = {
        ...validPayload,
        uploadId: 'different-upload-id',
      };

      await usecase.execute(payload);

      const callArg = mockStorageService.presign.mock.calls[0][0];
      expect(callArg.uploadId).toBe('different-upload-id');
    });

    it('should handle different video IDs', async () => {
      const payload = {
        ...validPayload,
        videoId: 'video-999',
      };

      await usecase.execute(payload);

      const callArg = mockStorageService.presign.mock.calls[0][0];
      expect(callArg.id).toBe('video-999');
    });

    it('should handle different filenames', async () => {
      const payload = {
        ...validPayload,
        filename: 'large-video.mkv',
      };

      await usecase.execute(payload);

      const callArg = mockStorageService.presign.mock.calls[0][0];
      expect(callArg.filename).toBe('large-video.mkv');
    });

    it('should handle different MIME types', async () => {
      const payload = {
        ...validPayload,
        mimeType: 'video/quicktime',
      };

      await usecase.execute(payload);

      const callArg = mockStorageService.presign.mock.calls[0][0];
      expect(callArg.mimeType).toBe('video/quicktime');
    });

    it('should always set resourceType to video', async () => {
      await usecase.execute(validPayload);

      const callArg = mockStorageService.presign.mock.calls[0][0];
      expect(callArg.resourceType).toBe('video');
    });

    it('should handle multiple sequential calls', async () => {
      const payload1 = {
        ...validPayload,
        partNumber: 1,
      };

      const payload2 = {
        ...validPayload,
        partNumber: 2,
      };

      mockStorageService.presign
        .mockResolvedValueOnce('https://example.com/presigned/part-1')
        .mockResolvedValueOnce('https://example.com/presigned/part-2');

      const result1 = await usecase.execute(payload1);
      const result2 = await usecase.execute(payload2);

      expect(result1).toBe('https://example.com/presigned/part-1');
      expect(result2).toBe('https://example.com/presigned/part-2');
      expect(mockStorageService.presign).toHaveBeenCalledTimes(2);
    });
  });

  describe('error handling', () => {
    it('should propagate storage service errors', async () => {
      const error = new Error('S3 service unavailable');
      mockStorageService.presign.mockRejectedValueOnce(error);

      await expect(usecase.execute(validPayload)).rejects.toThrow('S3 service unavailable');
    });

    it('should propagate storage service timeout errors', async () => {
      const error = new Error('Request timeout');
      mockStorageService.presign.mockRejectedValueOnce(error);

      await expect(usecase.execute(validPayload)).rejects.toThrow('Request timeout');
    });

    it('should handle invalid storage service state', async () => {
      const error = new Error('Storage service not initialized');
      mockStorageService.presign.mockRejectedValueOnce(error);

      await expect(usecase.execute(validPayload)).rejects.toThrow('Storage service not initialized');
    });

    it('should handle large part numbers', async () => {
      const payload = {
        ...validPayload,
        partNumber: 10000,
      };

      await usecase.execute(payload);

      const callArg = mockStorageService.presign.mock.calls[0][0];
      expect(callArg.part).toBe(10000);
    });
  });

  describe('payload validation', () => {
    it('should handle all payload fields correctly', async () => {
      const payload: GetVideoPartPresignUrlDTO = {
        videoId: 'unique-video-id',
        filename: 'segment-001.mp4',
        mimeType: 'video/mp4',
        uploadId: 'multipart-upload-id',
        partNumber: 5,
      };

      await usecase.execute(payload);

      const callArg = mockStorageService.presign.mock.calls[0][0];
      expect(callArg.id).toBe('unique-video-id');
      expect(callArg.filename).toBe('segment-001.mp4');
      expect(callArg.mimeType).toBe('video/mp4');
      expect(callArg.uploadId).toBe('multipart-upload-id');
      expect(callArg.part).toBe(5);
    });
  });
});
