import { DrizzleDatabase } from "../infra/database/drizzle";
import { DrizzleVideosRepository } from "../infra/database/drizzle/repositories/videos.repository";
import { VideosController } from "./controllers/videos.controller";
import { CreateVideoMetadataUseCase } from "./usecases/create-video-metadata.usecase";

export function makeVideosController(): VideosController {
  const dbInstance = DrizzleDatabase.getInstance().getDb();

  const storageService = {} as any; // TODO: implement storage service and inject here

  const videosRepository = new DrizzleVideosRepository(dbInstance);
  const createVideoMetadataUseCase = new CreateVideoMetadataUseCase(videosRepository, storageService);

  return new VideosController(createVideoMetadataUseCase);
}