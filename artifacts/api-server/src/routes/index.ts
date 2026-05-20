import { Router, type IRouter } from "express";
import healthRouter from "./health";
import surveysRouter from "./surveys";
import surveyResponsesRouter from "./survey-responses";
import casesRouter from "./cases";
import usersRouter from "./users";
import dashboardRouter from "./dashboard";
import notificationsRouter from "./notifications";

const router: IRouter = Router();

router.use(healthRouter);
router.use(surveysRouter);
router.use(surveyResponsesRouter);
router.use(casesRouter);
router.use(usersRouter);
router.use(dashboardRouter);
router.use(notificationsRouter);

export default router;
