import * as z from "zod";
import { VideoCategory } from "../../domain/entities/video.entity";

export const createVideoMetadataSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  category: z.enum(Object.values(VideoCategory)),
  tags: z.array(z.string()).optional(),
  mimeType: z.string().min(1, "MIME type is required"),
  size: z.number().positive("Size must be a positive number"),
});

export type CreateVideoMetadataDTO = z.infer<typeof createVideoMetadataSchema>;
