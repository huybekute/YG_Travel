import imageLocationController from "../controllers/imageLocationController.js";
import express from "express";
import checkRole from "../middleware/checkRole.js"
import upload from "../middleware/upload.js";

const router = express.Router()

router.get("/location/:locationID", imageLocationController.getImageByLocation);
router.get("/", imageLocationController.getAllImages);
router.get("/:id", imageLocationController.getImage);

router.post("/", upload.array('images', 20), imageLocationController.addImage);
router.delete("/:id", imageLocationController.deleteImage);
router.put("/:id", checkRole("ADMIN"), imageLocationController.updateImage);
export default router;
