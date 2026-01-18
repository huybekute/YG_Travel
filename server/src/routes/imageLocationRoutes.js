import imageLocationController from "../controllers/imageLocationController.js";
import express from "express";
import checkRole from "../middleware/checkRole.js"

const router = express.Router()

router.get("/location/:idLocation", imageLocationController.getImageByLocation);
router.get("/", imageLocationController.getAllImages);
router.get("/:id", imageLocationController.getImage);

router.post("/", checkRole("admin"), imageLocationController.addImage);
router.delete("/:id",checkRole("admin"), imageLocationController.deleteImage);
router.put("/:id", checkRole("admin"), imageLocationController.updateImage);
export default router;
