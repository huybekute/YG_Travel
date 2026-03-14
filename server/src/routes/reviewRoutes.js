import express from "express"
import reviewController from "../controllers/reviewController.js"
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/location/:id", reviewController.getReviewsByLocation)
router.post("/saveReview", verifyToken, reviewController.saveReview)
router.get("/stats", reviewController.statReview)

export default router;