import { Request, Response } from "express";
import z from "zod";
import { createVideoMetadataSchema } from "../dtos/create-video-metadata.dto";
import { CreateVideoMetadataUseCase } from "../usecases/create-video-metadata.usecase";
import { VideosControllerMapper } from "./videos-controller.mapper";

export class VideosController {
  constructor(
    private readonly createVideoMetadataUseCase: CreateVideoMetadataUseCase
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
}