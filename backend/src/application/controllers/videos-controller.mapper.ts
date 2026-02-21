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
      mimeType: video.mimeType,
      size: video.size,
      createdAt: video.createdAt.toISOString(),
      updatedAt: video.updatedAt.toISOString(),
      uploadedAt: video.uploadedAt.toISOString(),
    };
  }
}