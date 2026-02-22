import { Request, Response } from "express";
import z from "zod";
import { createVideoMetadataSchema } from "../dtos/create-video-metadata.dto";
import { getVideoPartPresignUrlSchema } from "../dtos/get-video-part-presign.dto";
import { CreateVideoMetadataUseCase } from "../usecases/create-video-metadata.usecase";
import { GetVideoPartPresignUrlUseCase } from "../usecases/get-video-part-presign-url.usecase";
import { VideosControllerMapper } from "./videos-controller.mapper";

export class VideosController {
  constructor(
    private readonly createVideoMetadataUseCase: CreateVideoMetadataUseCase,
    private readonly getVideoPartPresignUrlUseCase: GetVideoPartPresignUrlUseCase
  ) { }

  async createVideoMetadata(req: Request, res: Response): Promise<void> {
    try {
      const { body } = req;

      const { data, success, error } = z.safeParse(createVideoMetadataSchema, body);

      if (!success) {
        res.status(400).json({ error: error.format() });
        return;
      }

      const {
        presignedUrls,
        videoMetadata
      } = await this.createVideoMetadataUseCase.execute(data);

      res.status(201).json({
        video: VideosControllerMapper.toHttp(videoMetadata),
        presignedUrls,
      });
    } catch (error) {
      console.error("Error creating video metadata:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getVideoPartPresignUrl(req: Request, res: Response): Promise<void> {
    try {
      const { videoId } = req.params;
      const { filename, mimeType, uploadId, partNumber } = req.body;

      const { data, success, error } = z.safeParse(getVideoPartPresignUrlSchema, {
        videoId,
        filename,
        mimeType,
        uploadId,
        partNumber,
      })

      if (!success) {
        res.status(400).json({ error: error.format() });
        return;
      }

      const presignUrl = await this.getVideoPartPresignUrlUseCase.execute(data);

      res.status(200).json({ presignUrl });
    } catch (error) {
      console.error("Error getting video part presign URL:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}