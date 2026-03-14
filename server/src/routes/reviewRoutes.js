import express from "express"
import reviewController from "../controllers/reviewController.js"
import verifyToken from "../middleware/verifyToken.js";
import checkRole from "../middleware/checkRole.js"

const router = express.Router();

router.get("/location/:id", reviewController.getReviewsByLocation)
router.post("/saveReview", verifyToken, reviewController.saveReview)
router.get("/stats", reviewController.statReview)
router.put("/update/:id", verifyToken, checkRole("ADMIN"), reviewController.updateStatusReview)
router.get("/admin/location/:id", verifyToken, checkRole("ADMIN"), reviewController.getReviewsByLocationForAdmin)
router.delete("/delete/:id", verifyToken, checkRole("ADMIN"), reviewController.deleteReview)

export default router;