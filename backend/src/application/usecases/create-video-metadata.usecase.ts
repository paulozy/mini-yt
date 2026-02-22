import { randomUUID as uuid } from "node:crypto";
import { Video } from "../../domain/entities/video.entity";
import { IVideosRepository } from "../../domain/repositories/videos-repository.interface";
import { IStorageService } from "../../domain/services/storage/storage.interface";
import { CreateVideoMetadataDTO } from "../dtos/create-video-metadata.dto";

export type CreateVideoMetadataResult = {
  videoMetadata: Video;
  presignedUrls: {
    video: { uploadId: string; url: string };
    thumbnail: { url: string };
  }
}

export class CreateVideoMetadataUseCase {
  constructor(
    private readonly videoRepository: IVideosRepository,
    private readonly storageService: IStorageService
  ) { }

  async execute(payload: CreateVideoMetadataDTO): Promise<CreateVideoMetadataResult> {
    const { title, description, category, tags, video, thumbnail } = payload;

    const videoMetadata = Video.create({
      id: uuid(),
      title,
      description,
      category,
      tags,
      videoFilename: video.filename,
      videoMimeType: video.mimeType,
      videoSize: video.size,
      thumbFilename: thumbnail.filename,
      thumbMimeType: thumbnail.mimeType,
      thumbSize: thumbnail.size,
    });

    await this.videoRepository.save(videoMetadata);

    const { uploadId, url: presignedVideoUrl } = await this.storageService.initiateMultipartUpload({
      id: videoMetadata.id,
      filename: videoMetadata.videoFilename,
      mimeType: videoMetadata.videoMimeType,
      resourceType: "video",
    })
    const presignedThumbnailUrl = await this.storageService.presign({
      id: videoMetadata.id,
      filename: videoMetadata.thumbFilename,
      mimeType: videoMetadata.thumbMimeType,
      resourceType: "thumb",
    });

    return {
      videoMetadata,
      presignedUrls: {
        video: { uploadId, url: presignedVideoUrl },
        thumbnail: { url: presignedThumbnailUrl },
      },
    }
  }
}