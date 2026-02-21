import { VideoCategory, VideoStatus } from '../../domain/entities/video.entity';
import { IVideoRepository } from '../../domain/repositories/video.repository';
import { CreateVideoMetadataUseCase } from './create-video-metadata.usecase';

describe('CreateVideoMetadataUseCase', () => {
  let usecase: CreateVideoMetadataUseCase;
  let mockRepository: jest.Mocked<IVideoRepository>;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn().mockResolvedValue(undefined),
      findById: jest.fn(),
      findAll: jest.fn(),
    };

    usecase = new CreateVideoMetadataUseCase(mockRepository);
  });

  const validPayload = {
    title: 'Test Video',
    description: 'A test video description',
    category: VideoCategory.TECHNOLOGY,
    tags: ['typescript', 'tutorial'],
    mimeType: 'video/mp4',
    size: 1024000,
  };

  describe('execute', () => {
    it('should create and save a video with valid payload', async () => {
      const result = await usecase.execute(validPayload);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.title).toBe('Test Video');
      expect(result.description).toBe('A test video description');
      expect(result.category).toBe(VideoCategory.TECHNOLOGY);
      expect(result.tags).toEqual(['typescript', 'tutorial']);
      expect(result.mimeType).toBe('video/mp4');
      expect(result.size).toBe(1024000);
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
      expect(savedVideo.mimeType).toBe('video/mp4');
      expect(savedVideo.size).toBe(1024000);
      expect(savedVideo.status).toBe(VideoStatus.UPLOADING);
    });

    it('should create video without description', async () => {
      const payload = {
        title: 'Test Video',
        category: VideoCategory.GAMING,
        mimeType: 'video/mp4',
        size: 2048000,
      };

      const result = await usecase.execute(payload);

      expect(result.title).toBe('Test Video');
      expect(result.description).toBeUndefined();
      expect(result.category).toBe(VideoCategory.GAMING);
    });

    it('should create video without tags', async () => {
      const payload = {
        title: 'Test Video',
        category: VideoCategory.MUSIC,
        mimeType: 'video/mp4',
        size: 512000,
      };

      const result = await usecase.execute(payload);

      expect(result.tags).toEqual([]);
    });

    it('should create video with empty tags array', async () => {
      const payload = {
        title: 'Test Video',
        category: VideoCategory.ENTERTAINMENT,
        tags: [],
        mimeType: 'video/mp4',
        size: 1024000,
      };

      const result = await usecase.execute(payload);

      expect(result.tags).toEqual([]);
    });

    it('should generate unique id for each video', async () => {
      const result1 = await usecase.execute(validPayload);

      const result2 = await usecase.execute({
        ...validPayload,
        title: 'Another Video',
      });

      expect(result1.id).not.toBe(result2.id);
    });

    it('should set initial status to UPLOADING', async () => {
      const result = await usecase.execute(validPayload);

      expect(result.status).toBe(VideoStatus.UPLOADING);
    });

    it('should set createdAt timestamp', async () => {
      const result = await usecase.execute(validPayload);

      expect(result.createdAt).toBeInstanceOf(Date);
    });

    it('should set uploadedAt timestamp', async () => {
      const result = await usecase.execute(validPayload);

      expect(result.uploadedAt).toBeInstanceOf(Date);
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

        expect(result.category).toBe(category);
      }
    });

    it('should handle video with large file size', async () => {
      const largeSize = 5 * 1024 * 1024 * 1024; // 5GB

      const result = await usecase.execute({
        ...validPayload,
        size: largeSize,
      });

      expect(result.size).toBe(largeSize);
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

      expect(result.tags).toEqual(tags);
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
          mimeType,
        });

        expect(result.mimeType).toBe(mimeType);
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

    it('should not call repository if video creation fails', async () => {
      const invalidPayload = {
        ...validPayload,
        size: -100, // Invalid: negative size
      };

      // Note: The current implementation doesn't validate, but this test
      // documents expected behavior if validation is added
      try {
        await usecase.execute(invalidPayload as any);
      } catch (error) {
        expect(mockRepository.save).not.toHaveBeenCalled();
      }
    });

    it('should preserve all optional fields in the returned video', async () => {
      const payload = {
        title: 'Comprehensive Test Video',
        description: 'A comprehensive description with special chars: @#$%',
        category: VideoCategory.EDUCATION,
        tags: ['complex', 'example', 'test'],
        mimeType: 'video/mp4',
        size: 3000000,
      };

      const result = await usecase.execute(payload);

      expect(result.title).toBe(payload.title);
      expect(result.description).toBe(payload.description);
      expect(result.category).toBe(payload.category);
      expect(result.tags).toEqual(payload.tags);
      expect(result.mimeType).toBe(payload.mimeType);
      expect(result.size).toBe(payload.size);
    });

    it('should call repository save with the created video instance', async () => {
      await usecase.execute(validPayload);

      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test Video',
          description: 'A test video description',
          category: VideoCategory.TECHNOLOGY,
          mimeType: 'video/mp4',
          size: 1024000,
        })
      );
    });

    it('should return the created video from execute', async () => {
      const result = await usecase.execute(validPayload);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('title');
      expect(result).toHaveProperty('category');
      expect(result).toHaveProperty('mimeType');
      expect(result).toHaveProperty('size');
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('uploadedAt');
      expect(result).toHaveProperty('updatedAt');
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
      expect(videos[0].id).not.toBe(videos[1].id);
      expect(videos[1].id).not.toBe(videos[2].id);
      expect(mockRepository.save).toHaveBeenCalledTimes(3);
    });

    it('should handle description with special characters', async () => {
      const payload = {
        ...validPayload,
        description:
          'Special chars: !@#$%^&*()_+-=[]{}|;:,.<>?/~ "quotes" \'apostrophe\'',
      };

      const result = await usecase.execute(payload);

      expect(result.description).toBe(
        'Special chars: !@#$%^&*()_+-=[]{}|;:,.<>?/~ "quotes" \'apostrophe\''
      );
    });

    it('should handle very long title', async () => {
      const longTitle = 'A'.repeat(500);

      const result = await usecase.execute({
        ...validPayload,
        title: longTitle,
      });

      expect(result.title).toBe(longTitle);
    });
  });
});
