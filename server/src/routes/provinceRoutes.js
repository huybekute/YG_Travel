import provinceController from "../controllers/provinceController.js";
import express from "express"
import checkRole from "../middleware/checkRole.js";

const router = express.Router()

router.post("/addProvince",checkRole("admin") ,provinceController.addProvince);
router.get("/:id",checkRole("admin") , provinceController.getProvince);
router.get("/",checkRole("admin") , provinceController.getAllProvinces);
router.put("/:id",checkRole("admin") , provinceController.updateProvince);
router.delete("/:id",checkRole("admin") , provinceController.deleteProvince);

export default router;