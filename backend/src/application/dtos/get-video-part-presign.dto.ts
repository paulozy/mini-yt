import * as z from "zod";

export const getVideoPartPresignUrlSchema = z.object({
  videoId: z.string().min(1, "Video ID is required"),
  filename: z.string().min(1, "Filename is required"),
  mimeType: z.string().min(1, "MIME type is required"),
  uploadId: z.string().min(1, "Upload ID is required"),
  partNumber: z.number().int().positive("Part number must be a positive integer"),
});

export type GetVideoPartPresignUrlDTO = z.infer<typeof getVideoPartPresignUrlSchema>;