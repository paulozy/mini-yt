import { Video, VideoCategory, VideoStatus } from './video.entity';

describe('Video Entity', () => {
  const validProps = {
    id: '123',
    title: 'Test Video',
    description: 'Test Description',
    category: VideoCategory.TECHNOLOGY,
    videoFilename: 'test-video.mp4',
    videoMimeType: 'video/mp4',
    videoSize: 1024000,
    thumbFilename: 'thumb.jpg',
    thumbMimeType: 'image/jpeg',
    thumbSize: 51200,
  };

  describe('create', () => {
    it('should create a new video instance with provided props', () => {
      const video = Video.create(validProps);

      expect(video.id).toBe('123');
      expect(video.title).toBe('Test Video');
      expect(video.description).toBe('Test Description');
      expect(video.category).toBe(VideoCategory.TECHNOLOGY);
      expect(video.videoMimeType).toBe('video/mp4');
      expect(video.videoSize).toBe(1024000);
      expect(video.status).toBe(VideoStatus.UPLOADING);
      expect(video.tags).toEqual([]);
    });

    it('should create dates if not provided', () => {
      const video = Video.create(validProps);

      expect(video.uploadedAt).toBeInstanceOf(Date);
      expect(video.createdAt).toBeInstanceOf(Date);
      expect(video.updatedAt).toBeInstanceOf(Date);
    });

    it('should use provided dates', () => {
      const uploadedAt = new Date('2026-01-01');
      const createdAt = new Date('2026-01-01');
      const updatedAt = new Date('2026-01-02');

      const video = Video.create({
        ...validProps,
        uploadedAt,
        createdAt,
        updatedAt,
      });

      expect(video.uploadedAt).toEqual(uploadedAt);
      expect(video.createdAt).toEqual(createdAt);
      expect(video.updatedAt).toEqual(updatedAt);
    });

    it('should create a video with tags', () => {
      const tags = ['typescript', 'tutorial', 'programming'];
      const video = Video.create({
        ...validProps,
        tags,
      });

      expect(video.tags).toEqual(tags);
    });

    it('should create a video with custom status', () => {
      const video = Video.create({
        ...validProps,
        status: VideoStatus.PROCESSING,
      });

      expect(video.status).toBe(VideoStatus.PROCESSING);
    });

    it('should create a video with optional description', () => {
      const video = Video.create({
        id: '123',
        title: 'Test Video',
        category: VideoCategory.TECHNOLOGY,
        videoFilename: 'test-video.mp4',
        videoMimeType: 'video/mp4',
        videoSize: 1024000,
        thumbFilename: 'thumb.jpg',
        thumbMimeType: 'image/jpeg',
        thumbSize: 51200,
      });

      expect(video.description).toBeUndefined();
    });
  });

  describe('getters', () => {
    it('should return id', () => {
      const video = Video.create(validProps);
      expect(video.id).toBe('123');
    });

    it('should return title', () => {
      const video = Video.create(validProps);
      expect(video.title).toBe('Test Video');
    });

    it('should return description', () => {
      const video = Video.create(validProps);
      expect(video.description).toBe('Test Description');
    });

    it('should return category', () => {
      const video = Video.create(validProps);
      expect(video.category).toBe(VideoCategory.TECHNOLOGY);
    });

    it('should return videoMimeType', () => {
      const video = Video.create(validProps);
      expect(video.videoMimeType).toBe('video/mp4');
    });

    it('should return videoSize', () => {
      const video = Video.create(validProps);
      expect(video.videoSize).toBe(1024000);
    });

    it('should return uploadedAt', () => {
      const video = Video.create(validProps);
      expect(video.uploadedAt).toBeInstanceOf(Date);
    });

    it('should return createdAt', () => {
      const video = Video.create(validProps);
      expect(video.createdAt).toBeInstanceOf(Date);
    });

    it('should return updatedAt', () => {
      const video = Video.create(validProps);
      expect(video.updatedAt).toBeInstanceOf(Date);
    });

    it('should return tags', () => {
      const tags = ['test', 'video'];
      const video = Video.create({ ...validProps, tags });
      expect(video.tags).toEqual(tags);
    });

    it('should return status', () => {
      const video = Video.create(validProps);
      expect(video.status).toBe(VideoStatus.UPLOADING);
    });
  });

  describe('retitle', () => {
    it('should update the title', () => {
      const video = Video.create(validProps);
      video.retitle('New Title');

      expect(video.title).toBe('New Title');
    });

    it('should update the updatedAt timestamp', () => {
      const video = Video.create(validProps);
      const originalUpdatedAt = video.updatedAt;

      // Small delay to ensure timestamp differs
      const delay = new Promise(resolve => setTimeout(resolve, 10));

      delay.then(() => {
        video.retitle('New Title');
        expect(video.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      });
    });
  });

  describe('redescribe', () => {
    it('should update the description', () => {
      const video = Video.create(validProps);
      video.redescribe('New Description');

      expect(video.description).toBe('New Description');
    });

    it('should update the updatedAt timestamp', () => {
      const video = Video.create(validProps);
      const originalUpdatedAt = video.updatedAt;

      const delay = new Promise(resolve => setTimeout(resolve, 10));

      delay.then(() => {
        video.redescribe('New Description');
        expect(video.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      });
    });
  });

  describe('recategorize', () => {
    it('should update the category', () => {
      const video = Video.create(validProps);
      video.recategorize(VideoCategory.ENTERTAINMENT);

      expect(video.category).toBe(VideoCategory.ENTERTAINMENT);
    });

    it('should update the updatedAt timestamp', () => {
      const video = Video.create(validProps);
      const originalUpdatedAt = video.updatedAt;

      const delay = new Promise(resolve => setTimeout(resolve, 10));

      delay.then(() => {
        video.recategorize(VideoCategory.MUSIC);
        expect(video.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      });
    });
  });

  describe('setUploadedAt', () => {
    it('should update the uploadedAt date', () => {
      const video = Video.create(validProps);
      const newDate = new Date('2026-02-21');

      video.setUploadedAt(newDate);

      expect(video.uploadedAt).toEqual(newDate);
    });

    it('should update the updatedAt timestamp', () => {
      const video = Video.create(validProps);
      const originalUpdatedAt = video.updatedAt;

      const delay = new Promise(resolve => setTimeout(resolve, 10));

      delay.then(() => {
        video.setUploadedAt(new Date());
        expect(video.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      });
    });
  });

  describe('retag', () => {
    it('should update the tags', () => {
      const video = Video.create(validProps);
      const newTags = ['tutorial', 'javascript', 'beginner'];

      video.retag(newTags);

      expect(video.tags).toEqual(newTags);
    });

    it('should replace existing tags', () => {
      const video = Video.create({ ...validProps, tags: ['old', 'tags'] });
      const newTags = ['new', 'tags'];

      video.retag(newTags);

      expect(video.tags).toEqual(newTags);
    });

    it('should update the updatedAt timestamp', () => {
      const video = Video.create(validProps);
      const originalUpdatedAt = video.updatedAt;

      const delay = new Promise(resolve => setTimeout(resolve, 10));

      delay.then(() => {
        video.retag(['tag1', 'tag2']);
        expect(video.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      });
    });

    it('should allow clearing tags', () => {
      const video = Video.create({ ...validProps, tags: ['old', 'tags'] });

      video.retag([]);

      expect(video.tags).toEqual([]);
    });
  });

  describe('updateStatus', () => {
    it('should update the status', () => {
      const video = Video.create(validProps);

      video.updateStatus(VideoStatus.PROCESSED);

      expect(video.status).toBe(VideoStatus.PROCESSED);
    });

    it('should transition from uploading to uploaded', () => {
      const video = Video.create(validProps);
      expect(video.status).toBe(VideoStatus.UPLOADING);

      video.updateStatus(VideoStatus.UPLOADED);

      expect(video.status).toBe(VideoStatus.UPLOADED);
    });

    it('should transition from uploaded to processing', () => {
      const video = Video.create({ ...validProps, status: VideoStatus.UPLOADED });

      video.updateStatus(VideoStatus.PROCESSING);

      expect(video.status).toBe(VideoStatus.PROCESSING);
    });

    it('should transition from processing to processed', () => {
      const video = Video.create({ ...validProps, status: VideoStatus.PROCESSING });

      video.updateStatus(VideoStatus.PROCESSED);

      expect(video.status).toBe(VideoStatus.PROCESSED);
    });

    it('should allow transitioning to failed status', () => {
      const video = Video.create({ ...validProps, status: VideoStatus.PROCESSING });

      video.updateStatus(VideoStatus.FAILED);

      expect(video.status).toBe(VideoStatus.FAILED);
    });

    it('should update the updatedAt timestamp', () => {
      const video = Video.create(validProps);
      const originalUpdatedAt = video.updatedAt;

      const delay = new Promise(resolve => setTimeout(resolve, 10));

      delay.then(() => {
        video.updateStatus(VideoStatus.PROCESSED);
        expect(video.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      });
    });
  });

  describe('immutable properties', () => {
    it('should not allow changing id', () => {
      const video = Video.create(validProps);

      expect(() => {
        (video as any).id = '999';
      }).toThrow();
    });

    it('should not allow changing videoMimeType', () => {
      const video = Video.create(validProps);

      expect(() => {
        (video as any).videoMimeType = 'video/avi';
      }).toThrow();
    });

    it('should not allow changing videoSize', () => {
      const video = Video.create(validProps);

      expect(() => {
        (video as any).videoSize = 2048000;
      }).toThrow();
    });

    it('should not allow changing createdAt', () => {
      const video = Video.create(validProps);

      expect(() => {
        (video as any).createdAt = new Date();
      }).toThrow();
    });
  });

  describe('category enum', () => {
    it('should have all expected categories', () => {
      expect(VideoCategory.EDUCATION).toBe('education');
      expect(VideoCategory.ENTERTAINMENT).toBe('entertainment');
      expect(VideoCategory.GAMING).toBe('gaming');
      expect(VideoCategory.MUSIC).toBe('music');
      expect(VideoCategory.NEWS).toBe('news');
      expect(VideoCategory.SPORTS).toBe('sports');
      expect(VideoCategory.TECHNOLOGY).toBe('technology');
      expect(VideoCategory.TRAVEL).toBe('travel');
      expect(VideoCategory.OTHER).toBe('other');
    });
  });

  describe('status enum', () => {
    it('should have all expected statuses', () => {
      expect(VideoStatus.UPLOADING).toBe('uploading');
      expect(VideoStatus.UPLOADED).toBe('uploaded');
      expect(VideoStatus.PROCESSING).toBe('processing');
      expect(VideoStatus.PROCESSED).toBe('processed');
      expect(VideoStatus.FAILED).toBe('failed');
    });
  });
});
