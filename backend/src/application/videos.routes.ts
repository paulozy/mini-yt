import { Request, Response, Router } from "express";
import { makeVideosController } from "./videos.factory";

const videosRouter = Router();

const videosController = makeVideosController();

videosRouter.post("/", (req: Request, res: Response) => videosController.createVideoMetadata(req, res));
videosRouter.post("/:videoId/presign", (req: Request, res: Response) => videosController.getVideoPartPresignUrl(req, res));

export { videosRouter };
