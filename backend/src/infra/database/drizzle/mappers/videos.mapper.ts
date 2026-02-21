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
      mimeType: raw.mime_type,
      size: raw.size,
      createdAt: raw.created_at,
      updatedAt: raw.updated_at,
      uploadedAt: raw.uploaded_at,
    });
  }

  static toPersistence(video: Video): any {
    return {
      id: video.id,
      title: video.title,
      description: video.description,
      category: video.category,
      tags: video.tags.join(","),
      mime_type: video.mimeType,
      size: video.size,
      status: video.status,
      created_at: video.createdAt,
      updated_at: video.updatedAt,
      uploaded_at: video.uploadedAt,
    };
  }
}