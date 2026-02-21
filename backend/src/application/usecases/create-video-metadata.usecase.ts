import { randomUUID as uuid } from "node:crypto";
import { Video } from "../../domain/entities/video.entity";
import { IVideosRepository } from "../../domain/repositories/videos-repository.interface";
import { IStorageService } from "../../domain/services/storage/storage.interface";
import { CreateVideoMetadataDTO } from "../dtos/create-video-metadata.dto";

export class CreateVideoMetadataUseCase {
  constructor(
    private readonly videoRepository: IVideosRepository,
    private readonly storageService: IStorageService
  ) { }

  async execute(payload: CreateVideoMetadataDTO): Promise<any> {
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

    const presignedVideoUrl = await this.storageService.presign(
      videoMetadata.id,
      videoMetadata.videoFilename,
      videoMetadata.videoMimeType
    );
    const presignedThumbnailUrl = await this.storageService.presign(
      videoMetadata.id,
      videoMetadata.thumbFilename,
      videoMetadata.thumbMimeType
    );

    return {
      videoMetadata,
      presignedUrls: {
        video: presignedVideoUrl,
        thumbnail: presignedThumbnailUrl,
      },
    }
  }
}