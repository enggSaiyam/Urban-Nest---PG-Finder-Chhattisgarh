import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import citiesRouter from "./cities";
import pgsRouter from "./pgs";
import complaintsRouter from "./complaints";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(citiesRouter);
router.use(pgsRouter);
router.use(complaintsRouter);
router.use(dashboardRouter);

export default router;
