import categoryController from "../controllers/categoryController.js";
import express from "express";
import checkRole from "../middleware/checkRole.js"

const router = express.Router()

router.get("/:id", categoryController.getCategory);
router.get("/", categoryController.getAllCategories);
router.post("/", categoryController.addCategory);
router.delete("/:id", checkRole("admin"), categoryController.deleteCategory);
router.put("/:id", categoryController.updateCategory);

export default router;
