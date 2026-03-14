import locationDetailController from "../controllers/locationDetailController.js";
import express from "express";

const router = express.Router()

router.post("/add", locationDetailController.addLocationDetail)
router.get("/:locationID", locationDetailController.getDetailsByLocation)
router.delete("/delete/:id", locationDetailController.deleteLocationDetail);
router.put("/detail/:id", locationDetailController.updateLocationDetail)

export default router;