import { DrizzleDatabase } from "../infra/database/drizzle";
import { DrizzleVideosRepository } from "../infra/database/drizzle/repositories/videos.repository";
import { CreateVideoMetadataUseCase } from "./usecases/create-video-metadata.usecase";
import { VideosController } from "./videos.controller";

export function makeVideosController(): VideosController {
  const dbInstance = DrizzleDatabase.getInstance().getDb();

  const videosRepository = new DrizzleVideosRepository(dbInstance);
  const createVideoMetadataUseCase = new CreateVideoMetadataUseCase(videosRepository as any);

  return new VideosController(createVideoMetadataUseCase);
}