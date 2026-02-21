import { DrizzleDatabase } from "../infra/database/drizzle";
import { DrizzleVideosRepository } from "../infra/database/drizzle/repositories/videos.repository";
import { VideosController } from "./controllers/videos.controller";
import { CreateVideoMetadataUseCase } from "./usecases/create-video-metadata.usecase";

export function makeVideosController(): VideosController {
  const dbInstance = DrizzleDatabase.getInstance().getDb();

  const videosRepository = new DrizzleVideosRepository(dbInstance);
  const createVideoMetadataUseCase = new CreateVideoMetadataUseCase(videosRepository as any);

  return new VideosController(createVideoMetadataUseCase);
}