import express from "express"
import accessLogController from "../controllers/accessLogController.js"

const router = express.Router();

router.post("/", accessLogController.saveLog);
router.get("/stats", accessLogController.getLogStat);

export default router;