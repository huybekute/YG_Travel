import provinceController from "../controllers/provinceController.js";
import express from "express"
import checkRole from "../middleware/checkRole.js";

const router = express.Router()

router.get("/:id", provinceController.getProvince);
router.get("/", provinceController.getAllProvinces);
router.post("/addProvince",checkRole("ADMIN") ,provinceController.addProvince);
router.put("/:id",checkRole("ADMIN") , provinceController.updateProvince);
router.delete("/:id",checkRole("ADMIN") , provinceController.deleteProvince);

export default router;