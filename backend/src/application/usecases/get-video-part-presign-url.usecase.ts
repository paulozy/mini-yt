import { IStorageService } from "../../domain/services/storage/storage.interface";
import { GetVideoPartPresignUrlDTO } from "../dtos/get-video-part-presign.dto";

export class GetVideoPartPresignUrlUseCase {
  constructor(
    private readonly storageService: IStorageService
  ) { }

  async execute(payload: GetVideoPartPresignUrlDTO): Promise<string> {
    const { videoId, filename, mimeType, uploadId, partNumber } = payload;

    const presignUrl = await this.storageService.presign({
      id: videoId,
      filename,
      mimeType,
      part: partNumber,
      resourceType: "video",
      uploadId,
    });

    return presignUrl;
  }
}