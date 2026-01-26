import locationController from "../controllers/locationController.js";
import express from "express";
import checkRole from "../middleware/checkRole.js"
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router()

router.get("/:id", locationController.getLocation);
router.get("/", locationController.getAllLocations);

router.post("/", verifyToken ,checkRole("ADMIN"), locationController.addLocation);
router.delete("/:id", verifyToken, checkRole("ADMIN"), locationController.deleteLocation);
router.put("/:id",verifyToken ,checkRole("ADMIN"), locationController.updateLocation);

export default router;
