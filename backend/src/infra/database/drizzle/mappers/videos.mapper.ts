import { Video } from "../../../../domain/entities/video.entity";

export class VideosMapper {
  static toDomain(raw: any): Video {
    return Video.create({
      id: raw.id,
      title: raw.title,
      description: raw.description,
      category: raw.category,
      tags: raw.tags.split(","),
      status: raw.status,
      mimeType: raw.mimeType,
      size: raw.size,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      uploadedAt: raw.uploadedAt,
    });
  }

  static toPersistence(video: Video): any {
    return {
      id: video.id,
      title: video.title,
      description: video.description,
      category: video.category,
      tags: video.tags.join(","),
      status: video.status,
      mimeType: video.mimeType,
      size: video.size,
      uploadedAt: video.uploadedAt.getTime(),
      createdAt: video.createdAt.getTime(),
      updatedAt: video.updatedAt.getTime(),
    };
  }
}