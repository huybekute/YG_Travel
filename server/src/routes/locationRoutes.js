import locationController from "../controllers/locationController.js";
import express from "express";
import checkRole from "../middleware/checkRole.js"

const router = express.Router()

router.get("/:id", locationController.getLocation);
router.get("/", locationController.getAllLocations);

router.post("/", checkRole("ADMIN"), locationController.addLocation);
router.delete("/:id",checkRole("ADMIN"), locationController.deleteLocation);
router.put("/:id", checkRole("ADMIN"), locationController.updateLocation);

export default router;
