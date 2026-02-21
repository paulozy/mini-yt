import { Request, Response, Router } from "express";
import { makeVideosController } from "./videos.factory";

const videosRouter = Router();

const videosController = makeVideosController();

videosRouter.post("/", (req: Request, res: Response) => videosController.createVideoMetadata(req, res));

export { videosRouter };
