import * as z from "zod";
import { VideoCategory } from "../../domain/entities/video.entity";

export const createVideoMetadataSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  category: z.enum(Object.values(VideoCategory)),
  tags: z.array(z.string()).optional(),
  video: z.object({
    filename: z.string().min(1, "Filename is required"),
    mimeType: z.string().min(1, "MIME type is required"),
    size: z.number().positive("Size must be a positive number"),
  }).refine(data => data.mimeType.startsWith("video/"), {
    message: "File must be a video",
  }),
  thumbnail: z.object({
    filename: z.string().min(1, "Filename is required"),
    mimeType: z.string().min(1, "MIME type is required"),
    size: z.number().positive("Size must be a positive number"),
  }).refine(data => data.mimeType.startsWith("image/"), {
    message: "File must be an image",
  }),
});

export type CreateVideoMetadataDTO = z.infer<typeof createVideoMetadataSchema>;
