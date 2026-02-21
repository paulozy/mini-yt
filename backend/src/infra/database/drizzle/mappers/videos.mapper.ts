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
      videoFilename: raw.videoFilename,
      videoMimeType: raw.videoMimeType,
      videoSize: raw.videoSize,
      videoManifestUrl: raw.videoManifestUrl,
      thumbFilename: raw.thumbFilename,
      thumbMimeType: raw.thumbMimeType,
      thumbSize: raw.thumbSize,
      thumbUrl: raw.thumbUrl,
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
      videoFilename: video.videoFilename,
      videoMimeType: video.videoMimeType,
      videoSize: video.videoSize,
      videoManifestUrl: video.videoManifestUrl,
      thumbFilename: video.thumbFilename,
      thumbMimeType: video.thumbMimeType,
      thumbSize: video.thumbSize,
      thumbUrl: video.thumbUrl,
      uploadedAt: video.uploadedAt.getTime(),
      createdAt: video.createdAt.getTime(),
      updatedAt: video.updatedAt.getTime(),
    };
  }
}