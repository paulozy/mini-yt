import { Router } from "express";
import { videosRouter } from "../../application/videos.routes";

const routes = Router();

routes.use("/videos", videosRouter);

export { routes };
