import { VideoCategory, VideoStatus } from '../../domain/entities/video.entity';
import { IVideosRepository } from '../../domain/repositories/videos-repository.interface';
import { IStorageService } from '../../domain/services/storage/storage.interface';
import { CreateVideoMetadataUseCase } from './create-video-metadata.usecase';

describe('CreateVideoMetadataUseCase', () => {
  let usecase: CreateVideoMetadataUseCase;
  let mockRepository: jest.Mocked<IVideosRepository>;
  let mockStorageService: jest.Mocked<IStorageService>;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn().mockResolvedValue(undefined),
      findById: jest.fn(),
      findAll: jest.fn(),
    };

    mockStorageService = {
      presign: jest.fn().mockResolvedValue('https://example.com/presigned/thumb'),
      initiateMultipartUpload: jest.fn().mockResolvedValue({
        uploadId: 'test-upload-id',
        url: 'https://example.com/presigned/video',
      }),
    };

    usecase = new CreateVideoMetadataUseCase(mockRepository, mockStorageService);
  });

  const validPayload = {
    title: 'Test Video',
    description: 'A test video description',
    category: VideoCategory.TECHNOLOGY,
    tags: ['typescript', 'tutorial'],
    video: {
      filename: 'video.mp4',
      mimeType: 'video/mp4',
      size: 1024000,
    },
    thumbnail: {
      filename: 'thumb.jpg',
      mimeType: 'image/jpeg',
      size: 51200,
    },
  };

  describe('execute', () => {
    it('should create and save a video with valid payload', async () => {
      const result = await usecase.execute(validPayload);

      expect(result).toBeDefined();
      expect(result.videoMetadata).toBeDefined();
      expect(result.videoMetadata.id).toBeDefined();
      expect(result.videoMetadata.title).toBe('Test Video');
      expect(result.videoMetadata.description).toBe('A test video description');
      expect(result.videoMetadata.category).toBe(VideoCategory.TECHNOLOGY);
      expect(result.videoMetadata.tags).toEqual(['typescript', 'tutorial']);
      expect(result.videoMetadata.videoFilename).toBe('video.mp4');
      expect(result.videoMetadata.videoSize).toBe(1024000);
    });

    it('should call repository save method', async () => {
      await usecase.execute(validPayload);

      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      expect(mockRepository.save).toHaveBeenCalledWith(expect.any(Object));
    });

    it('should save a video with all properties', async () => {
      await usecase.execute(validPayload);

      const savedVideo = mockRepository.save.mock.calls[0][0];

      expect(savedVideo.id).toBeDefined();
      expect(savedVideo.title).toBe('Test Video');
      expect(savedVideo.description).toBe('A test video description');
      expect(savedVideo.category).toBe(VideoCategory.TECHNOLOGY);
      expect(savedVideo.tags).toEqual(['typescript', 'tutorial']);
      expect(savedVideo.videoFilename).toBe('video.mp4');
      expect(savedVideo.videoSize).toBe(1024000);
      expect(savedVideo.status).toBe(VideoStatus.UPLOADING);
    });

    it('should create video without description', async () => {
      const payload = {
        title: 'Test Video',
        category: VideoCategory.GAMING,
        video: {
          filename: 'video.mp4',
          mimeType: 'video/mp4',
          size: 2048000,
        },
        thumbnail: {
          filename: 'thumb.jpg',
          mimeType: 'image/jpeg',
          size: 51200,
        },
      };

      const result = await usecase.execute(payload);

      expect(result.videoMetadata.title).toBe('Test Video');
      expect(result.videoMetadata.description).toBeUndefined();
      expect(result.videoMetadata.category).toBe(VideoCategory.GAMING);
    });

    it('should create video without tags', async () => {
      const payload = {
        title: 'Test Video',
        category: VideoCategory.MUSIC,
        video: {
          filename: 'video.mp4',
          mimeType: 'video/mp4',
          size: 512000,
        },
        thumbnail: {
          filename: 'thumb.jpg',
          mimeType: 'image/jpeg',
          size: 51200,
        },
      };

      const result = await usecase.execute(payload);

      expect(result.videoMetadata.tags).toEqual([]);
    });

    it('should create video with empty tags array', async () => {
      const payload = {
        title: 'Test Video',
        category: VideoCategory.ENTERTAINMENT,
        tags: [],
        video: {
          filename: 'video.mp4',
          mimeType: 'video/mp4',
          size: 1024000,
        },
        thumbnail: {
          filename: 'thumb.jpg',
          mimeType: 'image/jpeg',
          size: 51200,
        },
      };

      const result = await usecase.execute(payload);

      expect(result.videoMetadata.tags).toEqual([]);
    });

    it('should generate unique id for each video', async () => {
      const result1 = await usecase.execute(validPayload);

      const result2 = await usecase.execute({
        ...validPayload,
        title: 'Another Video',
      });

      expect(result1.videoMetadata.id).not.toBe(result2.videoMetadata.id);
    });

    it('should set initial status to UPLOADING', async () => {
      const result = await usecase.execute(validPayload);

      expect(result.videoMetadata.status).toBe(VideoStatus.UPLOADING);
    });

    it('should set createdAt timestamp', async () => {
      const result = await usecase.execute(validPayload);

      expect(result.videoMetadata.createdAt).toBeInstanceOf(Date);
    });

    it('should set uploadedAt timestamp', async () => {
      const result = await usecase.execute(validPayload);

      expect(result.videoMetadata.uploadedAt).toBeInstanceOf(Date);
    });

    it('should handle different video categories', async () => {
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

      for (const category of categories) {
        const result = await usecase.execute({
          ...validPayload,
          category,
        });

        expect(result.videoMetadata.category).toBe(category);
      }
    });

    it('should handle video with large file size', async () => {
      const largeSize = 5 * 1024 * 1024 * 1024; // 5GB

      const result = await usecase.execute({
        ...validPayload,
        video: {
          filename: 'large-video.mp4',
          mimeType: 'video/mp4',
          size: largeSize,
        },
      });

      expect(result.videoMetadata.videoSize).toBe(largeSize);
    });

    it('should handle video with multiple tags', async () => {
      const tags = [
        'tutorial',
        'typescript',
        'nodejs',
        'backend',
        'javascript',
      ];

      const result = await usecase.execute({
        ...validPayload,
        tags,
      });

      expect(result.videoMetadata.tags).toEqual(tags);
    });

    it('should handle different MIME types', async () => {
      const mimeTypes = [
        'video/mp4',
        'video/mpeg',
        'video/quicktime',
        'video/webm',
        'video/x-msvideo',
      ];

      for (const mimeType of mimeTypes) {
        const result = await usecase.execute({
          ...validPayload,
          video: {
            filename: 'video.file',
            mimeType,
            size: 1024000,
          },
        });

        expect(result.videoMetadata.videoMimeType).toBe(mimeType);
      }
    });

    it('should throw if repository save fails', async () => {
      mockRepository.save.mockRejectedValueOnce(
        new Error('Database error')
      );

      await expect(usecase.execute(validPayload)).rejects.toThrow(
        'Database error'
      );
    });



    it('should preserve all optional fields in the returned video', async () => {
      const payload = {
        title: 'Comprehensive Test Video',
        description: 'A comprehensive description with special chars: @#$%',
        category: VideoCategory.EDUCATION,
        tags: ['complex', 'example', 'test'],
        video: {
          filename: 'comprehensive.mp4',
          mimeType: 'video/mp4',
          size: 3000000,
        },
        thumbnail: {
          filename: 'comprehensive-thumb.jpg',
          mimeType: 'image/jpeg',
          size: 51200,
        },
      };

      const result = await usecase.execute(payload);

      expect(result.videoMetadata.title).toBe(payload.title);
      expect(result.videoMetadata.description).toBe(payload.description);
      expect(result.videoMetadata.category).toBe(payload.category);
      expect(result.videoMetadata.tags).toEqual(payload.tags);
      expect(result.videoMetadata.videoFilename).toBe(payload.video.filename);
      expect(result.videoMetadata.videoSize).toBe(payload.video.size);
    });

    it('should call repository save with the created video instance', async () => {
      await usecase.execute(validPayload);

      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test Video',
          description: 'A test video description',
          category: VideoCategory.TECHNOLOGY,
          videoFilename: 'video.mp4',
          videoSize: 1024000,
        })
      );
    });

    it('should return the created video from execute', async () => {
      const result = await usecase.execute(validPayload);

      expect(result).toHaveProperty('videoMetadata');
      expect(result.videoMetadata).toHaveProperty('id');
      expect(result.videoMetadata).toHaveProperty('title');
      expect(result.videoMetadata).toHaveProperty('category');
      expect(result.videoMetadata).toHaveProperty('videoFilename');
      expect(result.videoMetadata).toHaveProperty('videoSize');
      expect(result.videoMetadata).toHaveProperty('status');
      expect(result.videoMetadata).toHaveProperty('createdAt');
      expect(result.videoMetadata).toHaveProperty('uploadedAt');
      expect(result.videoMetadata).toHaveProperty('updatedAt');
    });

    it('should return presigned URLs for video and thumbnail', async () => {
      const result = await usecase.execute(validPayload);

      expect(result).toHaveProperty('presignedUrls');
      expect(result.presignedUrls.video).toHaveProperty('uploadId');
      expect(result.presignedUrls.video).toHaveProperty('url');
      expect(result.presignedUrls.thumbnail).toHaveProperty('url');
      expect(typeof result.presignedUrls.video.uploadId).toBe('string');
      expect(typeof result.presignedUrls.video.url).toBe('string');
      expect(typeof result.presignedUrls.thumbnail.url).toBe('string');
    });

    it('should call storage service to generate presigned URLs', async () => {
      await usecase.execute(validPayload);

      expect(mockStorageService.initiateMultipartUpload).toHaveBeenCalledTimes(1);
      expect(mockStorageService.initiateMultipartUpload).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.any(String),
          filename: 'video.mp4',
          mimeType: 'video/mp4',
          resourceType: 'video',
        })
      );

      expect(mockStorageService.presign).toHaveBeenCalledTimes(1);
      expect(mockStorageService.presign).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.any(String),
          filename: 'thumb.jpg',
          mimeType: 'image/jpeg',
          resourceType: 'thumb',
        })
      );
    });
  });

  describe('integration scenarios', () => {
    it('should handle rapid successive video creation', async () => {
      const videos = await Promise.all([
        usecase.execute(validPayload),
        usecase.execute({ ...validPayload, title: 'Video 2' }),
        usecase.execute({ ...validPayload, title: 'Video 3' }),
      ]);

      expect(videos).toHaveLength(3);
      expect(videos[0].videoMetadata.id).not.toBe(videos[1].videoMetadata.id);
      expect(videos[1].videoMetadata.id).not.toBe(videos[2].videoMetadata.id);
      expect(mockRepository.save).toHaveBeenCalledTimes(3);
    });

    it('should handle description with special characters', async () => {
      const payload = {
        ...validPayload,
        description:
          'Special chars: !@#$%^&*()_+-=[]{}|;:,.<>?/~ "quotes" \'apostrophe\'',
      };

      const result = await usecase.execute(payload);

      expect(result.videoMetadata.description).toBe(
        'Special chars: !@#$%^&*()_+-=[]{}|;:,.<>?/~ "quotes" \'apostrophe\''
      );
    });

    it('should handle very long title', async () => {
      const longTitle = 'A'.repeat(500);

      const result = await usecase.execute({
        ...validPayload,
        title: longTitle,
      });

      expect(result.videoMetadata.title).toBe(longTitle);
    });
  });
});
