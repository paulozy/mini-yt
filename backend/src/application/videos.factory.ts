import { DrizzleDatabase } from "../infra/database/drizzle";
import { DrizzleVideosRepository } from "../infra/database/drizzle/repositories/videos.repository";
import { S3StorageService } from "../infra/services/storage/s3";
import { VideosController } from "./controllers/videos.controller";
import { CreateVideoMetadataUseCase } from "./usecases/create-video-metadata.usecase";

export function makeVideosController(): VideosController {
  const dbInstance = DrizzleDatabase.getInstance().getDb();
  const videosRepository = new DrizzleVideosRepository(dbInstance);
  const storageService = new S3StorageService();

  const createVideoMetadataUseCase = new CreateVideoMetadataUseCase(videosRepository, storageService);

  return new VideosController(createVideoMetadataUseCase);
}