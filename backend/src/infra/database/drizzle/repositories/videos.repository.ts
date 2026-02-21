import { eq } from "drizzle-orm";
import { LibSQLDatabase } from "drizzle-orm/libsql";
import { Video } from "../../../../domain/entities/video.entity";
import { IVideosRepository } from "../../../../domain/repositories/videos.repository";
import { VideosMapper } from "../mappers/videos.mapper";
import { videosTable } from "../schema";

export class DrizzleVideosRepository implements IVideosRepository {
  constructor(private readonly drizzleClient: LibSQLDatabase) { }

  async save(video: Video): Promise<void> {
    const raw = VideosMapper.toPersistence(video);

    const stmt: typeof videosTable.$inferInsert = { ...raw };
    await this.drizzleClient.insert(videosTable).values(stmt);
  }

  async findById(id: string): Promise<Video | null> {
    const raw = await this.drizzleClient
      .select()
      .from(videosTable)
      .where(eq(videosTable.id, id))
      .get();

    return raw ? VideosMapper.toDomain(raw) : null;
  }

  async findAll(): Promise<Video[]> {
    const raws = await this.drizzleClient
      .select()
      .from(videosTable)
      .all();

    return raws.map(VideosMapper.toDomain);
  }
}