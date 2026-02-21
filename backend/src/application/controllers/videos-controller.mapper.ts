import { Video } from "../../domain/entities/video.entity";

export class VideosControllerMapper {
  static toHttp(video: Video) {
    return {
      id: video.id,
      title: video.title,
      description: video.description,
      category: video.category,
      tags: video.tags,
      status: video.status,
      videoFilename: video.videoFilename,
      videoMimeType: video.videoMimeType,
      videoSize: video.videoSize,
      videoManifestUrl: video.videoManifestUrl,
      thumbFilename: video.thumbFilename,
      thumbMimeType: video.thumbMimeType,
      thumbSize: video.thumbSize,
      thumbUrl: video.thumbUrl,
      createdAt: video.createdAt.toISOString(),
      updatedAt: video.updatedAt.toISOString(),
      uploadedAt: video.uploadedAt.toISOString(),
    };
  }
}