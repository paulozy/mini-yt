import { randomUUID as uuid } from "node:crypto";
import { Video } from "../../domain/entities/video.entity";
import { IVideosRepository } from "../../domain/repositories/videos.repository";
import { CreateVideoMetadataDTO } from "../dtos/create-video-metadata.dto";

export class CreateVideoMetadataUseCase {
  constructor(private readonly videoRepository: IVideosRepository) { }

  async execute(payload: CreateVideoMetadataDTO): Promise<any> {
    const videoMetadata = Video.create({
      id: uuid(),
      title: payload.title,
      description: payload.description,
      category: payload.category,
      tags: payload.tags,
      mimeType: payload.mimeType,
      size: payload.size,
    });
    await this.videoRepository.save(videoMetadata);

    // TODO: pre-signed URL generation and return it here with the video metadata

    return videoMetadata;
  }
}