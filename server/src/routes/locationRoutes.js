import locationController from "../controllers/locationController.js";
import express from "express";
import checkRole from "../middleware/checkRole.js"

const router = express.Router()

router.get("/:id", locationController.getLocation);
router.get("/", locationController.getAllLocations);

router.post("/", checkRole("admin"), locationController.addLocation);
router.delete("/:id",checkRole("admin"), locationController.deleteLocation);
router.put("/:id", checkRole("admin"), locationController.updateLocation);

export default router;
